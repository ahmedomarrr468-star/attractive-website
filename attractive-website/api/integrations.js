// Admin-only integration settings. Webhook URLs are kept in the encrypted vault and never in public store data.
import { isAdmin, getSecret, rateLimit, tooMany, readBody } from './_auth.js';
import { readJson, mutate, pathFor } from './_vault.js';

const CONFIG_PATH = pathFor('integrations', 'config/google-sheets.json');
const PAYMOB_PATH = pathFor('integrations', 'config/paymob.json');
const EMPTY_PAYMOB = { enabled: false, mode: 'test', publicKey: '', secretKey: '', hmacSecret: '', integrationIds: [] };

async function handlePaymob(req, res) {
    if (!['GET', 'POST'].includes(req.method)) {
        res.setHeader('Allow', 'GET, POST');
        return res.status(405).end();
    }
    const stored = await readJson(PAYMOB_PATH).catch(() => null);
    const config = Object.assign({}, EMPTY_PAYMOB, stored?.data || {});
    if (req.method === 'GET') {
        if (isAdmin(req)) return res.status(200).json({ enabled: !!config.enabled, mode: config.mode, publicKey: config.publicKey || '', integrationIds: config.integrationIds || [], configured: !!(config.secretKey && config.hmacSecret && config.publicKey && config.integrationIds?.length) });
        return res.status(200).json({ enabled: !!config.enabled, publicKey: config.publicKey || '' });
    }
    if (!getSecret() || !isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
    const rl = rateLimit(req, 'paymob-config', 10, 15 * 60 * 1000);
    if (rl.limited) return tooMany(res, rl);
    const body = await readBody(req);
    const publicKey = String(body.publicKey ?? config.publicKey).trim();
    const secretKey = String(body.secretKey || config.secretKey).trim();
    const hmacSecret = String(body.hmacSecret || config.hmacSecret).trim();
    const mode = body.mode === 'live' ? 'live' : 'test';
    const ids = String(body.integrationIds ?? (config.integrationIds || []).join(',')).split(',').map(x => Number(x.trim())).filter(x => Number.isSafeInteger(x) && x > 0);
    if (publicKey.length > 300 || secretKey.length > 500 || hmacSecret.length > 500 || !/^(?:egy_)?pk_(test|live)_/i.test(publicKey) || !/^(?:egy_)?sk_(test|live)_/i.test(secretKey) || !hmacSecret || !ids.length || ids.length > 20) return res.status(400).json({ error: 'أدخل مفاتيح Paymob ومعرّف تكامل صحيحين.' });
    if (mode === 'test' && (!/test/i.test(publicKey) || !/test/i.test(secretKey))) return res.status(400).json({ error: 'مفاتيح الاختبار غير متوافقة مع وضع الاختبار.' });
    if (mode === 'live' && (!/live/i.test(publicKey) || !/live/i.test(secretKey))) return res.status(400).json({ error: 'مفاتيح الإنتاج غير متوافقة مع الوضع المباشر.' });
    try {
        await mutate(PAYMOB_PATH, () => ({ data: { enabled: body.enabled === true, mode, publicKey, secretKey, hmacSecret, integrationIds: [...new Set(ids)] }, result: true }));
        return res.status(200).json({ success: true });
    } catch { return res.status(500).json({ error: 'تعذر حفظ إعدادات Paymob بشكل آمن.' }); }
}

function validWebhook(value) {
    if (!value) return true;
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.hostname === 'script.google.com' && /^\/macros\/s\/[^/]+\/exec\/?$/.test(url.pathname);
    } catch (e) { return false; }
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    let provider = req.query?.provider;
    if (!provider && req.url) {
        try { provider = new URL(req.url, 'http://localhost').searchParams.get('provider'); } catch { /* Ignore malformed local URLs. */ }
    }
    if (provider === 'paymob') return handlePaymob(req, res);
    if (!['GET', 'POST'].includes(req.method)) {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
    if (!getSecret()) return res.status(500).json({ error: 'Server not configured: missing ADMIN_API_SECRET env var' });
    if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

    if (req.method === 'GET') {
        try {
            const stored = await readJson(CONFIG_PATH);
            if (stored && stored.data && typeof stored.data.googleSheetsWebhookUrl === 'string') {
                return res.status(200).json({ googleSheetsWebhookUrl: stored.data.googleSheetsWebhookUrl, source: 'panel' });
            }
            return res.status(200).json({ googleSheetsWebhookUrl: process.env.GOOGLE_SHEETS_WEBHOOK_URL || '', source: process.env.GOOGLE_SHEETS_WEBHOOK_URL ? 'environment' : 'none' });
        } catch (e) {
            console.error('integration config read failed');
            return res.status(500).json({ error: 'Could not load integration settings' });
        }
    }

    const rl = rateLimit(req, 'integration-config', 20, 15 * 60 * 1000);
    if (rl.limited) return tooMany(res, rl);
    const body = await readBody(req);
    const value = String(body.googleSheetsWebhookUrl == null ? '' : body.googleSheetsWebhookUrl).trim();
    if (value.length > 2048 || !validWebhook(value)) {
        return res.status(400).json({ error: 'Use a valid HTTPS Google Apps Script Web App URL ending in /exec' });
    }
    try {
        await mutate(CONFIG_PATH, () => ({
            data: { googleSheetsWebhookUrl: value },
            result: true
        }));
        return res.status(200).json({ success: true });
    } catch (e) {
        console.error('integration config write failed');
        return res.status(500).json({ error: 'Could not save integration settings' });
    }
}
