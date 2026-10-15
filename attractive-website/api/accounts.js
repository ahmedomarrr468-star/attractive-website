// Vercel serverless function: shared storage for user accounts + VIP email subscribers.  Place at api/accounts.js
//
// Public actions (no secret):  register, login, google, logout, me, subscribe
// Admin actions (Bearer token from /api/admin-login):  GET (list everything), POST {action:'adminReplace'}
//
// Data is stored AES-256-GCM encrypted (see _vault.js) so even a leaked blob URL exposes nothing.
// Passwords are scrypt hashes (async, doesn't block the event loop). Sessions expire after 30 days.
import crypto from 'crypto';
import { promisify } from 'util';
import { getSecret, isAdmin, safeEqual, rateLimit, tooMany, readBody } from './_auth.js';
import { readJson, mutate, pathFor, removePath } from './_vault.js';
import { readStoreRaw } from './_store.js';
import { verifyGoogleCredential } from './_google.js';

const scrypt = promisify(crypto.scrypt);
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MIN_PASSWORD = 8;

const dataPath = () => pathFor('accounts', 'accounts.json');
// Paths used by the previous version: derived from the OLD admin secret, plaintext.
// Candidates: LEGACY_ADMIN_SECRET (set this to your old password if it wasn't attractive2026), ADMIN_SECRET, the current secret, and the old default.
const legacyPaths = () => {
    const secrets = [process.env.LEGACY_ADMIN_SECRET, process.env.ADMIN_SECRET, getSecret(), 'attractive2026'].filter(Boolean);
    return [...new Set(secrets)].map(sec =>
        'private-data/' + crypto.createHash('sha256').update('accounts:' + sec).digest('hex').slice(0, 32) + '/accounts.json');
};

function normalize(d) {
    d = d || {};
    return { members: Array.isArray(d.members) ? d.members : [], accounts: Array.isArray(d.accounts) ? d.accounts : [], legacyMigrated: !!d.legacyMigrated };
}

// A real read error THROWS (so the migration is retried on the next request instead of being marked done with nothing imported).
async function readLegacy() {
    const out = { members: [], accounts: [], files: [] };
    for (const p of legacyPaths()) {
        const cur = await readJson(p);
        if (!cur) continue; // file simply does not exist
        const d = normalize(cur.data);
        out.members.push(...d.members);
        out.accounts.push(...d.accounts);
        out.files.push(p);
    }
    return out;
}
async function tryLegacy() {
    try { return await readLegacy(); } catch (e) { console.error('legacy read failed, will retry:', e); return null; }
}

// Legacy accounts kept the password as base64 ("passwordEncoded", which is readable by anyone). Turn it into a scrypt hash.
async function upgradeLegacyPasswords(list) {
    for (const a of list) {
        if (a && !a.passwordHash && a.passwordEncoded) {
            try { a.passwordHash = await hashPassword(Buffer.from(String(a.passwordEncoded), 'base64').toString('utf8')); } catch (e) { /* leave without a hash: that user resets via WhatsApp */ }
        }
        if (a) delete a.passwordEncoded;
    }
}

// One-time import of accounts/members stored by the old version. If the same e-mail already exists
// (e.g. the customer re-registered because login failed), the ORIGINAL legacy account wins so the old password works again.
async function mergeLegacy(data, legacy) {
    const idx = (list) => new Map(list.map((x, i) => [(x.email || '').toLowerCase(), i]));
    const accIdx = idx(data.accounts);
    const ids = new Set(data.accounts.map(a => a.id));
    legacy.accounts.forEach(a => {
        const e = (a.email || '').toLowerCase();
        if (!e || ids.has(a.id)) return;
        if (accIdx.has(e)) { data.accounts[accIdx.get(e)] = a; }
        else { accIdx.set(e, data.accounts.length); data.accounts.push(a); }
        ids.add(a.id);
    });
    await upgradeLegacyPasswords(data.accounts);
    const memEmails = new Set(data.members.map(m => (m.email || '').toLowerCase()));
    legacy.members.forEach(m => {
        const e = (m.email || '').toLowerCase();
        if (e && !memEmails.has(e)) { memEmails.add(e); data.members.push(m); }
    });
    data.legacyMigrated = true;
}

async function loadReadOnly() {
    const cur = await readJson(dataPath());
    const data = normalize(cur && cur.data);
    if (!data.legacyMigrated) { const lg = await tryLegacy(); if (lg) await mergeLegacy(data, lg); }
    return data;
}

