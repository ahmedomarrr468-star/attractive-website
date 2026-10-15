// Shared auth helpers for all /api/* functions. Files starting with "_" are NOT exposed as routes by Vercel.
//
// Env vars (set in Vercel -> Settings -> Environment Variables):
//   ADMIN_API_SECRET  (required)  strong random admin password, 32+ chars recommended. Server-side ONLY.
//   DATA_KEY          (recommended) separate random string used to encrypt stored data + derive its paths,
//                     so changing the admin password later never orphans your data.
//   ADMIN_SECRET      (legacy, optional) old name; still accepted as a fallback for ADMIN_API_SECRET.
//   GOOGLE_CLIENT_ID  (optional) enables "Sign in with Google" (public id, no secret needed).
import crypto from 'crypto';

export function getSecret() {
    return process.env.ADMIN_API_SECRET || process.env.ADMIN_SECRET || '';
}

let warned = false;
export function getDataKeyMaterial() {
    if (process.env.DATA_KEY) return process.env.DATA_KEY;
    // Falling back keeps existing data readable, but then changing the admin password would orphan every account/order.
    if (!warned) { warned = true; console.warn('[security] DATA_KEY is not set: data is encrypted with the admin secret. Set DATA_KEY (see DEPLOY.md) BEFORE changing the admin password.'); }
    return getSecret();
}

// Constant-time comparison that also hides length differences.
export function safeEqual(a, b) {
    const ha = crypto.createHash('sha256').update(String(a == null ? '' : a)).digest();
    const hb = crypto.createHash('sha256').update(String(b == null ? '' : b)).digest();
    return crypto.timingSafeEqual(ha, hb);
}

function tokenKey() {
    return crypto.createHash('sha256').update('admin-token:' + getSecret()).digest();
}
function sign(payload) {
    return crypto.createHmac('sha256', tokenKey()).update(payload).digest('base64url');
}

// Stateless signed token:  <expiryMs>.<hmac>   (invalidated automatically if the admin secret changes)
export function issueToken(ttlMs = 8 * 60 * 60 * 1000) {
    const exp = Date.now() + ttlMs;
    const p = String(exp);
    return { token: p + '.' + sign(p), expiresAt: exp };
}
export function verifyToken(t) {
    const s = String(t || '');
    const i = s.indexOf('.');
    if (i < 1) return false;
    const p = s.slice(0, i);
    if (!/^\d{10,16}$/.test(p) || Number(p) < Date.now()) return false;
    return safeEqual(s.slice(i + 1), sign(p));
}

// Admin = a valid, unexpired Bearer token from /api/admin-login. (The raw password in an x-admin-secret header is no longer accepted:
// it would sit in browser storage/logs and never expire.)
export function isAdmin(req) {
    if (!getSecret()) return false;
    const a = String(req.headers['authorization'] || '');
    return a.startsWith('Bearer ') && verifyToken(a.slice(7));
}

export function clientIp(req) {
    const xf = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
    return xf || (req.socket && req.socket.remoteAddress) || 'unknown';
}

// Best-effort in-memory rate limiter. On serverless each warm instance has its own memory, so this slows
// down casual abuse/brute force but is NOT a hard guarantee. For a hard limit use Vercel WAF rate limiting
// (Firewall -> Rate limiting rules) or Upstash Redis.
const buckets = new Map();
export function rateLimit(req, name, max, windowMs) {
    const key = name + ':' + clientIp(req);
    const now = Date.now();
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    let b = buckets.get(key);
    if (!b || b.reset < now) { b = { n: 0, reset: now + windowMs }; buckets.set(key, b); }
    b.n++;
    return { limited: b.n > max, retryAfter: Math.ceil((b.reset - now) / 1000) };
}
export function tooMany(res, rl) {
    res.setHeader('Retry-After', String(rl.retryAfter));
    return res.status(429).json({ success: false, code: 'rate_limited', retryAfter: rl.retryAfter });
}

export async function readBody(req) {
    let b = req.body || {};
    if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
    return b && typeof b === 'object' ? b : {};
}
