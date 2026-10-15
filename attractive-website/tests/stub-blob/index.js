// in-memory stand-in for Vercel Blob (tests only)
export const store = new Map();
let n = 0;
export async function put(path, body, opts = {}) {
  const cur = store.get(path);
  if (cur && opts.allowOverwrite === false) throw new Error('This blob already exists');
  if (cur && opts.ifMatch && opts.ifMatch !== cur.etag) { const e = new Error('precondition'); e.name = 'BlobPreconditionFailedError'; throw e; }
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  store.set(path, { text, etag: '"e' + (++n) + '"' });
  return { url: 'mem://' + path, pathname: path };
}
export async function head(path) { const c = store.get(path); if (!c) { throw new Error('not found'); } return { url: 'mem://' + path, etag: c.etag, pathname: path }; }
export async function list({ prefix = '' } = {}) { return { blobs: [...store.keys()].filter(k => k.startsWith(prefix)).map(k => ({ pathname: k })), hasMore: false }; }
export async function del(url) { store.delete(url.replace('mem://', '')); }
globalThis.__blobStore = store;
const realFetch = globalThis.fetch;
globalThis.fetch = async (u, o) => { if (String(u).includes('googleapis.com/oauth2/v3/certs')) return { ok: true, status: 200, json: async () => ({ keys: globalThis.__jwks || [] }) }; if (String(u).startsWith('mem://')) { const p = String(u).slice(6).split('?')[0]; const c = store.get(p); return { ok: !!c, status: c ? 200 : 404, headers: { get: (h) => (h.toLowerCase() === 'etag' ? c && c.etag : null) }, json: async () => JSON.parse(c.text), text: async () => c.text }; } return realFetch(u, o); };
