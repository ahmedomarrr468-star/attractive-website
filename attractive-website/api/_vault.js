// Encrypted JSON storage on top of Vercel Blob.
// The blob store is "public" (anyone with the URL can download), so every file is AES-256-GCM encrypted
// with a key derived from DATA_KEY (or the admin secret). A leaked URL alone reveals nothing.
// Writes use ETag optimistic concurrency (ifMatch) so two simultaneous writers can't silently overwrite each other.
import { put, head, list, del } from '@vercel/blob';
import crypto from 'crypto';
import { getDataKeyMaterial } from './_auth.js';

const key = () => crypto.createHash('sha256').update('vault-key:' + getDataKeyMaterial()).digest();

export function pathFor(scope, name) {
    const h = crypto.createHash('sha256').update(scope + ':' + getDataKeyMaterial()).digest('hex').slice(0, 32);
    return 'private-data/' + h + '/' + name;
}

function encrypt(obj) {
    const iv = crypto.randomBytes(12);
    const c = crypto.createCipheriv('aes-256-gcm', key(), iv);
    const ct = Buffer.concat([c.update(JSON.stringify(obj), 'utf8'), c.final()]);
    return JSON.stringify({ v: 1, iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), ct: ct.toString('base64') });
}
function decrypt(text) {
    const j = JSON.parse(text);
    if (!j || !j.ct) return j; // legacy plaintext file (written before encryption was added)
    const d = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(j.iv, 'base64'));
    d.setAuthTag(Buffer.from(j.tag, 'base64'));
    return JSON.parse(Buffer.concat([d.update(Buffer.from(j.ct, 'base64')), d.final()]).toString('utf8'));
}

// -> { data, etag } | null (not found)
export async function readJson(path) {
    const info = await head(path).catch(() => null);
    if (!info) return null;
    for (let i = 0; i < 3; i++) {
        const r = await fetch(info.url + (info.url.includes('?') ? '&' : '?') + 't=' + Date.now() + i, { cache: 'no-store' });
        if (!r.ok) throw new Error('vault read failed: ' + r.status);
        const re = r.headers.get('etag');
        // CDN may serve an older copy for up to ~60s; make sure the body matches the ETag we'll use for ifMatch.
        if (re && info.etag && re.replace(/^W\//, '') !== info.etag && i < 2) { await new Promise(s => setTimeout(s, 250)); continue; }
        return { data: decrypt(await r.text()), etag: info.etag };
    }
    return null;
}

function isPrecondition(e) {
    return e && (e.name === 'BlobPreconditionFailedError' || /precondition/i.test(String(e.message)));
}

// Read-modify-write with retry on concurrent modification. fn(current|null) -> { data, result } | null (null = no write)
export async function mutate(path, fn, attempts = 5) {
    for (let i = 0; i < attempts; i++) {
        const cur = await readJson(path);
        const out = await fn(cur ? cur.data : null);
        if (!out) return null;
        try {
            const opts = { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 };
            if (cur && cur.etag) opts.ifMatch = cur.etag;
            await put(path, encrypt(out.data), opts);
            return out.result;
        } catch (e) {
            if (isPrecondition(e) && i < attempts - 1) { await new Promise(s => setTimeout(s, 80 + Math.random() * 120)); continue; }
            throw e;
        }
    }
    throw new Error('vault busy, try again');
}

// Create only if it doesn't exist yet. Returns true if created, false if the path was taken.
export async function createOnce(path, data) {
    try {
        await put(path, encrypt(data), { access: 'public', addRandomSuffix: false, allowOverwrite: false, contentType: 'application/json', cacheControlMaxAge: 60 });
        return true;
    } catch (e) {
        if (/already exists|exists/i.test(String(e && e.message))) return false;
        throw e;
    }
}

export async function listPaths(prefix) {
    const out = [];
    let cursor;
    do {
        const r = await list({ prefix, cursor, limit: 1000 });
        r.blobs.forEach(b => out.push(b.pathname));
        cursor = r.hasMore ? r.cursor : undefined;
    } while (cursor);
    return out;
}

export async function removePath(path) {
    const info = await head(path).catch(() => null);
    if (info) await del(info.url);
}
