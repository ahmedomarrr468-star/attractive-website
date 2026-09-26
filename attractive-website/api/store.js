import { put, head } from '@vercel/blob';

// All admin-editable content lives in a single JSON blob under this fixed path,
// so every visitor and every admin session reads/writes the same shared record.
const BLOB_PATH = 'attractive-store-data.json';

async function readCurrentData() {
    const info = await head(BLOB_PATH).catch(() => null);
    if (!info) return {};
    try {
        const r = await fetch(info.url, { cache: 'no-store' });
        return (await r.json()) || {};
    } catch (e) {
        return {};
    }
}

export default async function handler(req, res) {
    // Public read: anyone visiting the site needs this to render products, settings, etc.
    if (req.method === 'GET') {
        const data = await readCurrentData();
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json(data);
    }

    // Admin-only write: requires the shared secret set in Vercel env vars (ADMIN_API_SECRET),
    // which should match the admin panel password.
    if (req.method === 'POST') {
        const secret = req.headers['x-admin-secret'];
        if (!process.env.ADMIN_API_SECRET) {
            return res.status(500).json({ error: 'Server not configured: missing ADMIN_API_SECRET env var' });
        }
        if (!secret || secret !== process.env.ADMIN_API_SECRET) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const { key, data } = req.body || {};
            if (!key) return res.status(400).json({ error: 'Missing key' });

            const current = await readCurrentData();
            current[key] = data;

            await put(BLOB_PATH, JSON.stringify(current), {
                access: 'public',
                addRandomSuffix: false,
                allowOverwrite: true,
                contentType: 'application/json'
            });

            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: 'Save failed', message: e.message });
        }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end('Method not allowed');
}
