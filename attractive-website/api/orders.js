// Vercel serverless function: orders stored on the server (one encrypted blob per order => no write races).
// Place at api/orders.js
//
// Public:  POST {action:'create', order}      -> { success, id, order:{totals} }   (prices are RE-COMPUTED here, see _pricing.js)
//          POST {action:'track', id, phone}   -> limited order info (BOTH id and phone must match)
// Customer (session {id, token} from /api/accounts login):
//          POST {action:'myOrders', session}              -> every order linked to the signed-in account's e-mail
//          POST {action:'claim', session, id, phone}      -> link an older order (id + phone must match) to the account
//          (create also reads `session`; the order's registeredUserEmail is taken from the account, never from the client)
// Customer edit window (policy lives in settings.orderEdit, controlled from the admin panel):
//          POST {action:'editOrder', id, phone?, session?, changes:{items:[{index,qty}], governorate, addressDetails, customerName, customerPhone, paymentMethod}}
//          POST {action:'cancelOrder', id, phone?, session?}
//          The server alone decides (policy + order age + status); totals are always recomputed here.
// Admin (Bearer token):  GET  -> all orders
//          POST {action:'update', id, status?, notes?}   POST {action:'delete', id}
import crypto from 'crypto';
import { isAdmin, getSecret, rateLimit, tooMany, readBody } from './_auth.js';
import { readJson, mutate, createOnce, listPaths, removePath, pathFor } from './_vault.js';
import { verifySession } from './_session.js';
import { readStoreRaw, getCatalog } from './_store.js';
import { priceOrder } from './_pricing.js';

const ID_RE = /^ATT-[A-Z0-9]{8}$/;
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const STATUSES = ['received', 'processing', 'shipped', 'delivered', 'cancelled'];
const clean = (v, n = 200) => String(v == null ? '' : v).trim().slice(0, n);
const num = (v, max = 1e9) => { const n = Number(v); return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0; };
const digits = (s) => String(s || '').replace(/[^0-9]/g, '');

const prefix = () => pathFor('orders', 'orders/');
const orderPath = (id) => prefix() + id + '.json';

function newId() {
    let s = '';
    const r = crypto.randomBytes(8);
    for (let i = 0; i < 8; i++) s += ALPHABET[r[i] % ALPHABET.length];
    return 'ATT-' + s;
}

async function syncOrderToGoogleSheets(order) {
    const integration = await readJson(pathFor('integrations', 'config/google-sheets.json')).catch(() => null);
    const savedValue = integration && integration.data && typeof integration.data.googleSheetsWebhookUrl === 'string'
        ? integration.data.googleSheetsWebhookUrl
        : process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const endpoint = String(savedValue || '').trim();
    if (!endpoint) return;
    try {
        const url = new URL(endpoint);
        if (url.protocol !== 'https:' || url.hostname !== 'script.google.com') {
            console.warn('[integration] Google Sheets webhook must use an https://script.google.com URL');
            return;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: AbortSignal.timeout(3000),
            body: JSON.stringify({
                orderId: order.id,
                timestamp: order.createdAt,
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                governorate: order.governorate,
                items: order.items.map(i => `${i.name} (x${i.qty})`).join(' | '),
                total: order.total,
                deposit: order.deposit || 0,
                remaining: order.remaining || order.total,
                paymentMethod: order.paymentMethod
            })
        });
        if (!response.ok) console.warn('[integration] Google Sheets webhook returned HTTP', response.status);
    } catch (e) {
        console.warn('[integration] Google Sheets webhook delivery failed');
    }
}

// Member coupon (account.customCoupon) lookup, used only when the code is not a store coupon.
async function lookupAccountCoupon(code) {
    const cur = await readJson(pathFor('accounts', 'accounts.json')).catch(() => null);
    const list = cur && cur.data && Array.isArray(cur.data.accounts) ? cur.data.accounts : [];
    const c = String(code).trim().toUpperCase();
    const acc = list.find(a => a && a.active !== false && a.perksActive !== false && String(a.customCoupon || '').trim().toUpperCase() === c);
    return acc ? { pct: Number(acc.discountPercent) || 0, name: acc.name || '' } : null;
}

