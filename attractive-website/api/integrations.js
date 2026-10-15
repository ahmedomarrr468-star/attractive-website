// Admin-only integration settings. Webhook URLs are kept in the encrypted vault and never in public store data.
import { isAdmin, getSecret, rateLimit, tooMany, readBody } from './_auth.js';
import { readJson, mutate, pathFor } from './_vault.js';

const CONFIG_PATH = pathFor('integrations', 'config/google-sheets.json');

function validWebhook(value) {
    if (!value) return true;
    try {
        const url = new URL(value);
        return url.protocol === 'https:' && url.hostname === 'script.google.com' && /^\/macros\/s\/[^/]+\/exec\/?$/.test(url.pathname);
    } catch (e) { return false; }
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
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