// The old files sit in a PUBLIC blob store under a path derived from the old (leaked) password, so once everything has been
// copied to the encrypted file we delete them. Safety check first: every legacy e-mail must exist in the new file.
async function purgeLegacy(files) {
    const cur = await readJson(dataPath());
    const data = normalize(cur && cur.data);
    if (!cur || !data.legacyMigrated) return;
    const have = new Set(data.accounts.map(a => (a.email || '').toLowerCase()));
    const haveM = new Set(data.members.map(m => (m.email || '').toLowerCase()));
    for (const p of files) {
        const old = await readJson(p).catch(() => null);
        if (!old) continue;
        const d = normalize(old.data);
        const complete = d.accounts.every(a => have.has((a.email || '').toLowerCase())) && d.members.every(m => haveM.has((m.email || '').toLowerCase()));
        if (!complete) { console.error('legacy purge skipped (not everything was copied):', p); continue; }
        await removePath(p);
        console.log('legacy plaintext file removed:', p);
    }
}

// Same as mutate(), but imports the legacy files on the first write (and removes them once safely copied).
async function update(fn) {
    let purge = [], wrote = false;
    const result = await mutate(dataPath(), async (current) => {
        const data = normalize(current);
        purge = []; wrote = false;
        if (!data.legacyMigrated) { const lg = await tryLegacy(); if (lg) { await mergeLegacy(data, lg); purge = lg.files; } }
        const out = await fn(data);
        wrote = !!out;
        return out ? { data, result: out.result } : null;
    });
    if (wrote && purge.length) await purgeLegacy(purge).catch(e => console.error('legacy purge failed:', e));
    return result;
}