// ---------------- customer edit window ----------------
const STOP_STATUSES = ['shipped', 'delivered', 'cancelled'];
const EDIT_DEFAULT = {
    enabled: true, windowMin: 60, statuses: ['received'],
    fields: { qty: true, remove: true, address: true, contact: true, payment: false },
    customCables: 'qty', allowGuest: true, allowCancel: false, maxEdits: 3,
    expiredMsg: 'انتهت مدة تعديل الطلب، تواصل معنا على واتساب'
};
const intIn = (v, min, max, def) => { const n = Math.floor(Number(v)); return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : def; };

async function getEditPolicy() {
    let s = {};
    try { const d = (await readStoreRaw()).data; s = (d && d.settings && d.settings.orderEdit) || {}; } catch (e) { s = {}; }
    const f = Object.assign({}, EDIT_DEFAULT.fields, s.fields || {});
    const statuses = (Array.isArray(s.statuses) ? s.statuses : EDIT_DEFAULT.statuses).filter(x => STATUSES.includes(x) && !STOP_STATUSES.includes(x));
    return {
        enabled: s.enabled === undefined ? EDIT_DEFAULT.enabled : !!s.enabled,
        windowMin: intIn(s.windowMin, 0, 60 * 24 * 30, EDIT_DEFAULT.windowMin),
        statuses: statuses.length ? statuses : EDIT_DEFAULT.statuses,
        fields: { qty: !!f.qty, remove: !!f.remove, address: !!f.address, contact: !!f.contact, payment: !!f.payment },
        customCables: ['off', 'qty', 'full'].includes(s.customCables) ? s.customCables : EDIT_DEFAULT.customCables,
        allowGuest: s.allowGuest === undefined ? EDIT_DEFAULT.allowGuest : !!s.allowGuest,
        allowCancel: s.allowCancel === undefined ? EDIT_DEFAULT.allowCancel : !!s.allowCancel,
        maxEdits: intIn(s.maxEdits, 0, 50, EDIT_DEFAULT.maxEdits),
        expiredMsg: clean(s.expiredMsg, 300) || EDIT_DEFAULT.expiredMsg
    };
}

// Can the customer still change this order right now?  Per-order admin override: 'open' | 'closed' | null.
function editState(o, pol) {
    const used = intIn(o.editCount, 0, 1e6, 0);
    const created = Date.parse(o.createdAt || '');
    const deadline = Number.isFinite(created) ? created + pol.windowMin * 60000 : null;
    const base = {
        deadline: o.editOverride === 'open' ? null : deadline, editsLeft: pol.maxEdits > 0 ? Math.max(0, pol.maxEdits - used) : null,
        fields: pol.fields, customCables: pol.customCables, expiredMsg: pol.expiredMsg
    };
    const res = (allowed, reason) => Object.assign({ allowed, reason: allowed ? '' : reason, allowCancel: allowed && pol.allowCancel }, base);
    if (STOP_STATUSES.includes(o.status)) return res(false, 'status');
    if (o.editOverride === 'closed') return res(false, 'closed');
    if (o.editOverride === 'open') return res(true);
    if (!pol.enabled) return res(false, 'disabled');
    if (!pol.statuses.includes(o.status || 'received')) return res(false, 'status');
    if (deadline === null) return res(false, 'legacy');
    if (Date.now() > deadline) return res(false, 'expired');
    if (pol.maxEdits > 0 && used >= pol.maxEdits) return res(false, 'max');
    return res(true);
}

function publicOrder(o, pol, withEmail) {
    const out = {
        id: o.id, date: o.date, createdAt: o.createdAt || null, status: o.status, items: o.items, subtotal: o.subtotal, shippingFee: o.shippingFee,
        discount: o.discount, total: o.total, deposit: o.deposit, remaining: o.remaining, paymentMethod: o.paymentMethod,
        paymentProvider: o.paymentProvider || null, paymentStatus: o.paymentStatus || null,
        governorate: o.governorate, addressDetails: o.addressDetails, customerName: o.customerName, customerPhone: o.customerPhone,
        edited: !!o.editCount, editCount: o.editCount || 0, lastEditedAt: o.lastEditedAt || null,
        edit: editState(o, pol), timeline: publicTimeline(o)
    };
    if (withEmail) out.registeredUserEmail = o.registeredUserEmail || null;
    return out;
}

function authorizedForEdit(o, b, sess, pol) {
    if (sess && sess.email && String(o.registeredUserEmail || '').toLowerCase() === sess.email) return true;
    return pol.allowGuest && !!digits(b.phone) && digits(o.customerPhone) === digits(b.phone);
}

const round2 = (n) => Math.round(n * 100) / 100;

