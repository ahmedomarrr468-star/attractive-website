// GET /api/config -> public, non-secret runtime settings for the browser.
// GOOGLE_CLIENT_ID is a public identifier (it is visible in every "Sign in with Google" page), so exposing it is fine.
import { readStoreRaw } from './_store.js';

export default function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') { res.setHeader('Allow', ['GET']); return res.status(405).end('Method not allowed'); }
    return readStoreRaw().catch(() => ({ data: {} })).then(({ data }) => {
        const fromStore = data && data.settings && typeof data.settings.googleClientId === 'string' ? data.settings.googleClientId.trim() : '';
        const fromEnv = String(process.env.GOOGLE_CLIENT_ID || '').trim();
        const valid = (id) => /^[A-Za-z0-9_-]+\.apps\.googleusercontent\.com$/.test(id);
        return res.status(200).json({ googleClientId: valid(fromStore) ? fromStore : (valid(fromEnv) ? fromEnv : '') });
    });
}
