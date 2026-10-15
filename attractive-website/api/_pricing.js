// Server-side price engine. The browser may SHOW prices, but the server decides what an order costs.
// Every formula below mirrors the storefront (procable-data.js / store.html / builder.html) so honest customers see the same
// numbers, while a tampered request (price changed in dev-tools, forged discount, fake free shipping) is corrected.
// Files starting with "_" are NOT exposed as routes by Vercel.

export const MAX_QTY = 99;
export const MAX_LENGTH_M = 100;   // builder slider is 1..100 m
export const MAX_ITEMS = 60;

const clean = (v, n = 200) => String(v == null ? '' : v).trim().slice(0, n);
export const round2 = (n) => Math.round(Number(n) * 100) / 100;
const money = (v, max = 1e8) => { const n = Number(v); return Number.isFinite(n) ? Math.min(Math.max(n, 0), max) : 0; };
const sameId = (a, b) => a !== undefined && a !== null && String(a) === String(b);
const norm = (s) => String(s == null ? '' : s).trim().toLowerCase();

// Same rule as store.html addStoreProductToCart().
export function readyUnitPrice(prod, settings) {
    const saleOn = settings.saleActive === true;
    const onSale = saleOn && (prod.onSale === true || (prod.originalPrice && prod.originalPrice > prod.price));
    return money(onSale ? prod.price : (prod.originalPrice || prod.price), 1e7);
}

// Same rule as builder.html: connector A + connector B + cable price per meter * length.
export function customUnitPrice(a, b, cable, length) {
    return round2(money(a.price, 1e7) + money(b.price, 1e7) + money(cable.pricePerM, 1e7) * length);
}

// Same rule as ProCable.calculateDeposit().
export function calcDeposit(total, s) {
    if (!s.depositEnabled || total <= 0) return 0;
    let dep = s.depositType === 'percent' ? Math.round(total * (money(s.depositValue, 1e6) / 100)) : money(s.depositValue, 1e8);
    if (s.depositMin) dep = Math.max(dep, money(s.depositMin, 1e8));
    if (s.depositMax) dep = Math.min(dep, money(s.depositMax, 1e8));
    return Math.min(dep, total);
}

// -> normalized items [{... , unitPrice, price}] or { error: {code, detail?} }
export function normalizeItems(rawItems, cat) {
    if (!Array.isArray(rawItems) || !rawItems.length) return { error: { code: 'empty' } };
    if (rawItems.length > MAX_ITEMS) return { error: { code: 'too_many_items' } };
    const out = [];
    for (let i = 0; i < rawItems.length; i++) {
        const it = rawItems[i];
        if (!it || typeof it !== 'object') return { error: { code: 'bad_item', detail: i } };
        const qty = Number(it.qty);
        if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return { error: { code: 'bad_qty', detail: i } };

        if (it.type === 'ready') {
            const prod = cat.products.find(p => p && sameId(p.id, it.id));
            if (!prod) return { error: { code: 'unknown_product', detail: clean(it.name, 80) } };
            if (prod.inStock === false) return { error: { code: 'out_of_stock', detail: clean(prod.nameAr, 80) } };
            const unit = readyUnitPrice(prod, cat.settings);
            const img = typeof prod.image === 'string' && !/^data:/i.test(prod.image) && prod.image.length <= 500 ? prod.image : '';
            out.push({
                id: prod.id, type: 'ready',
                name: clean(prod.nameAr, 200), nameEn: clean(prod.nameEn, 200),
                connA: clean(prod.nameAr, 200), connB: '',
                cable: clean(prod.tag, 80) || 'منتج جاهز',
                icon: clean(prod.icon, 40), image: img,
                length: 1, qty, unitPrice: unit, price: round2(unit * qty)
            });
            continue;
        }

        // custom cable (builder). The browser must say WHICH connectors/cable it picked; names and prices come from here.
        const a = cat.connectors.find(c => c && sameId(c.id, it.connAId));
        const b = cat.connectors.find(c => c && sameId(c.id, it.connBId));
        const cable = cat.cables.find(c => c && sameId(c.id, it.cableId));
        if (!a || !b || !cable) return { error: { code: 'stale_cart', detail: i } };
        const length = Number(it.length);
        if (!Number.isInteger(length) || length < 1 || length > MAX_LENGTH_M) return { error: { code: 'bad_length', detail: i } };
        const unit = customUnitPrice(a, b, cable, length);
        const label = clean(it.customLabel, 60);
        out.push({
            id: Number.isFinite(Number(it.id)) ? Number(it.id) : Date.now() + i, type: 'custom',
            name: clean(a.nameAr, 80) + ' ←→ ' + clean(b.nameAr, 80) + (label ? ' (' + label + ')' : ''),
            connA: clean(a.nameAr, 120), connB: clean(b.nameAr, 120), cable: clean(cable.nameAr, 120),
            connAId: String(a.id), connBId: String(b.id), cableId: String(cable.id),
            length, customLabel: label, qty, unitPrice: unit, price: round2(unit * qty)
        });
    }
    return { items: out };
}

