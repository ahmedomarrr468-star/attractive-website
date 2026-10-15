process.env.ADMIN_API_SECRET = 'test-admin-secret-0123456789abcdef0123';
process.env.DATA_KEY = 'test-data-key-0123456789';
import fs from 'fs'; import vm from 'vm';
import orders from './api/orders.js';
import D from './api/_defaults.js';

const ls = new Map();
const localStorage = { getItem: k => (ls.has(k) ? ls.get(k) : null), setItem: (k, v) => ls.set(k, String(v)), removeItem: k => ls.delete(k) };
const el = () => ({ classList: { add() {}, remove() {}, contains() { return false; } }, style: {}, appendChild() {}, addEventListener() {}, setAttribute() {}, querySelectorAll: () => [], querySelector: () => null, innerHTML: '', innerText: '' });
const document = { getElementById: () => null, querySelectorAll: () => [], querySelector: () => null, createElement: el, addEventListener() {}, body: el(), head: el(), documentElement: el(), readyState: 'complete', cookie: '' };
// route /api/orders to the real handler
const fetch = async (url, o = {}) => {
  if (String(url).startsWith('/api/orders')) {
    let status = 200, json; const body = JSON.parse(o.body || '{}');
    const res = { setHeader() {}, status(c) { status = c; return res; }, json(j) { json = j; return res; }, end() { return res; } };
    await orders({ method: o.method || 'POST', headers: { 'x-forwarded-for': '7.7.7.' + Math.floor(Math.random() * 250) }, body, query: {}, socket: {} }, res);
    return { ok: status < 400, status, json: async () => json };
  }
  return { ok: false, status: 404, json: async () => ({}), text: async () => '' };
};
const win = { addEventListener() {}, location: { href: '', pathname: '/store.html', reload() {} }, localStorage, document, fetch, navigator: { language: 'ar' }, crypto: globalThis.crypto, open() {}, setTimeout, clearTimeout };
const MutationObserver = class { observe() {} disconnect() {} }; const IntersectionObserver = MutationObserver; const requestAnimationFrame = (f) => setTimeout(f, 0);
const ctx = vm.createContext({ MutationObserver, IntersectionObserver, requestAnimationFrame, ...win, window: win, localStorage, document, fetch, navigator: win.navigator, crypto: globalThis.crypto, setTimeout, clearTimeout, console, atob, btoa, URL, Intl, Date, JSON, Math, Promise, alert() {}, location: win.location });
let src = fs.readFileSync('./procable-data.js', 'utf8');
src += '\n;globalThis.__PC = ProCable;';
vm.runInContext(src, ctx);
const PC = ctx.__PC;

let pass = 0, fail = 0; const t = (n, c, x = '') => { c ? pass++ : fail++; console.log((c ? 'PASS' : 'FAIL') + '  ' + n + (c ? '' : '  -> ' + JSON.stringify(x))); };

const p = D.products[0]; const A = D.connectors[0], B = D.connectors[2], C = D.cables[0];
const mk = (items, extra = {}) => ({ customerName: 'Client Flow', customerPhone: '01099999999', governorate: 'القاهرة', governorateId: 'cairo', addressDetails: 'x', paymentMethod: 'cod', items, subtotal: 1, shippingFee: 0, discount: 0, total: 1, deposit: 0, remaining: 1, ...extra });

// tampered cart: price 1 -> server corrects, local copy adopts the real numbers
let r = await PC.placeOrder(mk([{ id: p.id, type: 'ready', name: 'x', qty: 2, unitPrice: 1, price: 2 }]));
const unit = (p.onSale === true || p.originalPrice > p.price) ? p.price : (p.originalPrice || p.price);
t('placeOrder ok + flagged adjusted', r.ok && r.adjusted === true, r);
t('local order adopted server total', r.order.total === unit * 2 + D.shipping.find(z => z.id === 'cairo').fee, r.order.total);
t('local item price replaced by server price', r.order.items[0].unitPrice === unit && r.order.items[0].price === unit * 2, r.order.items[0]);
t('order stored in local history', PC.getOrders().some(o => o.id === r.order.id));

// stale custom cart (no ids): refused, nothing left in local history, cart untouched
const before = PC.getOrders().length;
r = await PC.placeOrder(mk([{ id: 1, type: 'custom', name: 'old', connA: 'a', connB: 'b', cable: 'c', length: 5, qty: 1, unitPrice: 1, price: 1 }]));
t('stale cart refused with code', !r.ok && r.code === 'stale_cart', r);
t('refused order removed from local history', PC.getOrders().length === before);
t('error message in Arabic', /السلة|قديمة/.test(PC.orderErrorMessage('stale_cart', true)));

// valid custom
r = await PC.placeOrder(mk([{ id: 2, type: 'custom', name: 'n', connA: A.nameAr, connB: B.nameAr, cable: C.nameAr, connAId: A.id, connBId: B.id, cableId: C.id, length: 10, qty: 1, unitPrice: 1, price: 1 }]));
const cu = A.price + B.price + C.pricePerM * 10;
t('custom cable priced by server', r.ok && r.order.subtotal === cu, r.order && r.order.subtotal);
t('deposit computed', r.order.deposit > 0);

// reorder custom item from a past order re-prices with current catalog and carries ids
ls.set('attractive_cart', '[]');
PC.reorderOrder(r.order.id);
const cart = PC.getCart();
t('reorder: custom item keeps ids and fresh price', cart.length === 1 && cart[0].connAId === A.id && cart[0].unitPrice === cu, cart);

// offline: server unreachable -> order kept locally (outbox), ok:true
const realFetch = ctx.fetch; ctx.fetch = async () => { throw new Error('offline'); };
r = await PC.placeOrder(mk([{ id: p.id, type: 'ready', qty: 1, unitPrice: unit, price: unit }]));
t('offline checkout still succeeds locally', r.ok === true);
t('offline order waits in outbox', PC._outbox().some(o => o.id === r.order.id));
ctx.fetch = realFetch;

console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
