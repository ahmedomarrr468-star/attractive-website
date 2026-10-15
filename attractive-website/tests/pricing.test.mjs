import { priceOrder, normalizeItems, calcDeposit } from '../api/_pricing.js';
import D from '../api/_defaults.js';
const cat = { products: D.products, connectors: D.connectors, cables: D.cables, shipping: D.shipping, coupons: D.coupons, settings: { ...D.settings } };
let pass = 0, fail = 0;
const t = (name, cond, extra='') => { (cond ? pass++ : fail++); console.log((cond ? 'PASS' : 'FAIL') + '  ' + name + (cond ? '' : '  -> ' + extra)); };

const p = D.products[0];
const saleUnit = (p.onSale === true || p.originalPrice > p.price) ? p.price : (p.originalPrice || p.price);
const ready = (qty, price) => ({ id: p.id, type: 'ready', qty, unitPrice: price, price: price * qty });
const base = { governorateId: 'cairo' };

// 1 tampered price on a ready product
let r = priceOrder({ ...base, items: [ready(1, 1)] }, cat, null, null);
t('ready: forged price 1 is replaced by catalog price', r.ok && r.items[0].unitPrice === saleUnit, JSON.stringify(r));
// 2 qty multiplies
r = priceOrder({ ...base, items: [ready(3, 1)] }, cat, null, null);
t('ready: qty 3 -> price x3', r.ok && r.subtotal === saleUnit * 3, r.subtotal);
// 3 sale off -> originalPrice
const cat2 = { ...cat, settings: { ...cat.settings, saleActive: false } };
r = priceOrder({ ...base, items: [ready(1, 1)] }, cat2, null, null);
t('sale off -> originalPrice', r.ok && r.items[0].unitPrice === (p.originalPrice || p.price), r.items && r.items[0].unitPrice);
// 4 unknown product
r = priceOrder({ ...base, items: [{ id: 99999, type: 'ready', qty: 1, price: 1 }] }, cat, null, null);
t('unknown product rejected', !r.ok && r.error.code === 'unknown_product');
// 5 custom: formula A + B + cable*length, times qty
const A = D.connectors[0], B = D.connectors[1], C = D.cables[0];
const custom = (o = {}) => ({ id: 1, type: 'custom', connAId: A.id, connBId: B.id, cableId: C.id, length: 15, qty: 2, price: 1, unitPrice: 1, ...o });
r = priceOrder({ ...base, items: [custom()] }, cat, null, null);
const unit = A.price + B.price + C.pricePerM * 15;
t('custom: server formula', r.ok && r.items[0].unitPrice === unit && r.subtotal === unit * 2, JSON.stringify(r.items && r.items[0]));
// 6 custom without ids -> stale cart (no way to dodge verification by omitting ids)
r = priceOrder({ ...base, items: [custom({ connAId: undefined })] }, cat, null, null);
t('custom without connector id rejected (stale_cart)', !r.ok && r.error.code === 'stale_cart');
// 7 length bounds
r = priceOrder({ ...base, items: [custom({ length: 0 })] }, cat, null, null);
t('custom length 0 rejected', !r.ok && r.error.code === 'bad_length');
r = priceOrder({ ...base, items: [custom({ length: 101 })] }, cat, null, null);
t('custom length 101 rejected', !r.ok && r.error.code === 'bad_length');
// 8 qty bounds
r = priceOrder({ ...base, items: [ready(0, 1)] }, cat, null, null);
t('qty 0 rejected', !r.ok && r.error.code === 'bad_qty');
r = priceOrder({ ...base, items: [ready(-5, 1)] }, cat, null, null);
t('negative qty rejected', !r.ok && r.error.code === 'bad_qty');
r = priceOrder({ ...base, items: [ready(1.5, 1)] }, cat, null, null);
t('fractional qty rejected', !r.ok && r.error.code === 'bad_qty');
// 9 shipping: fee from zone, client fee ignored, unknown gov rejected, disabled rejected
const zone = D.shipping.find(z => z.id === 'alex');
r = priceOrder({ items: [ready(1, 1)], governorateId: 'alex', shippingFee: 0 }, cat, null, null);
t('shipping fee from zone', r.ok && r.shippingFee === zone.fee, r.shippingFee);
r = priceOrder({ items: [ready(1, 1)], governorateId: 'nowhere' }, cat, null, null);
t('unknown governorate rejected', !r.ok && r.error.code === 'bad_governorate');
r = priceOrder({ items: [ready(1, 1)], governorate: zone.nameAr }, cat, null, null);
t('governorate by Arabic name works', r.ok && r.zone.id === 'alex');
const catOff = { ...cat, shipping: cat.shipping.map(z => z.id === 'alex' ? { ...z, enabled: false } : z) };
r = priceOrder({ items: [ready(1, 1)], governorateId: 'alex' }, catOff, null, null);
t('disabled zone rejected', !r.ok && r.error.code === 'shipping_disabled');
// 10 free shipping threshold
const catFree = { ...cat, settings: { ...cat.settings, freeShippingEnabled: true, freeShippingType: 'threshold', freeShippingMinOrder: 100 } };
r = priceOrder({ ...base, items: [ready(1, 1)] }, catFree, null, null);
t('free shipping threshold met -> fee 0', r.ok && r.shippingFee === 0);
// 11 coupon
r = priceOrder({ ...base, items: [ready(1, 1)], couponCode: 'attractive10' }, cat, null, null);
t('store coupon 10% (case-insensitive)', r.ok && r.discount === Math.round(r.subtotal * 0.1) && r.couponApplied === 'ATTRACTIVE10', JSON.stringify(r));
r = priceOrder({ ...base, items: [ready(1, 1)], couponCode: 'FAKE100' }, cat, null, null);
t('unknown coupon -> no discount', r.ok && r.discount === 0);
const catOffC = { ...cat, coupons: [{ code: 'X', type: 'percent', value: 10, active: false }] };
r = priceOrder({ ...base, items: [ready(1, 1)], couponCode: 'X' }, catOffC, null, null);
t('inactive coupon ignored', r.ok && r.discount === 0);
const catFix = { ...cat, coupons: [{ code: 'BIG', type: 'fixed', value: 999999, active: true }] };
r = priceOrder({ ...base, items: [ready(1, 1)], couponCode: 'BIG' }, catFix, null, null);
t('fixed coupon capped at subtotal', r.ok && r.discount === r.subtotal);
// 12 member perks come from the real account, not from the browser
const acct = { active: true, perksActive: true, freeShipping: true, discountPercent: 5 };
r = priceOrder({ ...base, items: [ready(1, 1)] }, cat, acct, null);
t('member: free shipping + 5% auto discount', r.ok && r.shippingFee === 0 && r.discount === Math.round(r.subtotal * 0.05), JSON.stringify(r));
r = priceOrder({ ...base, items: [ready(1, 1)] }, cat, { ...acct, perksActive: false }, null);
t('member perks disabled by admin -> no perks', r.ok && r.shippingFee > 0 && r.discount === 0);
r = priceOrder({ ...base, items: [ready(1, 1)] }, cat, null, null);
t('guest cannot claim member perks', r.ok && r.discount === 0 && r.shippingFee > 0);
r = priceOrder({ ...base, items: [ready(1, 1)], couponCode: 'WELCOME5' }, cat, null, { pct: 5, name: 'x' });
t('member coupon code (via account lookup)', r.ok && r.discount === Math.round(r.subtotal * 0.05) && r.couponApplied === 'WELCOME5');
// 13 deposit: only when there is a custom item
r = priceOrder({ ...base, items: [ready(1, 1)] }, cat, null, null);
t('deposit 0 for ready-only order', r.ok && r.deposit === 0);
r = priceOrder({ ...base, items: [custom({ qty: 1 })] }, cat, null, null);
const expDep = calcDeposit(r.total, cat.settings);
t('deposit for custom order = 25% within 100..2000', r.ok && r.deposit === expDep && r.deposit >= 100, r.deposit);
t('remaining = total - deposit', r.remaining === r.total - r.deposit);
// 14 out of stock + data: image stripped
const catStock = { ...cat, products: cat.products.map(x => x.id === p.id ? { ...x, inStock: false } : x) };
r = priceOrder({ ...base, items: [ready(1, 1)] }, catStock, null, null);
t('out-of-stock product rejected', !r.ok && r.error.code === 'out_of_stock');
const catImg = { ...cat, products: cat.products.map(x => x.id === p.id ? { ...x, image: 'data:image/png;base64,' + 'A'.repeat(5000) } : x) };
r = priceOrder({ ...base, items: [ready(1, 1)] }, catImg, null, null);
t('huge data: image not copied into the order', r.ok && r.items[0].image === '');
// 15 prototype-ish junk input
r = priceOrder({ ...base, items: [null] }, cat, null, null);
t('null item rejected', !r.ok);
r = priceOrder({ ...base, items: 'x' }, cat, null, null);
t('non-array items rejected', !r.ok && r.error.code === 'empty');
r = priceOrder({ ...base, items: Array.from({ length: 61 }, () => ready(1, 1)) }, cat, null, null);
t('61 items rejected', !r.ok && r.error.code === 'too_many_items');
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
