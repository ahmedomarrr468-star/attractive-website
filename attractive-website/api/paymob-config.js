import { isAdmin, getSecret, rateLimit, tooMany, readBody } from './_auth.js';
import { readJson, mutate, pathFor } from './_vault.js';

const PATH = pathFor('integrations', 'config/paymob.json');
const empty = { enabled: false, mode: 'test', publicKey: '', secretKey: '', hmacSecret: '', integrationIds: [] };
async function config() { const r = await readJson(PATH).catch(() => null); return Object.assign({}, empty, r?.data || {}); }

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) { res.setHeader('Allow', 'GET, POST'); return res.status(405).end(); }
  const c = await config();
  if (req.method === 'GET') {
    if (isAdmin(req)) return res.status(200).json({ enabled: !!c.enabled, mode: c.mode, publicKey: c.publicKey || '', integrationIds: c.integrationIds || [], configured: !!(c.secretKey && c.hmacSecret && c.publicKey && c.integrationIds?.length) });
    return res.status(200).json({ enabled: !!c.enabled, publicKey: c.publicKey || '' });
  }
  if (!getSecret() || !isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const rl = rateLimit(req, 'paymob-config', 10, 15 * 60 * 1000); if (rl.limited) return tooMany(res, rl);
  const b = await readBody(req);
  const publicKey = String(b.publicKey ?? c.publicKey).trim();
  const secretKey = String(b.secretKey || c.secretKey).trim();
  const hmacSecret = String(b.hmacSecret || c.hmacSecret).trim();
  const mode = b.mode === 'live' ? 'live' : 'test';
  const ids = String(b.integrationIds ?? (c.integrationIds || []).join(',')).split(',').map(x => Number(x.trim())).filter(x => Number.isSafeInteger(x) && x > 0);
  if (publicKey.length > 300 || secretKey.length > 500 || hmacSecret.length > 500 || !/^(?:egy_)?pk_(test|live)_/i.test(publicKey) || !/^(?:egy_)?sk_(test|live)_/i.test(secretKey) || !hmacSecret || !ids.length || ids.length > 20) return res.status(400).json({ error: 'أدخل مفاتيح Paymob ومعرّف تكامل صحيحين.' });
  if (mode === 'test' && (!/test/i.test(publicKey) || !/test/i.test(secretKey))) return res.status(400).json({ error: 'مفاتيح الاختبار غير متوافقة مع وضع الاختبار.' });
  if (mode === 'live' && (!/live/i.test(publicKey) || !/live/i.test(secretKey))) return res.status(400).json({ error: 'مفاتيح الإنتاج غير متوافقة مع الوضع المباشر.' });
  try {
    await mutate(PATH, () => ({ data: { enabled: b.enabled === true, mode, publicKey, secretKey, hmacSecret, integrationIds: [...new Set(ids)] }, result: true }));
    return res.status(200).json({ success: true });
  } catch { return res.status(500).json({ error: 'تعذر حفظ إعدادات Paymob بشكل آمن.' }); }
}