// -> { code } on failure | { order, summary, govChanged } on success. Never trusts client prices.
function applyEdit(o, ch, st) {
    if (!ch || typeof ch !== 'object') return { code: 'invalid' };
    const F = st.fields;
    const n = JSON.parse(JSON.stringify(o));
    const summary = [];
    let itemsChanged = false, govChanged = false;

    if (Array.isArray(ch.items)) {
        const orig = Array.isArray(o.items) ? o.items : [];
        const want = new Map();
        for (const x of ch.items.slice(0, 100)) {
            const i = Number(x && x.index), q = Math.floor(Number(x && x.qty));
            if (!Number.isInteger(i) || i < 0 || i >= orig.length || want.has(i) || !Number.isFinite(q) || q < 1 || q > 99) return { code: 'invalid' };
            want.set(i, q);
        }
        const next = [];
        for (let i = 0; i < orig.length; i++) {
            const it = orig[i] || {};
            const custom = it.type !== 'ready';
            const name = clean(it.name || it.title, 80) || ('#' + (i + 1));
            const oldQty = Math.max(1, Math.floor(Number(it.qty) || 1));
            if (custom && st.customCables === 'off') {
                if (!want.has(i) || want.get(i) !== oldQty) return { code: 'forbidden' };
                next.push(it); continue;
            }
            if (!want.has(i)) {
                if (!F.remove) return { code: 'forbidden' };
                summary.push('حذف: ' + name); itemsChanged = true; continue;
            }
            const q = want.get(i);
            if (q === oldQty) { next.push(it); continue; }
            if (!F.qty) return { code: 'forbidden' };
            const unit = num(it.unitPrice, 1e7) || (num(it.price, 1e7) / oldQty);
            next.push(Object.assign({}, it, { qty: q, unitPrice: unit, price: round2(unit * q) }));
            summary.push(name + ': الكمية من ' + oldQty + ' إلى ' + q); itemsChanged = true;
        }
        if (!next.length) return { code: 'empty' };
        n.items = next;
    }

    const text = (key, max, label, allowed) => {
        if (ch[key] === undefined) return true;
        const v = clean(ch[key], max);
        if (v === String(o[key] || '')) return true;
        if (!allowed) return false;
        n[key] = v; summary.push(label); return true;
    };
    if (ch.governorate !== undefined && clean(ch.governorate, 80) !== String(o.governorate || '')) govChanged = true;
    if (!text('governorate', 80, 'تغيير المحافظة', F.address) || !text('addressDetails', 400, 'تعديل العنوان', F.address)) return { code: 'forbidden' };
    if (!text('customerName', 120, 'تعديل اسم المستلم', F.contact) || !text('customerPhone', 30, 'تعديل رقم الموبايل', F.contact)) return { code: 'forbidden' };
    if (!text('paymentMethod', 40, 'تغيير طريقة الدفع', F.payment)) return { code: 'forbidden' };
    if (!n.customerName || digits(n.customerPhone).length < 7) return { code: 'invalid' };

    if (!summary.length) return { code: 'nochange' };

    if (itemsChanged) {
        const subtotal = round2(n.items.reduce((s, i) => s + num(i && i.price, 1e7), 0));
        const oldSub = num(o.subtotal, 1e9);
        const ratio = oldSub > 0 ? num(o.discount, 1e9) / oldSub : 0; // keep the same discount percentage
        const ship = num(o.shippingFee, 1e6);
        n.subtotal = subtotal;
        n.shippingFee = ship;
        n.discount = Math.min(round2(subtotal * ratio), subtotal + ship);
        n.total = Math.max(0, round2(subtotal + ship - n.discount));
        n.deposit = Math.min(num(o.deposit, 1e8), n.total);
        n.remaining = round2(n.total - n.deposit);
    }
    return { order: n, summary, govChanged };
}

function pushHistory(o, entry) {
    o.history = (Array.isArray(o.history) ? o.history : []).concat([Object.assign({ at: new Date().toISOString() }, entry)]).slice(-30);
}

