// /api/store  -- public site content (products, categories, settings, coupons, nav...).
//   GET  : public, returns the whole content object (adminPassHash is always stripped).
//   POST : admin only (Bearer token from /api/admin-login), body { key, data } replaces one section.
// Content lives in the blob "attractive-store-data.json" (same path accounts.js reads settings from).
import { put } from '@vercel/blob';
import { isAdmin, getSecret, rateLimit, tooMany, readBody } from './_auth.js';
import { readStoreRaw, STORE_PATH } from './_store.js';

const PATH = STORE_PATH;
const KEYS = ['categories', 'products', 'connectors', 'cables', 'shipping', 'settings', 'coupons', 'navItems'];

function validateShipping(data) {
    if (!Array.isArray(data) || data.length > 100) return null;
    const rows = [], ids = new Set();
    for (const row of data) {
        if (!row || typeof row !== 'object' || Array.isArray(row)) return null;
        const id = String(row.id == null ? '' : row.id).trim();
        const nameAr = String(row.nameAr == null ? '' : row.nameAr).trim();
        const nameEn = String(row.nameEn == null ? '' : row.nameEn).trim();
        const fee = Number(row.fee);
        if (!/^[a-zA-Z0-9_-]{1,64}$/.test(id) || ids.has(id) || !nameAr || nameAr.length > 120 || nameEn.length > 120 || !Number.isFinite(fee) || fee < 0 || fee > 1000000) return null;
        ids.add(id);
        for (const field of ['deliveryTimeAr', 'deliveryTimeEn', 'notes']) {
            if (row[field] != null && (typeof row[field] !== 'string' || row[field].length > (field === 'notes' ? 500 : 120))) return null;
        }
        rows.push({
            id, nameAr, nameEn, fee,
            enabled: row.enabled !== false,
            deliveryTimeAr: String(row.deliveryTimeAr || ''),
            deliveryTimeEn: String(row.deliveryTimeEn || ''),
            notes: String(row.notes || '')
        });
    }
    return rows;
}

function validateProducts(data) {
    if (!Array.isArray(data) || data.length > 5000) return null;
    const ids = new Set();
    const rows = [];
    for (const product of data) {
        if (!product || typeof product !== 'object' || Array.isArray(product)) return null;
        const id = Number(product.id);
        if (!Number.isSafeInteger(id) || id <= 0 || ids.has(id)) return null;
        ids.add(id);
        rows.push(Object.assign({}, product, { id }));
    }
    return rows;
}

function publicData(d, includeCoupons = false) {
    const out = d && typeof d === 'object' ? JSON.parse(JSON.stringify(d)) : {};
    if (out.settings && typeof out.settings === 'object') {
        delete out.settings.adminPassHash;
        // Integrations are configured through server environment variables, never public store data.
        delete out.settings.googleSheetsWebhookUrl;
    }
    if (!includeCoupons) delete out.coupons;
    return out;
}

const read = readStoreRaw;

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    try {
        if (req.method === 'GET') {
            const { data } = await read();
            return res.status(200).json(publicData(data, isAdmin(req)));
        }
        if (req.method !== 'POST') { res.setHeader('Allow', ['GET', 'POST']); return res.status(405).end('Method not allowed'); }
        if (!getSecret()) return res.status(500).json({ error: 'Server not configured: missing ADMIN_API_SECRET env var' });

        const rl = rateLimit(req, 'store-write', 120, 15 * 60 * 1000);
        if (rl.limited) return tooMany(res, rl);
        if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

        const b = await readBody(req);
        if (!KEYS.includes(b.key) || b.data === undefined) return res.status(400).json({ error: 'Bad request' });
        if (b.key === 'shipping') {
            const shipping = validateShipping(b.data);
            if (!shipping) return res.status(400).json({ error: 'Invalid shipping data' });
            b.data = shipping;
        }
        if (b.key === 'products') {
            const products = validateProducts(b.data);
            if (!products) return res.status(400).json({ error: 'Invalid products data' });
            b.data = products;
        }
        if (b.key === 'settings' && b.data && typeof b.data === 'object') {
            delete b.data.adminPassHash;
            delete b.data.googleSheetsWebhookUrl;
        }
        if (JSON.stringify(b.data).length > 3.5 * 1024 * 1024) return res.status(413).json({ error: 'Payload too large' });

        for (let i = 0; i < 5; i++) {
            const cur = await read();
            const currentData = Object.assign({}, cur.data);
            if (currentData.settings && typeof currentData.settings === 'object') {
                currentData.settings = Object.assign({}, currentData.settings);
                delete currentData.settings.googleSheetsWebhookUrl;
            }
            const next = Object.assign({}, currentData, { [b.key]: b.data });
            try {
                const opts = { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 };
                if (cur.etag) opts.ifMatch = cur.etag;
                await put(PATH, JSON.stringify(next), opts);
                return res.status(200).json({ success: true });
            } catch (e) {
                if ((e && e.name === 'BlobPreconditionFailedError') && i < 4) { await new Promise(s => setTimeout(s, 80 + Math.random() * 120)); continue; }
                throw e;
            }
        }
        return res.status(409).json({ error: 'Conflict, try again' });
    } catch (e) {
        console.error('store error:', e);
        return res.status(500).json({ error: 'Server error' });
    }
}
