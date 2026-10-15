// Reads the public store content blob ("attractive-store-data.json") and merges it with the built-in defaults,
// exactly the way the browser does (a section the admin never saved falls back to the defaults).
// Files starting with "_" are NOT exposed as routes by Vercel.
import { head } from '@vercel/blob';
import DEFAULTS from './_defaults.js';

export const STORE_PATH = 'attractive-store-data.json';

// -> { data, etag }   (data = {} when nothing was saved yet)
export async function readStoreRaw() {
    const info = await head(STORE_PATH).catch(() => null);
    if (!info) return { data: {}, etag: null };
    const r = await fetch(info.url + (info.url.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store' });
    if (!r.ok) throw new Error('store read failed ' + r.status);
    return { data: (await r.json()) || {}, etag: info.etag };
}

// -> { products, connectors, cables, shipping, coupons, settings }  (never null, never contains adminPassHash)
export async function getCatalog() {
    let stored = {};
    try { stored = (await readStoreRaw()).data || {}; } catch (e) { stored = {}; }
    const list = (k) => (Array.isArray(stored[k]) ? stored[k] : DEFAULTS[k]);
    const settings = Object.assign({}, DEFAULTS.settings, stored.settings && typeof stored.settings === 'object' ? stored.settings : {});
    delete settings.adminPassHash;
    return {
        products: list('products'),
        connectors: list('connectors'),
        cables: list('cables'),
        shipping: list('shipping').map(z => Object.assign({ fee: 50, enabled: true }, z)),
        coupons: list('coupons'),
        settings
    };
}