// Send only customer-safe events. Internal notes and staff details remain private.
function publicTimeline(o) {
    const allowedTypes = new Set(['status', 'edit', 'cancel', 'payment', 'note']);
    const allowedPayments = new Set(['paid', 'deposit_paid', 'failed', 'refunded']);
    const history = Array.isArray(o.history) ? o.history : [];
    return history.slice(-30).map(h => {
        if (!h || !allowedTypes.has(h.type) || !h.at) return null;
        const at = new Date(h.at);
        if (Number.isNaN(at.getTime())) return null;
        const event = { at: at.toISOString(), type: h.type };
        if (h.type === 'status' && STATUSES.includes(h.status)) event.status = h.status;
        if (h.type === 'payment' && allowedPayments.has(h.paymentStatus)) event.paymentStatus = h.paymentStatus;
        if (h.type === 'edit' || h.type === 'cancel' || h.type === 'note') event.summary = Array.isArray(h.summary) ? h.summary.slice(0, 4).map(x => clean(x, 200)) : [];
        return event;
    }).filter(Boolean);
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (!getSecret()) return res.status(500).json({ error: 'Server not configured: missing ADMIN_API_SECRET env var' });
    const admin = isAdmin(req);

    try {
        if (req.method === 'GET') {
            if (!admin) return res.status(401).json({ error: 'Unauthorized' });
            const paths = await listPaths(prefix());
            const orders = [];
            for (let i = 0; i < paths.length; i += 15) {
                const chunk = await Promise.all(paths.slice(i, i + 15).map(p => readJson(p).catch(() => null)));
                chunk.forEach(c => { if (c && c.data) orders.push(c.data); });
            }
            orders.sort((a, b) => String(b.createdAt || b.date).localeCompare(String(a.createdAt || a.date)));
            return res.status(200).json({ orders, serverTime: Date.now() });
        }
        if (req.method !== 'POST') { res.setHeader('Allow', ['GET', 'POST']); return res.status(405).end('Method not allowed'); }

        const b = await readBody(req);

        if (b.action === 'create') {
            const rl = rateLimit(req, 'order-create', 10, 60 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const o = b.order && typeof b.order === 'object' ? b.order : null;
            const name = o ? clean(o.customerName, 120) : '', phone = o ? clean(o.customerPhone, 30) : '';
            if (!o || !name || digits(phone).length < 7) return res.status(400).json({ success: false, code: 'invalid' });
            if (JSON.stringify(o.items || []).length > 120000) return res.status(400).json({ success: false, code: 'invalid' });

            // never trust the e-mail/perks sent by the browser: only a valid session links an order to an account
            const sess = b.session && typeof b.session === 'object' ? await verifySession(b.session.id, b.session.token) : null;
            const acct = sess ? sess.account : null;

            // prices, shipping, discount and deposit are decided HERE, from the real catalog (never from the browser)
            const cat = await getCatalog();
            const couponCode = clean(o.couponCode, 40);
            const isStoreCoupon = couponCode && cat.coupons.some(x => x && x.active && String(x.code || '').trim().toUpperCase() === couponCode.toUpperCase());
            const accountCoupon = couponCode && !isStoreCoupon ? await lookupAccountCoupon(couponCode) : null;
            const priced = priceOrder({ items: o.items, governorateId: clean(o.governorateId, 40), governorate: clean(o.governorate, 80), couponCode }, cat, acct, accountCoupon);
            if (!priced.ok) return res.status(400).json({ success: false, code: priced.error.code, detail: priced.error.detail });

            const clientTotal = Number(o.total);
            const adjusted = Number.isFinite(clientTotal) && Math.abs(clientTotal - priced.total) > 0.5;
            const perks = [];
            if (acct && acct.active !== false && acct.perksActive !== false) {
                if (acct.freeShipping) perks.push('شحن مجاني');
                if (acct.discountPercent > 0) perks.push('خصم ' + Number(acct.discountPercent) + '%');
                if (Array.isArray(acct.customPerks)) acct.customPerks.slice(0, 20).forEach(x => perks.push(clean(x, 160)));
            }
            let notes = sess ? '[عضو مسجل: ' + sess.email + (perks.length ? ' | مزايا: ' + perks.join(', ') : '') + ']' : clean(o.notes, 1000);
            if (adjusted) notes += (notes ? '\n' : '') + '⚠ تم تصحيح الإجمالي تلقائيًا: أرسل المتصفح ' + clientTotal + ' والصحيح ' + priced.total;

            const body = {
                customerName: name, customerPhone: phone,
                governorate: priced.zone.nameAr, governorateId: String(priced.zone.id),
                addressDetails: clean(o.addressDetails, 400), paymentMethod: clean(o.paymentMethod, 40),
                items: priced.items,
                subtotal: priced.subtotal, shippingFee: priced.shippingFee, discount: priced.discount,
                total: priced.total, deposit: priced.deposit, remaining: priced.remaining,
                couponCode: priced.couponApplied, registeredUserEmail: sess ? sess.email : null,
                userPerks: perks, notes
            };
            if (adjusted) { body.priceAdjusted = true; body.clientTotal = clientTotal; body.needsReview = true; }
            const totals = { subtotal: priced.subtotal, shippingFee: priced.shippingFee, discount: priced.discount, total: priced.total, deposit: priced.deposit, remaining: priced.remaining, governorate: priced.zone.nameAr };

            const wanted = o.id && ID_RE.test(String(o.id)) ? o.id : null; // client may pre-generate its id
            const now = new Date();
            for (let attempt = 0; attempt < 5; attempt++) {
                const id = attempt === 0 && wanted ? wanted : newId();
                const createdAt = now.toISOString();
                const order = Object.assign({
                    id, date: now.toISOString().split('T')[0], createdAt, status: 'received',
                    history: [{ at: createdAt, type: 'status', status: 'received' }]
                }, body);
                if (await createOnce(orderPath(id), order)) {
                    await syncOrderToGoogleSheets(order);
                    return res.status(200).json({ success: true, id, order: totals, lineItems: priced.items.map(i => ({ qty: i.qty, unitPrice: i.unitPrice, price: i.price })), adjusted });
                }
                if (attempt === 0 && wanted) return res.status(200).json({ success: true, id: wanted, duplicate: true }); // retry of same order
            }
            return res.status(500).json({ success: false, code: 'id_failed' });
        }

        if (b.action === 'myOrders') {
            const rl = rateLimit(req, 'order-mine', 30, 15 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const sess = b.session && typeof b.session === 'object' ? await verifySession(b.session.id, b.session.token) : null;
            if (!sess || !sess.email) return res.status(401).json({ success: false, code: 'unauthorized' });
            const paths = await listPaths(prefix());
            const mine = [];
            for (let i = 0; i < paths.length; i += 15) {
                const chunk = await Promise.all(paths.slice(i, i + 15).map(p => readJson(p).catch(() => null)));
                chunk.forEach(c => { if (c && c.data && String(c.data.registeredUserEmail || '').toLowerCase() === sess.email) mine.push(c.data); });
            }
            mine.sort((a, b2) => String(b2.createdAt || b2.date).localeCompare(String(a.createdAt || a.date)));
            const pol = await getEditPolicy();
            return res.status(200).json({ success: true, orders: mine.map(o => publicOrder(o, pol, true)) });
        }

        if (b.action === 'claim') {
            const rl = rateLimit(req, 'order-claim', 20, 15 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const sess = b.session && typeof b.session === 'object' ? await verifySession(b.session.id, b.session.token) : null;
            if (!sess || !sess.email) return res.status(401).json({ success: false, code: 'unauthorized' });
            const id = clean(b.id, 30).toUpperCase().replace(/^#/, '');
            if (!ID_RE.test(id) || !digits(b.phone)) return res.status(404).json({ success: false });
            let outcome = 'notfound';
            await mutate(orderPath(id), (o) => {
                if (!o || digits(o.customerPhone) !== digits(b.phone)) { outcome = 'notfound'; return null; }
                const cur = String(o.registeredUserEmail || '').toLowerCase();
                if (cur && cur !== sess.email) { outcome = 'taken'; return null; }
                outcome = 'ok';
                if (cur === sess.email) return null; // already linked
                o.registeredUserEmail = sess.email;
                return { data: o, result: true };
            });
            if (outcome === 'ok') return res.status(200).json({ success: true });
            return res.status(outcome === 'taken' ? 409 : 404).json({ success: false });
        }

        if (b.action === 'track') {
            const rl = rateLimit(req, 'order-track', 20, 15 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const id = clean(b.id, 30).toUpperCase().replace(/^#/, '');
            if (!ID_RE.test(id)) return res.status(404).json({ success: false });
            const cur = await readJson(orderPath(id)).catch(() => null);
            const o = cur && cur.data;
            if (!o || !digits(b.phone) || digits(o.customerPhone) !== digits(b.phone)) return res.status(404).json({ success: false });
            return res.status(200).json({ success: true, order: publicOrder(o, await getEditPolicy()) });
        }

        if (b.action === 'editOrder' || b.action === 'cancelOrder') {
            const rl = rateLimit(req, 'order-edit', 20, 15 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            const id = clean(b.id, 30).toUpperCase().replace(/^#/, '');
            if (!ID_RE.test(id)) return res.status(404).json({ success: false });
            const pol = await getEditPolicy();
            const sess = b.session && typeof b.session === 'object' ? await verifySession(b.session.id, b.session.token) : null;
            let out = { code: 'notfound' }, finalOrder = null;
            await mutate(orderPath(id), (o) => {
                out = { code: 'notfound' }; finalOrder = null;
                if (!o || !authorizedForEdit(o, b, sess, pol)) return null; // same answer for "missing" and "not yours"
                const st = editState(o, pol);
                if (!st.allowed) { out = { code: 'closed', reason: st.reason, edit: st }; return null; }
                if (b.action === 'cancelOrder') {
                    if (!pol.allowCancel) { out = { code: 'forbidden' }; return null; }
                    o.status = 'cancelled';
                    pushHistory(o, { by: 'customer', type: 'cancel', summary: ['تم إلغاء الطلب'], status: 'cancelled' });
                    out = { code: 'ok' }; finalOrder = o;
                    return { data: o, result: true };
                }
                const r = applyEdit(o, b.changes, st);
                if (r.code) { out = { code: r.code }; return null; }
                const n = r.order;
                n.editCount = intIn(o.editCount, 0, 1e6, 0) + 1;
                n.lastEditedAt = new Date().toISOString();
                if (r.govChanged) { n.needsReview = true; r.summary.push('⚠ المحافظة تغيّرت: راجع مصاريف الشحن'); }
                pushHistory(n, { by: 'customer', type: 'edit', summary: r.summary, totalBefore: o.total, totalAfter: n.total });
                out = { code: 'ok' }; finalOrder = n;
                return { data: n, result: true };
            });
            if (out.code === 'ok') return res.status(200).json({ success: true, order: publicOrder(finalOrder, pol) });
            const http = { notfound: 404, closed: 403, forbidden: 403 }[out.code] || 400;
            return res.status(http).json({ success: false, code: out.code, reason: out.reason, edit: out.edit, expiredMsg: pol.expiredMsg });
        }

        if (b.action === 'update' || b.action === 'delete') {
            if (!admin) return res.status(401).json({ error: 'Unauthorized' });
            const id = clean(b.id, 30);
            if (!ID_RE.test(id) && !/^ATT-\d{3,}$/.test(id)) return res.status(400).json({ error: 'Bad id' });
            if (b.action === 'delete') { await removePath(orderPath(id)); return res.status(200).json({ success: true }); }
            const result = await mutate(orderPath(id), (o) => {
                // allow admins to push legacy/local orders that don't exist on the server yet
                if (!o) {
                    const createdAt = new Date().toISOString();
                    o = Object.assign({ id, date: createdAt.split('T')[0], createdAt, status: 'received' }, b.seed && typeof b.seed === 'object' ? b.seed : {}, { id });
                    if (!Array.isArray(o.history) || !o.history.length) o.history = [{ at: o.createdAt || createdAt, type: 'status', status: o.status || 'received' }];
                }
                if (!Array.isArray(o.history)) o.history = [];
                if (!o.history.some(event => event && event.type === 'status' && event.status === 'received')) {
                    o.history.unshift({ at: o.createdAt || new Date().toISOString(), type: 'status', status: 'received' });
                }
                if (b.status !== undefined) {
                    if (!STATUSES.includes(b.status)) return null;
                    if (o.status !== b.status) {
                        o.status = b.status;
                        pushHistory(o, { by: 'admin', type: 'status', status: b.status });
                    }
                }
                if (b.notes !== undefined) {
                    const notes = clean(b.notes, 2000);
                    if (notes !== String(o.notes || '')) {
                        o.notes = notes;
                        if (notes) pushHistory(o, { by: 'admin', type: 'note', summary: [notes] });
                    }
                }
                if (b.editOverride !== undefined) o.editOverride = (b.editOverride === 'open' || b.editOverride === 'closed') ? b.editOverride : null;
                if (b.needsReview !== undefined) o.needsReview = !!b.needsReview;
                if (b.registeredUserEmail !== undefined) o.registeredUserEmail = b.registeredUserEmail ? clean(b.registeredUserEmail, 200).toLowerCase() : null;
                return { data: o, result: true };
            });
            return res.status(result ? 200 : 400).json({ success: !!result });
        }

        return res.status(400).json({ error: 'Unknown action' });
    } catch (e) {
        console.error('orders error:', e);
        return res.status(500).json({ error: 'Server error' });
    }
}
