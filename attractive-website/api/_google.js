// Verifies a Google Sign-In ID token ("credential" from Google Identity Services) WITHOUT any extra dependency.
// Checks: RS256 signature against Google's published keys, issuer, audience (= GOOGLE_CLIENT_ID), expiry, verified e-mail.
// Only GOOGLE_CLIENT_ID is needed (it is public). There is no client secret in this flow.
// Files starting with "_" are NOT exposed as routes by Vercel.
import crypto from 'crypto';

const JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
let cache = { keys: null, exp: 0 };

async function getKeys(fetchKeys) {
    if (cache.keys && cache.exp > Date.now()) return cache.keys;
    const r = fetchKeys ? await fetchKeys() : await (await fetch(JWKS_URL)).json();
    if (!r || !Array.isArray(r.keys)) throw new Error('google keys unavailable');
    cache = { keys: r.keys, exp: Date.now() + 60 * 60 * 1000 };
    return cache.keys;
}
export function _resetKeyCache() { cache = { keys: null, exp: 0 }; }

const b64u = (s) => Buffer.from(String(s), 'base64url');

// -> { sub, email, name, picture } | throws Error('...')
export async function verifyGoogleCredential(credential, clientId, opts = {}) {
    if (!clientId) throw new Error('GOOGLE_CLIENT_ID not configured');
    const token = String(credential || '');
    const parts = token.split('.');
    if (parts.length !== 3 || token.length > 4096) throw new Error('malformed token');
    let header, payload;
    try { header = JSON.parse(b64u(parts[0]).toString('utf8')); payload = JSON.parse(b64u(parts[1]).toString('utf8')); }
    catch (e) { throw new Error('malformed token'); }
    if (header.alg !== 'RS256' || !header.kid) throw new Error('bad alg');

    let keys = await getKeys(opts.fetchKeys);
    let jwk = keys.find(k => k.kid === header.kid);
    if (!jwk) { _resetKeyCache(); keys = await getKeys(opts.fetchKeys); jwk = keys.find(k => k.kid === header.kid); } // key rotation
    if (!jwk) throw new Error('unknown key');

    const ok = crypto.verify('RSA-SHA256', Buffer.from(parts[0] + '.' + parts[1]), crypto.createPublicKey({ key: jwk, format: 'jwk' }), b64u(parts[2]));
    if (!ok) throw new Error('bad signature');

    const now = Math.floor((opts.now || Date.now()) / 1000);
    if (payload.iss !== 'https://accounts.google.com' && payload.iss !== 'accounts.google.com') throw new Error('bad issuer');
    if (payload.aud !== clientId) throw new Error('bad audience');
    if (!payload.exp || payload.exp < now - 30) throw new Error('expired');
    if (payload.iat && payload.iat > now + 300) throw new Error('bad iat');
    if (!payload.sub || !payload.email || (payload.email_verified !== true && payload.email_verified !== 'true')) throw new Error('email not verified');
    return { sub: String(payload.sub), email: String(payload.email).toLowerCase(), name: String(payload.name || '').slice(0, 120), picture: String(payload.picture || '').slice(0, 500) };
}