async function getSettings() {
    try { const d = (await readStoreRaw()).data; return (d && d.settings) || {}; } catch (e) { return {}; }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clean = (v, n = 120) => String(v == null ? '' : v).trim().slice(0, n);
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');
let _dummy = null;
const dummyHash = async () => _dummy || (_dummy = await hashPassword('timing-equalizer-' + crypto.randomBytes(8).toString('hex')));

async function hashPassword(pw) {
    const salt = crypto.randomBytes(16).toString('hex');
    return salt + ':' + (await scrypt(pw, salt, 64)).toString('hex');
}
async function verifyPassword(pw, stored) {
    if (!stored || stored.indexOf(':') < 0) return false;
    const [salt, hash] = stored.split(':');
    const a = Buffer.from(hash, 'hex');
    const b = await scrypt(String(pw), salt, 64);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function publicAccount(a) {
    const { passwordHash, sessions, createdAtMs, googleSub, passwordEncoded, ...rest } = a;
    return rest;
}

// sessions: [{ h: sha256(token), exp }]  (legacy plain-string entries are ignored => those users just log in again)
function activeSessions(acc) {
    const now = Date.now();
    return (acc.sessions || []).filter(s => s && typeof s === 'object' && s.exp > now);
}
function newSession(acc) {
    const token = crypto.randomBytes(24).toString('hex');
    acc.sessions = [{ h: sha(token), exp: Date.now() + SESSION_TTL_MS }].concat(activeSessions(acc)).slice(0, 5);
    return token;
}

// Admin "save whole list" -> merge into server list without losing sign-ups that happened
// after the admin last pulled (syncedAt) and without touching password hashes.
async function mergeList(kind, existing, incoming, syncedAt) {
    const byId = new Map(existing.map(x => [x.id, x]));
    const takenEmails = new Set(existing.map(x => (x.email || '').toLowerCase()));
    const out = [];
    const seen = new Set();
    for (const item of incoming) {
        if (!item || !item.id || seen.has(item.id)) continue;
        const old = byId.get(item.id);
        if (!old && item.email && takenEmails.has(String(item.email).toLowerCase())) continue; // duplicate email
        seen.add(item.id);
        const merged = Object.assign({}, old || {}, item);
        merged.createdAtMs = (old && old.createdAtMs) || Date.now();
        if (kind === 'accounts') {
            delete merged.passwordEncoded;
            if (old && old.passwordHash) merged.passwordHash = old.passwordHash; else delete merged.passwordHash;
            merged.sessions = (old && old.sessions) || [];
            if (item.passwordEncoded) {
                try {
                    const pw = Buffer.from(String(item.passwordEncoded), 'base64').toString('utf8');
                    if (pw && pw.length >= MIN_PASSWORD && !(await verifyPassword(pw, merged.passwordHash))) {
                        merged.passwordHash = await hashPassword(pw);
                        merged.sessions = [];
                    }
                } catch (e) { /* ignore bad value */ }
            }
            if (!merged.passwordHash && !merged.googleSub) continue; // never create an account that nobody can sign in to
        }
        out.push(merged);
    }
    for (const x of existing) {
        if (!seen.has(x.id) && (x.createdAtMs || 0) > syncedAt) out.push(x); // created after admin's last pull
    }
    return out;
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (!getSecret()) {
        return res.status(500).json({ error: 'Server not configured: missing ADMIN_API_SECRET env var' });
    }
    const admin = isAdmin(req);

    try {
        if (req.method === 'GET') {
            if (!admin) return res.status(401).json({ error: 'Unauthorized' });
            const data = await loadReadOnly();
            return res.status(200).json({ members: data.members, accounts: data.accounts.map(publicAccount), serverTime: Date.now() });
        }
        if (req.method !== 'POST') {
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).end('Method not allowed');
        }

        const b = await readBody(req);
        const action = b.action;

        if (action === 'adminReplace') {
            if (!admin) return res.status(401).json({ error: 'Unauthorized' });
            if ((b.kind !== 'accounts' && b.kind !== 'members') || !Array.isArray(b.list) || b.list.length > 20000) {
                return res.status(400).json({ error: 'Bad request' });
            }
            await update(async (data) => {
                data[b.kind] = await mergeList(b.kind, data[b.kind], b.list, Number(b.syncedAt) || 0);
                return { result: true };
            });
            return res.status(200).json({ success: true });
        }

        if (action === 'register') {
            const rl = rateLimit(req, 'register', 5, 60 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const email = clean(b.email, 200).toLowerCase();
            const password = String(b.password || '');
            if (!EMAIL_RE.test(email) || password.length < MIN_PASSWORD || password.length > 200) {
                return res.status(400).json({ success: false, code: password.length < MIN_PASSWORD ? 'weak_password' : 'invalid' });
            }
            const s = await getSettings();
            const passwordHash = await hashPassword(password);
            const result = await update(async (data) => {
                if (data.accounts.some(a => (a.email || '').toLowerCase() === email)) return { result: { exists: true } };
                const acc = {
                    id: 'acc-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
                    email,
                    passwordHash,
                    name: clean(b.name),
                    phone: clean(b.phone, 30),
                    registeredAt: new Date().toISOString(),
                    createdAtMs: Date.now(),
                    active: true,
                    perksActive: true,
                    customCoupon: s.userSignupCustomCouponDefault || 'WELCOME5',
                    freeShipping: s.userSignupFreeShippingDefault !== false,
                    discountPercent: parseInt(s.userSignupDiscountPercentDefault) || 5,
                    customPerks: Array.isArray(s.userSignupCustomPerksDefault)
                        ? s.userSignupCustomPerksDefault.slice()
                        : ['ضمان ذهبي ممتد لمدة سنتين مجاناً', 'أولوية في جدول التوريد والمعاينة الفنية', 'خصم إضافي على عقود الصيانة الدورية'],
                    notes: 'حساب مسجل عبر الموقع'
                };
                const token = newSession(acc);
                data.accounts.push(acc);
                return { result: { acc, token } };
            });
            if (result.exists) return res.status(409).json({ success: false, code: 'exists' });
            return res.status(200).json({ success: true, account: publicAccount(result.acc), token: result.token });
        }

        if (action === 'login') {
            const rl = rateLimit(req, 'login', 10, 15 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const email = clean(b.email, 200).toLowerCase();
            const snapshot = await loadReadOnly();
            const found = snapshot.accounts.find(a => (a.email || '').toLowerCase() === email);
            // verify against the snapshot first so failed logins never cause a write
            const pwOk = await verifyPassword(b.password, found ? found.passwordHash : await dummyHash()); // same cost whether or not the e-mail exists
            if (!found || !pwOk) {
                return res.status(401).json({ success: false, code: 'bad_credentials' });
            }
            if (found.active === false) return res.status(403).json({ success: false, code: 'disabled' });
            const result = await update(async (data) => {
                const acc = data.accounts.find(a => a.id === found.id);
                if (!acc || acc.active === false) return { result: null };
                return { result: { acc, token: newSession(acc) } };
            });
            if (!result) return res.status(403).json({ success: false, code: 'disabled' });
            return res.status(200).json({ success: true, account: publicAccount(result.acc), token: result.token });
        }

        if (action === 'logout') {
            const rl = rateLimit(req, 'logout', 60, 15 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const h = sha(b.token || '');
            await update(async (data) => {
                const acc = data.accounts.find(a => a.id === b.id);
                if (!acc) return null;
                const before = (acc.sessions || []).length;
                acc.sessions = (acc.sessions || []).filter(x => !(x && typeof x === 'object' && safeEqual(x.h, h)));
                return acc.sessions.length !== before ? { result: true } : null;
            });
            return res.status(200).json({ success: true });
        }

        if (action === 'google') {
            const rl = rateLimit(req, 'google', 20, 15 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const s = await getSettings();
            const storedClientId = typeof s.googleClientId === 'string' ? s.googleClientId.trim() : '';
            const envClientId = String(process.env.GOOGLE_CLIENT_ID || '').trim();
            const isClientId = (id) => /^[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(id);
            const clientId = isClientId(storedClientId) ? storedClientId : (isClientId(envClientId) ? envClientId : '');
            if (!clientId) return res.status(501).json({ success: false, code: 'google_not_configured' });
            let g;
            try { g = await verifyGoogleCredential(b.credential, clientId); }
            catch (e) { return res.status(401).json({ success: false, code: 'bad_google_token' }); }
            const keepPassword = process.env.GOOGLE_KEEP_PASSWORD === '1';
            const result = await update(async (data) => {
                let acc = data.accounts.find(a => a.googleSub === g.sub) || data.accounts.find(a => (a.email || '').toLowerCase() === g.email);
                let isNew = false;
                if (acc && acc.active === false) return { result: { disabled: true } };
                if (!acc) {
                    isNew = true;
                    acc = {
                        id: 'acc-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
                        email: g.email, googleSub: g.sub, emailVerified: true,
                        name: clean(g.name) || g.email.split('@')[0], phone: '',
                        registeredAt: new Date().toISOString(), createdAtMs: Date.now(),
                        active: true, perksActive: true,
                        customCoupon: s.userSignupCustomCouponDefault || 'WELCOME5',
                        freeShipping: s.userSignupFreeShippingDefault !== false,
                        discountPercent: parseInt(s.userSignupDiscountPercentDefault) || 5,
                        customPerks: Array.isArray(s.userSignupCustomPerksDefault) ? s.userSignupCustomPerksDefault.slice() : ['ضمان ذهبي ممتد لمدة سنتين مجاناً', 'أولوية في جدول التوريد والمعاينة الفنية', 'خصم إضافي على عقود الصيانة الدورية'],
                        notes: 'حساب مسجل عبر Google'
                    };
                    data.accounts.push(acc);
                } else if (!acc.googleSub) {
                    // First Google sign-in on an existing e-mail account. Google has now proven who owns this e-mail, but a password
                    // sign-up never did: someone could have registered it first and know the password. Revoke the password and old sessions.
                    acc.googleSub = g.sub; acc.emailVerified = true;
                    if (!keepPassword) { delete acc.passwordHash; acc.sessions = []; }
                } else if (acc.googleSub !== g.sub) {
                    return { result: { conflict: true } };
                }
                return { result: { acc, token: newSession(acc), isNew } };
            });
            if (result.disabled) return res.status(403).json({ success: false, code: 'disabled' });
            if (result.conflict) return res.status(409).json({ success: false, code: 'google_conflict' });
            return res.status(200).json({ success: true, account: publicAccount(result.acc), token: result.token, isNew: result.isNew });
        }

        if (action === 'me') {
            const rl = rateLimit(req, 'me', 120, 15 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const data = await loadReadOnly();
            const acc = data.accounts.find(a => a.id === b.id);
            const h = sha(b.token || '');
            if (!acc || acc.active === false || !activeSessions(acc).some(s => s.h === h)) {
                return res.status(401).json({ success: false });
            }
            return res.status(200).json({ success: true, account: publicAccount(acc) });
        }

        if (action === 'subscribe') {
            const rl = rateLimit(req, 'subscribe', 5, 60 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const email = clean(b.email, 200).toLowerCase();
            if (!EMAIL_RE.test(email)) return res.status(400).json({ success: false, code: 'invalid' });
            const s = await getSettings();
            const coupon = s.subscribersDefaultCoupon || s.couponBubbleCode || 'ATTRACTIVE10';
            const result = await update(async (data) => {
                const existing = data.members.find(m => (m.email || '').toLowerCase() === email);
                if (existing) return { result: { alreadyExists: true, coupon: existing.customCoupon || 'ATTRACTIVE10' } };
                data.members.unshift({
                    id: 'vip-' + Date.now() + '-' + crypto.randomBytes(4).toString('hex'),
                    name: clean(b.name) || 'عميل مميز',
                    email,
                    phone: clean(b.phone, 30),
                    registeredAt: new Date().toISOString().split('T')[0],
                    createdAtMs: Date.now(),
                    perksActive: true,
                    freeShipping: false,
                    customCoupon: coupon,
                    notes: 'اشتراك عبر الموقع'
                });
                return { result: { alreadyExists: false, coupon } };
            });
            return res.status(200).json({ success: true, alreadyExists: result.alreadyExists, coupon: result.coupon });
        }

        return res.status(400).json({ error: 'Unknown action' });
    } catch (e) {
        console.error('accounts error:', e);
        return res.status(500).json({ error: 'Server error' });
    }
}