// Governorate: id wins; the Arabic/English name is accepted as a fallback (older pages only sent the label).
export function findZone(shipping, id, name) {
    let z = id ? shipping.find(x => sameId(x.id, id)) : null;
    if (!z && name) { const n = norm(name); z = shipping.find(x => norm(x.nameAr) === n || norm(x.nameEn) === n); }
    return z || null;
}

// Coupon lookup. `accountCoupon` is resolved by the caller (needs the accounts file) -> { pct, name } | null
export function applyCouponServer(code, subtotal, cat, accountCoupon) {
    const c = norm(code).toUpperCase();
    if (!c) return { discount: 0, code: null };
    const sc = cat.coupons.find(x => x && x.active && String(x.code || '').trim().toUpperCase() === c);
    if (sc) {
        const v = money(sc.value, 1e8);
        let d = sc.type === 'percent' ? Math.round(subtotal * (Math.min(v, 100) / 100)) : v;
        return { discount: Math.min(d, subtotal), code: c, kind: 'store' };
    }
    if (accountCoupon) {
        const pct = accountCoupon.pct > 0 ? Math.min(accountCoupon.pct, 100) : 10;
        return { discount: Math.min(Math.round(subtotal * (pct / 100)), subtotal), code: c, kind: 'member' };
    }
    return { discount: 0, code: null };
}

// Full order pricing.
//  input : { items, governorateId, governorate, couponCode }
//  acct  : the signed-in account (from a VERIFIED session) or null
//  accountCoupon : result of looking the code up among accounts (only needed when it is not a store coupon)
// -> { ok:true, ...totals } | { ok:false, error:{code} }
export function priceOrder(input, cat, acct, accountCoupon) {
    const norm_ = normalizeItems(input.items, cat);
    if (norm_.error) return { ok: false, error: norm_.error };
    const items = norm_.items;
    const subtotal = round2(items.reduce((s, i) => s + i.price, 0));

    const zone = findZone(cat.shipping, input.governorateId, input.governorate);
    if (!zone) return { ok: false, error: { code: 'bad_governorate' } };
    if (zone.enabled === false) return { ok: false, error: { code: 'shipping_disabled' } };

    const perks = !!acct && acct.active !== false && acct.perksActive !== false;
    const s = cat.settings;
    const freeAll = s.freeShippingEnabled === true && s.freeShippingType === 'all';
    const freeThreshold = s.freeShippingEnabled === true && s.freeShippingType !== 'all' && subtotal >= (money(s.freeShippingMinOrder, 1e8) || 1000);
    const memberFree = perks && acct.freeShipping === true;
    const shippingFee = (memberFree || freeAll || freeThreshold) ? 0 : money(zone.fee, 1e6);

    let discount = 0, couponApplied = null, memberDiscountPct = 0;
    const cp = applyCouponServer(input.couponCode, subtotal, cat, accountCoupon);
    if (cp.discount > 0) { discount = cp.discount; couponApplied = cp.code; }
    else if (perks && acct.discountPercent > 0) {
        memberDiscountPct = Math.min(Number(acct.discountPercent), 100);
        discount = Math.min(Math.round(subtotal * (memberDiscountPct / 100)), subtotal);
    }

    const total = Math.max(0, round2(subtotal + shippingFee - discount));
    const hasCustom = items.some(i => i.type !== 'ready');
    const deposit = hasCustom ? calcDeposit(total, s) : 0;
    return {
        ok: true, items, subtotal, shippingFee, discount, total, deposit, remaining: round2(total - deposit),
        couponApplied, memberDiscountPct, freeShipping: shippingFee === 0 && !!(memberFree || freeAll || freeThreshold),
        zone: { id: zone.id, nameAr: zone.nameAr, nameEn: zone.nameEn || '' }
    };
}
