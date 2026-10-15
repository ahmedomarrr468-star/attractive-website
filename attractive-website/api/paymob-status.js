import { readJson, pathFor } from './_vault.js';
import { rateLimit, tooMany } from './_auth.js';
const digits = s => String(s || '').replace(/\D/g, '');
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }
  const rl = rateLimit(req, 'paymob-status', 180, 15 * 60 * 1000);
  if (rl.limited) return tooMany(res, rl);
  const id = String(req.query?.orderId || '').trim(), phone = digits(req.query?.phone);
  if (!/^ATT-[A-Z0-9]{8}$/.test(id) || phone.length < 7) return res.status(400).json({ error: 'Invalid request' });
  const r = await readJson(pathFor('orders', `orders/${id}.json`)).catch(() => null), o = r?.data;
  if (!o || digits(o.customerPhone) !== phone) return res.status(404).json({ error: 'Not found' });
  return res.status(200).json({ status: o.paymentStatus || 'pending' });
}
