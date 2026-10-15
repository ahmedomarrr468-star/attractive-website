// Checks a submitted coupon without publishing the store's coupon list.
import { rateLimit, tooMany, readBody } from './_auth.js';
import { getCatalog } from './_store.js';
import { normalizeItems, applyCouponServer } from './_pricing.js';
import { readJson, pathFor } from './_vault.js';

const clean = (v, n = 200) => String(v == null ? '' : v).trim().slice(0, n);

async function lookupAccountCoupon(code) {
    const cur = await readJson(pathFor('accounts', 'accounts.json')).catch(() => null);
    const accounts = cur && cur.data && Array.isArray(cur.data.accounts) ? cur.data.accounts : [];
    const wanted = String(code || '').trim().toUpperCase();
    const account = accounts.find(a => a && a.active !== false && a.perksActive !== false && String(a.customCoupon || '').trim().toUpperCase() === wanted);
    return account ? { pct: Number(account.discountPercent) || 0, name: account.name || '' } : null;
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') { res.setHeader('Allow', ['POST']); return res.status(405).end('Method not allowed'); }
    const rl = rateLimit(req, 'coupon-check', 30, 15 * 60 * 1000);
    if (rl.limited) return tooMany(res, rl);
    try {
        const body = await readBody(req);
        const code = clean(body.code, 40);
        const catalog = await getCatalog();
        const normalized = normalizeItems(body.items, catalog);
        if (normalized.error) return res.status(400).json({ valid: false, code: normalized.error.code });
        const subtotal = Math.round(normalized.items.reduce((sum, item) => sum + item.price, 0) * 100) / 100;
        const knownStoreCoupon = catalog.coupons.some(c => c && c.active && String(c.code || '').trim().toUpperCase() === code.toUpperCase());
        const accountCoupon = code && !knownStoreCoupon ? await lookupAccountCoupon(code) : null;
        const result = applyCouponServer(code, subtotal, catalog, accountCoupon);
        return res.status(200).json({ valid: result.discount > 0, discount: result.discount });
    } catch (e) {
        console.error('coupon check error:', e);
        return res.status(500).json({ error: 'Server error' });
    }
}
