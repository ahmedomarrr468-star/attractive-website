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

    // Public write (no secret required): a visitor submitting a customer review.
    // Scoped narrowly on purpose — this branch can ONLY append a new "pending"
    // review to the "reviews" key. It can never touch any other key, overwrite
    // existing reviews, or set a review's status to "approved" — that always
    // requires the admin secret via the branch below.
    if (req.method === 'POST' && req.body && req.body.action === 'submitReview') {
        try {
            const r = req.body.review || {};
            const name = String(r.name || '').trim().slice(0, 60);
            const phone = String(r.phone || '').trim().slice(0, 30);
            const text = String(r.text || '').trim().slice(0, 800);
            const rating = Math.min(5, Math.max(1, parseInt(r.rating, 10) || 5));

            if (!name || !text) {
                return res.status(400).json({ error: 'Missing name or review text' });
            }

            const current = await readCurrentData();
            const reviews = Array.isArray(current.reviews) ? current.reviews : [];

            // Basic anti-abuse cap: stop accepting new submissions once the
            // backlog gets huge (the admin panel moderates from here anyway).
            if (reviews.length >= 2000) {
                return res.status(429).json({ error: 'Too many reviews stored, contact site admin' });
            }

            reviews.push({
                id: 'rev-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                name, phone, rating, text,
                status: 'pending',
                createdAt: Date.now()
            });
            current.reviews = reviews;

            await put(BLOB_PATH, JSON.stringify(current), {
                access: 'public',
                addRandomSuffix: false,
                allowOverwrite: true,
                contentType: 'application/json'
            });

            return res.status(200).json({ success: true });
        } catch (e) {
            return res.status(500).json({ error: 'Submit failed', message: e.message });
        }
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
