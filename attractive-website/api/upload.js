// Vercel serverless function: uploads an image/video to Vercel Blob and returns its public URL.
// Used by the admin panel's live-preview media uploader. Admin only.
// NOTE: Vercel serverless request bodies are limited to ~4.5MB. Larger videos should be added as a link instead.
import { put } from '@vercel/blob';
import { isAdmin, rateLimit, tooMany } from './_auth.js';

export const config = { api: { bodyParser: false } };

const ALLOWED = /^(image\/(png|jpe?g|webp|gif|avif)|video\/(mp4|webm|quicktime))$/i;
const MAX = 4.4 * 1024 * 1024;

// The first bytes of the file must really be what the Content-Type claims (stops e.g. HTML/SVG/JS uploaded as "image/png").
function looksLike(type, b) {
    const ascii = (from, to) => b.subarray(from, to).toString('latin1');
    if (type === 'image/png') return b.length > 8 && b[0] === 0x89 && ascii(1, 4) === 'PNG';
    if (type === 'image/jpeg' || type === 'image/jpg') return b.length > 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
    if (type === 'image/gif') return ascii(0, 4) === 'GIF8';
    if (type === 'image/webp') return ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP';
    if (type === 'image/avif') return ascii(4, 8) === 'ftyp' && /avif|avis|mif1/.test(ascii(8, 16));
    if (type === 'video/mp4' || type === 'video/quicktime') return ascii(4, 8) === 'ftyp';
    if (type === 'video/webm') return b.length > 4 && b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3;
    return false;
}

async function readCapped(req, max) {
    const chunks = []; let n = 0;
    for await (const c of req) {
        n += c.length;
        if (n > max) return null;
        chunks.push(c);
    }
    return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  const rl = rateLimit(req, 'upload', 60, 15 * 60 * 1000);
  if (rl.limited) return tooMany(res, rl);

  // "image/png; charset=binary" -> "image/png"
  const type = String(req.headers['content-type'] || '').split(';')[0].trim().toLowerCase();
  if (!ALLOWED.test(type)) return res.status(415).json({ error: 'Unsupported file type' });

  const len = parseInt(req.headers['content-length'] || '0', 10);
  if (len > MAX) return res.status(413).json({ error: 'File too large (max ~4.4MB). Use a link instead.' });

  const body = await readCapped(req, MAX); // counts the real bytes, the header can lie
  if (!body) return res.status(413).json({ error: 'File too large (max ~4.4MB). Use a link instead.' });
  if (!looksLike(type, body)) return res.status(415).json({ error: 'File content does not match its type' });

  const raw = String(req.query.filename || 'preview');
  const filename = 'builder-preview/' + Date.now() + '-' + raw.replace(/[^\w.\-]+/g, '_').slice(0, 80);

  try {
    const blob = await put(filename, body, { access: 'public', contentType: type, addRandomSuffix: true });
    return res.status(200).json({ url: blob.url });
  } catch (e) {
    console.error('upload error:', e);
    return res.status(500).json({ error: 'Upload failed' });
  }
}
