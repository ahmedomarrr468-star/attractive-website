import crypto from 'crypto';
import { readJson, mutate, pathFor } from './_vault.js';

const ORDER_ID = /^ATT-[A-Z0-9]{8}$/;
const CONFIG = pathFor('integrations', 'config/paymob.json');
const orderPath = id => pathFor('orders', `orders/${id}.json`);
const fields = ['amount_cents','created_at','currency','error_occured','has_parent_transaction','id','integration_id','is_3d_secure','is_auth','is_capture','is_refunded','is_standalone_payment','is_voided','order.id','owner','pending','source_data.pan','source_data.sub_type','source_data.type','success'];
const get = (obj, key) => key.split('.').reduce((x, k) => x == null ? undefined : x[k], obj);
const str = v => typeof v === 'boolean' ? String(v) : String(v == null ? '' : v);
const safeEqual = (a, b) => /^[a-f0-9]{128}$/i.test(String(a || '')) && /^[a-f0-9]{128}$/i.test(String(b || '')) && crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
const pushHistory = (order, event) => {
  order.history = (Array.isArray(order.history) ? order.history : []).concat([Object.assign({ at: new Date().toISOString(), by: 'payment' }, event)]).slice(-30);
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const b = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  const obj = b.obj || b;
  const url = new URL(req.url, 'https://internal.invalid');
  const supplied = String(req.query?.hmac || url.searchParams.get('hmac') || '');
  const conf = await readJson(CONFIG).catch(() => null), secret = conf?.data?.hmacSecret;
  if (!secret || !supplied) return res.status(401).end();
  const digest = crypto.createHmac('sha512', secret).update(fields.map(k => str(get(obj, k))).join('')).digest('hex');
  if (!safeEqual(digest, supplied)) return res.status(401).end();
  if (b.type && b.type !== 'TRANSACTION') return res.status(200).json({ received: true });
  const paymobId = String(get(obj, 'order.id') || '');
  const extraId = obj.payment_key_claims?.extra?.attractiveOrderId || obj.extra?.attractiveOrderId || obj.order?.merchant_order_id;
  const id = String(extraId || '').trim();
  if (!ORDER_ID.test(id)) return res.status(200).json({ received: true });
  const expectedInt = (conf.data.integrationIds || []).map(Number);
  let outcome = 'ignored';
  try {
    await mutate(orderPath(id), current => {
      if (!current || current.paymentMethod !== 'paymob' || !current.paymobCheckout) return null;
      const amount = Math.round(Number(current.deposit > 0 ? current.deposit : current.total) * 100);
      if (String(current.paymobCheckout.orderId) !== paymobId || !expectedInt.includes(Number(obj.integration_id)) || Number(obj.amount_cents) !== amount || String(obj.currency).toUpperCase() !== 'EGP' || obj.pending === true) return null;
      const tx = String(obj.id || '');
      if (!tx) return null;
      if (current.paymentStatus === 'paid' || current.paymentStatus === 'deposit_paid') {
        if (obj.is_refunded === true && current.paymobTransactionId === tx) {
          current.paymentStatus = 'refunded';
          current.paymentUpdatedAt = new Date().toISOString();
          pushHistory(current, { type: 'payment', paymentStatus: 'refunded' });
          outcome = 'refunded';
          return { data: current, result: true };
        }
        outcome = 'duplicate';
        return null;
      }
      if (current.paymobTransactionId === tx) { outcome = 'duplicate'; return null; }
      const paid = obj.success === true && obj.pending === false && obj.error_occured === false && obj.is_refunded !== true && obj.is_voided !== true;
      current.paymentStatus = paid ? (current.deposit > 0 ? 'deposit_paid' : 'paid') : 'failed';
      current.paymobTransactionId = tx || null;
      current.paymentUpdatedAt = new Date().toISOString();
      pushHistory(current, { type: 'payment', paymentStatus: current.paymentStatus });
      outcome = paid ? 'paid' : 'failed';
      return { data: current, result: true };
    });
    return res.status(200).json({ received: true, result: outcome });
  } catch { return res.status(500).end(); }
}
