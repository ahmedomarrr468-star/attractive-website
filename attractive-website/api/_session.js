// Verifies a customer session (id + token issued by /api/accounts login/register).
// Files starting with "_" are NOT exposed as routes by Vercel.
// Same rules as accounts.js "me": account exists, not disabled, token hash matches an unexpired session.
import crypto from 'crypto';
import { safeEqual } from './_auth.js';
import { readJson, pathFor } from './_vault.js';

const sha = (s) => crypto.createHash('sha256').update(String(s)).digest('hex');

// -> { id, email, account } | null.  Everything (email, perks) comes from the stored account, never from the client.
// `account` is for server-side use only (it includes the password hash): never send it back to a browser.
export async function verifySession(id, token) {
    if (!id || !token || typeof id !== 'string' || typeof token !== 'string' || token.length > 200) return null;
    const cur = await readJson(pathFor('accounts', 'accounts.json')).catch(() => null);
    const list = cur && cur.data && Array.isArray(cur.data.accounts) ? cur.data.accounts : [];
    const acc = list.find(a => a && a.id === id);
    if (!acc || acc.active === false) return null;
    const h = sha(token);
    const now = Date.now();
    const ok = (acc.sessions || []).some(s => s && typeof s === 'object' && s.exp > now && safeEqual(s.h, h));
    return ok ? { id: acc.id, email: String(acc.email || '').toLowerCase(), account: acc } : null;
}
