// Customer reviews are private until an admin approves them.
import crypto from 'crypto';
import { isAdmin, getSecret, rateLimit, tooMany, readBody } from './_auth.js';
import { readJson, mutate, createOnce, listPaths, removePath, pathFor } from './_vault.js';

const clean = (v, n) => String(v == null ? '' : v).replace(/[<>]/g, '').trim().slice(0, n);
const prefix = () => pathFor('reviews', 'reviews/');
const reviewPath = id => prefix() + id + '.json';
const ID_RE = /^[a-f0-9]{24}$/;

async function readReviews(approvedOnly) {
    const paths = await listPaths(prefix());
    const rows = [];
    for (let i = 0; i < paths.length; i += 20) {
        const chunk = await Promise.all(paths.slice(i, i + 20).map(p => readJson(p).catch(() => null)));
        for (const entry of chunk) {
            const r = entry && entry.data;
            if (r && (!approvedOnly || r.status === 'approved')) rows.push(r);
        }
    }
    rows.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
    return rows;
}

function publicReview(r) {
    return { id: r.id, name: r.name, role: r.role, text: r.text, stars: r.stars, createdAt: r.createdAt };
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    try {
        const admin = !!getSecret() && isAdmin(req);
        if (req.method === 'GET') {
            const reviews = await readReviews(!admin);
            const visible = admin ? reviews.slice(0, 200) : reviews.slice(0, 30);
            return res.status(200).json({ reviews: visible.map(r => admin ? { ...publicReview(r), status: r.status } : publicReview(r)) });
        }
        if (req.method !== 'POST') { res.setHeader('Allow', ['GET', 'POST']); return res.status(405).end('Method not allowed'); }

        const body = await readBody(req);
        if (body.action === 'submit') {
            const rl = rateLimit(req, 'review-submit', 3, 60 * 60 * 1000);
            if (rl.limited) return tooMany(res, rl);
            // Quietly discard common form-bot submissions.
            if (clean(body.website, 200)) return res.status(201).json({ success: true, pending: true });
            const name = clean(body.name, 80), role = clean(body.role, 100), text = clean(body.text, 1000);
            const stars = Number(body.stars);
            if (name.length < 2 || text.length < 8 || !Number.isInteger(stars) || stars < 1 || stars > 5) {
                return res.status(400).json({ success: false, code: 'invalid' });
            }
            const id = crypto.randomBytes(12).toString('hex');
            const review = { id, name, role, text, stars, status: 'pending', createdAt: new Date().toISOString() };
            if (!await createOnce(reviewPath(id), review)) return res.status(503).json({ success: false, code: 'retry' });
            return res.status(201).json({ success: true, pending: true });
        }

        if (!admin) return res.status(401).json({ success: false, code: 'unauthorized' });
        const id = clean(body.id, 24);
        if (!ID_RE.test(id)) return res.status(400).json({ success: false, code: 'invalid' });
        if (body.action === 'delete') {
            await removePath(reviewPath(id));
            return res.status(200).json({ success: true });
        }
        if (body.action === 'moderate' && ['approved', 'rejected'].includes(body.status)) {
            const result = await mutate(reviewPath(id), current => {
                if (!current) return null;
                current.status = body.status;
                current.reviewedAt = new Date().toISOString();
                return { data: current, result: true };
            });
            return res.status(result ? 200 : 404).json({ success: !!result });
        }
        return res.status(400).json({ success: false, code: 'unknown_action' });
    } catch (e) {
        console.error('reviews error:', e);
        return res.status(500).json({ success: false, error: 'Server error' });
    }
}
