import crypto from 'crypto';
import { verifyGoogleCredential, _resetKeyCache } from '../api/_google.js';
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256', use: 'sig' };
const other = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const mk = (payload, { key = privateKey, kid = 'k1', alg = 'RS256' } = {}) => {
  const h = Buffer.from(JSON.stringify({ alg, kid, typ: 'JWT' })).toString('base64url');
  const p = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const s = crypto.sign('RSA-SHA256', Buffer.from(h + '.' + p), key).toString('base64url');
  return h + '.' + p + '.' + s;
};
const CID = 'my-client.apps.googleusercontent.com';
const now = Math.floor(Date.now() / 1000);
const good = { iss: 'https://accounts.google.com', aud: CID, sub: '123', email: 'A@B.com', email_verified: true, name: 'Ali', iat: now, exp: now + 3600 };
const opts = { fetchKeys: async () => ({ keys: [jwk] }) };
let pass = 0, fail = 0;
const t = async (name, fn, expectErr) => {
  _resetKeyCache();
  try { const r = await fn(); if (expectErr) { fail++; console.log('FAIL', name, '(accepted!)'); } else { pass++; console.log('PASS', name, r && r.email || ''); } }
  catch (e) { if (expectErr && (!expectErr.test || expectErr.test(e.message))) { pass++; console.log('PASS', name, '->', e.message); } else { fail++; console.log('FAIL', name, e.message); } }
};
await t('valid token', () => verifyGoogleCredential(mk(good), CID, opts));
await t('email lowercased', async () => { const r = await verifyGoogleCredential(mk(good), CID, opts); if (r.email !== 'a@b.com') throw new Error('not lowercased'); return r; });
await t('wrong audience rejected', () => verifyGoogleCredential(mk({ ...good, aud: 'evil' }), CID, opts), /audience/);
await t('wrong issuer rejected', () => verifyGoogleCredential(mk({ ...good, iss: 'https://evil.com' }), CID, opts), /issuer/);
await t('expired rejected', () => verifyGoogleCredential(mk({ ...good, exp: now - 3600 }), CID, opts), /expired/);
await t('unverified email rejected', () => verifyGoogleCredential(mk({ ...good, email_verified: false }), CID, opts), /verified/);
await t('forged signature rejected', () => verifyGoogleCredential(mk(good, { key: other.privateKey }), CID, opts), /signature/);
await t('alg=none rejected', () => verifyGoogleCredential(mk(good, { alg: 'none' }), CID, opts), /alg/);
await t('unknown kid rejected', () => verifyGoogleCredential(mk(good, { kid: 'zzz' }), CID, opts), /unknown key/);
await t('garbage rejected', () => verifyGoogleCredential('a.b.c', CID, opts), /malformed|alg/);
await t('missing client id rejected', () => verifyGoogleCredential(mk(good), '', opts), /not configured/);
await t('tampered payload rejected', async () => { const tk = mk(good).split('.'); tk[1] = Buffer.from(JSON.stringify({ ...good, email: 'victim@x.com' })).toString('base64url'); return verifyGoogleCredential(tk.join('.'), CID, opts); }, /signature/);
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
