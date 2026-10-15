// POST /api/admin-login  { password }  ->  { success, token, expiresAt }
// The password lives ONLY in the ADMIN_API_SECRET env var. The browser gets a signed, expiring token.
import { getSecret, safeEqual, issueToken, rateLimit, tooMany, readBody } from './_auth.js';

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') { res.setHeader('Allow', ['POST']); return res.status(405).json({ error: 'Method not allowed' }); }
    if (!getSecret()) return res.status(500).json({ error: 'Server not configured: missing ADMIN_API_SECRET env var' });

    const rl = rateLimit(req, 'admin-login', 8, 15 * 60 * 1000);
    if (rl.limited) return tooMany(res, rl);

    const b = await readBody(req);
    const ok = typeof b.password === 'string' && b.password.length > 0 && b.password.length < 500 && safeEqual(b.password, getSecret());
    if (!ok) {
        await new Promise(s => setTimeout(s, 600)); // slow down guessing
        return res.status(401).json({ success: false, code: 'bad_credentials' });
    }
    const { token, expiresAt } = issueToken(8 * 60 * 60 * 1000);
    return res.status(200).json({ success: true, token, expiresAt });
}
