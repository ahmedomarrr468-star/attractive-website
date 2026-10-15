import { rateLimit, tooMany, readBody } from './_auth.js';
import { readJson, mutate, pathFor } from './_vault.js';

const digits = s => String(s || '').replace(/\D/g, '');
const orderPath = id => pathFor('orders', `orders/${id}.json`);
const configPath = pathFor('integrations', 'config/paymob.json');

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).end(); }
  const rl = rateLimit(req, 'paymob-checkout', 12, 15 * 60 * 1000); if (rl.limited) return tooMany(res, rl);
  const b = await readBody(req), id = String(b.orderId || '').trim();
  if (!/^ATT-[A-Z0-9]{8}$/.test(id)) return res.status(400).json({ error: 'طلب غير صحيح.' });
  const [saved, conf] = await Promise.all([readJson(orderPath(id)).catch(() => null), readJson(configPath).catch(() => null)]);
  const order = saved?.data, c = conf?.data;
  if (!order || digits(order.customerPhone) !== digits(b.phone)) return res.status(404).json({ error: 'تعذر العثور على الطلب.' });
  if (order.paymentMethod !== 'paymob' || !c?.enabled || !c.secretKey || !c.publicKey || !c.integrationIds?.length) return res.status(409).json({ error: 'الدفع الإلكتروني غير مفعّل أو الطلب غير مؤهل.' });
  if (order.paymentStatus === 'paid' || order.paymentStatus === 'deposit_paid') return res.status(409).json({ error: 'تم تأكيد دفع هذا الطلب بالفعل.' });
  const amount = Math.round(Number(order.deposit > 0 ? order.deposit : order.total) * 100);
  if (!Number.isSafeInteger(amount) || amount < 100) return res.status(400).json({ error: 'قيمة الطلب غير صالحة للدفع.' });
  if (!process.env.VERCEL_PROJECT_PRODUCTION_URL) return res.status(503).json({ error: 'انشر الموقع على Vercel أولاً لإعداد رابط تأكيد الدفع الآمن.' });
  if (order.paymentStatus !== 'failed' && order.paymobCheckout?.clientSecret && order.paymobCheckout.expiresAt > Date.now()) return res.status(200).json({ checkoutUrl: `https://eg.checkout.paymob.com/unifiedcheckout/?publicKey=${encodeURIComponent(c.publicKey)}&clientSecret=${encodeURIComponent(order.paymobCheckout.clientSecret)}` });
  const root = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  const fullName = String(order.customerName || '').trim().split(/\s+/), first = fullName.shift() || 'Customer';
  const billing = { first_name: first, last_name: fullName.join(' ') || first, phone_number: String(order.customerPhone).trim(), email: 'customer@example.com', street: String(order.addressDetails || 'NA').slice(0, 250), building: 'NA', floor: 'NA', apartment: 'NA', city: String(order.governorate || 'Cairo').slice(0, 100), state: String(order.governorate || 'Cairo').slice(0, 100), country: 'EG', postal_code: '00000' };
  try {
    const response = await fetch('https://accept.paymob.com/v1/intention/', { method: 'POST', headers: { Authorization: `Token ${c.secretKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ amount, currency: 'EGP', payment_methods: c.integrationIds, items: [{ name: `Attractive order ${id}`, amount, description: 'Order payment', quantity: 1 }], billing_data: billing, special_reference: id, extras: { attractiveOrderId: id }, expiration: 3600, notification_url: `${root}/api/paymob-webhook`, redirection_url: `${root}/payment-result.html?orderId=${encodeURIComponent(id)}` }), signal: AbortSignal.timeout(12000) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.client_secret || !data.id) { console.error('[paymob] intention creation failed', response.status); return res.status(502).json({ error: 'تعذر بدء الدفع لدى Paymob. راجع المفاتيح ومعرّفات التكامل.' }); }
    const savedCheckout = await mutate(orderPath(id), current => {
      if (!current || digits(current.customerPhone) !== digits(b.phone) || current.paymentMethod !== 'paymob') return null;
      if (current.paymentStatus === 'paid' || current.paymentStatus === 'deposit_paid') return null;
      const currentAmount = Math.round(Number(current.deposit > 0 ? current.deposit : current.total) * 100);
      if (!Number.isSafeInteger(currentAmount) || currentAmount !== amount) return null;
      if (current.paymobCheckout?.clientSecret && current.paymobCheckout.expiresAt > Date.now() && current.paymentStatus !== 'failed') {
        return { data: current, result: { clientSecret: current.paymobCheckout.clientSecret } };
      }
      current.paymentProvider = 'paymob'; current.paymentStatus = 'pending';
      current.paymobCheckout = { intentionId: String(data.id), orderId: String(data.intention_order_id || ''), clientSecret: String(data.client_secret), expiresAt: Date.now() + 3500000 };
      return { data: current, result: { clientSecret: current.paymobCheckout.clientSecret } };
    });
    if (!savedCheckout) return res.status(409).json({ error: 'تغيرت بيانات الطلب أثناء بدء الدفع. حدّث الصفحة وحاول مرة أخرى.' });
    return res.status(200).json({ checkoutUrl: `https://eg.checkout.paymob.com/unifiedcheckout/?publicKey=${encodeURIComponent(c.publicKey)}&clientSecret=${encodeURIComponent(savedCheckout.clientSecret)}` });
  } catch { return res.status(502).json({ error: 'تعذر الاتصال بخدمة Paymob، حاول مرة أخرى.' }); }
}
