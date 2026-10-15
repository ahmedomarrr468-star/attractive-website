process.env.ADMIN_API_SECRET = 'test-admin-secret-0123456789abcdef0123';
process.env.DATA_KEY = 'test-data-key-0123456789';
import { store } from '@vercel/blob';
import orders from './api/orders.js';
import accounts from './api/accounts.js';
import D from './api/_defaults.js';

const call = async (handler, body, { method = 'POST', headers = {} } = {}) => {
  const req = { method, headers: { 'x-forwarded-for': '9.9.9.' + Math.floor(Math.random() * 250), ...headers }, body, query: {}, socket: {} };
  let status = 200, json;
  const res = { setHeader() {}, status(c) { status = c; return res; }, json(j) { json = j; return res; }, end() { return res; } };
  await handler(req, res);
  return { status, json };
};
let pass = 0, fail = 0;
const t = (n, c, x = '') => { c ? pass++ : fail++; console.log((c ? 'PASS' : 'FAIL') + '  ' + n + (c ? '' : '  -> ' + JSON.stringify(x))); };

const p = D.products[0];
const unit = (p.onSale === true || p.originalPrice > p.price) ? p.price : (p.originalPrice || p.price);
const shipFee = D.shipping.find(z => z.id === 'cairo').fee;
const customer = { customerName: 'Test User', customerPhone: '01012345678', governorate: 'القاهرة', governorateId: 'cairo', addressDetails: 'x', paymentMethod: 'cod' };

// 1. honest order
let r = await call(orders, { action: 'create', order: { ...customer, items: [{ id: p.id, type: 'ready', qty: 2, unitPrice: unit, price: unit * 2 }], total: unit * 2 + shipFee } });
t('honest order accepted', r.status === 200 && r.json.success && /^ATT-/.test(r.json.id), r);
t('honest order not flagged', r.json.adjusted === false);
const honestId = r.json.id;
t('totals = items + shipping', r.json.order.total === unit * 2 + shipFee, r.json.order);

// 2. tampered order: price 1 and shipping 0 and discount 99999 in the body
r = await call(orders, { action: 'create', order: { ...customer, items: [{ id: p.id, type: 'ready', qty: 2, unitPrice: 1, price: 2 }], subtotal: 2, shippingFee: 0, discount: 99999, total: 2, deposit: 0 } });
t('tampered order accepted but CORRECTED', r.json.success && r.json.order.total === unit * 2 + shipFee && r.json.adjusted === true, r.json);
const rec = [...store.entries()].find(([k]) => k.includes(r.json.id));
t('stored order is encrypted (no plaintext name)', rec && !rec[1].text.includes('Test User'));

// 3. stale cart / custom without ids
r = await call(orders, { action: 'create', order: { ...customer, items: [{ id: 5, type: 'custom', qty: 1, unitPrice: 1, price: 1, connA: 'x', connB: 'y', length: 3 }] } });
t('custom item without ids refused (400 stale_cart)', r.status === 400 && r.json.code === 'stale_cart', r);

// 4. custom with ids is priced by the server
const A = D.connectors[0], B = D.connectors[2], C = D.cables[1] || D.cables[0];
r = await call(orders, { action: 'create', order: { ...customer, items: [{ id: 7, type: 'custom', qty: 2, connAId: A.id, connBId: B.id, cableId: C.id, length: 10, unitPrice: 1, price: 2 }] } });
const cu = A.price + B.price + C.pricePerM * 10;
t('custom priced by server', r.json.success && r.json.order.subtotal === cu * 2, r.json);
t('deposit applied for custom order', r.json.order.deposit > 0 && r.json.order.remaining === r.json.order.total - r.json.order.deposit, r.json.order);

// 5. forged member perks without a session
r = await call(orders, { action: 'create', order: { ...customer, registeredUserEmail: 'ceo@x.com', userPerks: ['free'], items: [{ id: p.id, type: 'ready', qty: 1 }], discount: 500, shippingFee: 0 } });
t('guest forging member perks gets none', r.json.success && r.json.order.shippingFee === shipFee && r.json.order.discount === 0, r.json);

// 6. real member: register -> session -> perks come from the account
const reg = await call(accounts, { action: 'register', email: 'member@test.com', password: 'Passw0rd!x', name: 'Mem' });
t('register works', reg.json.success && reg.json.token, reg);
const session = { id: reg.json.account.id, token: reg.json.token };
r = await call(orders, { action: 'create', session, order: { ...customer, items: [{ id: p.id, type: 'ready', qty: 1 }] } });
const acc = reg.json.account;
t('member gets free shipping + auto discount from the real account', r.json.success && r.json.order.shippingFee === (acc.freeShipping ? 0 : shipFee) && r.json.order.discount === Math.round(unit * (acc.discountPercent / 100)), { acc: [acc.freeShipping, acc.discountPercent], got: r.json.order });
const myOrders = await call(orders, { action: 'myOrders', session });
t('myOrders lists the linked order', myOrders.json.success && myOrders.json.orders.length === 1, myOrders.json);

// 7. member coupon code typed by a guest (account.customCoupon)
r = await call(orders, { action: 'create', order: { ...customer, couponCode: acc.customCoupon, items: [{ id: p.id, type: 'ready', qty: 1 }] } });
t('member coupon honoured', r.json.success && r.json.order.discount === Math.round(unit * (acc.discountPercent / 100)), r.json);
r = await call(orders, { action: 'create', order: { ...customer, couponCode: 'NOPE', items: [{ id: p.id, type: 'ready', qty: 1 }] } });
t('unknown coupon ignored', r.json.success && r.json.order.discount === 0);

// 8. track needs id + phone
r = await call(orders, { action: 'track', id: honestId, phone: '01012345678' });
t('track with id+phone works', r.json.success && r.json.order.total === unit * 2 + shipFee);
r = await call(orders, { action: 'track', id: honestId, phone: '01000000000' });
t('track with wrong phone refused', r.status === 404);

// 9. validation
r = await call(orders, { action: 'create', order: { ...customer, customerName: '', items: [{ id: p.id, type: 'ready', qty: 1 }] } });
t('missing name refused', r.status === 400);
r = await call(orders, { action: 'create', order: { ...customer, governorateId: 'mars', governorate: 'Mars', items: [{ id: p.id, type: 'ready', qty: 1 }] } });
t('unknown governorate refused', r.status === 400 && r.json.code === 'bad_governorate');

// 10. customer edit keeps server prices (qty change)
r = await call(orders, { action: 'create', order: { ...customer, items: [{ id: p.id, type: 'ready', qty: 2 }] } });
const eid = r.json.id;
const ed = await call(orders, { action: 'editOrder', id: eid, phone: customer.customerPhone, changes: { items: [{ index: 0, qty: 1 }] } });
t('edit qty re-prices from stored unit price', ed.json.success && ed.json.order.subtotal === unit, ed.json);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
