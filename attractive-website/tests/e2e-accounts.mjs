process.env.ADMIN_API_SECRET = 'test-admin-secret-0123456789abcdef0123';
process.env.DATA_KEY = 'test-data-key-0123456789';
process.env.GOOGLE_CLIENT_ID = 'cid.apps.googleusercontent.com';
process.env.LEGACY_ADMIN_SECRET = 'legacy-test-secret-0123456789abcdef';
import crypto from 'crypto';
import { store, put } from '@vercel/blob';
import accounts from './api/accounts.js';
import orders from './api/orders.js';

const call = async (handler, body, { method = 'POST', headers = {} } = {}) => {
  const req = { method, headers: { 'x-forwarded-for': '8.8.8.' + Math.floor(Math.random() * 250), ...headers }, body, query: {}, socket: {} };
  let status = 200, json;
  const res = { setHeader() {}, status(c) { status = c; return res; }, json(j) { json = j; return res; }, end() { return res; } };
  await handler(req, res); return { status, json };
};
let pass = 0, fail = 0;
const t = (n, c, x = '') => { c ? pass++ : fail++; console.log((c ? 'PASS' : 'FAIL') + '  ' + n + (c ? '' : '  -> ' + JSON.stringify(x))); };

// fake Google
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
globalThis.__jwks = [{ ...publicKey.export({ format: 'jwk' }), kid: 'k1', alg: 'RS256' }];
const now = Math.floor(Date.now() / 1000);
const idToken = (o = {}) => { const h = Buffer.from(JSON.stringify({ alg: 'RS256', kid: 'k1' })).toString('base64url'); const p = Buffer.from(JSON.stringify({ iss: 'https://accounts.google.com', aud: process.env.GOOGLE_CLIENT_ID, sub: 'g-1', email: 'new@gmail.com', email_verified: true, name: 'New Person', iat: now, exp: now + 3600, ...o })).toString('base64url'); return h + '.' + p + '.' + crypto.sign('RSA-SHA256', Buffer.from(h + '.' + p), privateKey).toString('base64url'); };

// 1. brand-new Google user
let r = await call(accounts, { action: 'google', credential: idToken() });
t('google: new account created + session', r.json.success && r.json.isNew && r.json.token && r.json.account.email === 'new@gmail.com', r);
t('google: googleSub / hashes not exposed', !('googleSub' in r.json.account) && !('passwordHash' in r.json.account));
const tok = r.json.token, id = r.json.account.id;
let me = await call(accounts, { action: 'me', id, token: tok });
t('google session works with me()', me.json.success);
// 2. same Google user again -> same account
r = await call(accounts, { action: 'google', credential: idToken() });
t('google: second sign-in reuses account', r.json.success && !r.json.isNew && r.json.account.id === id);
// 3. forged / wrong-audience token
r = await call(accounts, { action: 'google', credential: idToken({ aud: 'other' }) });
t('google: wrong audience refused', r.status === 401 && r.json.code === 'bad_google_token');
r = await call(accounts, { action: 'google', credential: idToken({ email_verified: false }) });
t('google: unverified e-mail refused', r.status === 401);
r = await call(accounts, { action: 'google', credential: 'x.y.z' });
t('google: garbage refused', r.status === 401);
// 4. pre-hijack protection: attacker registers victim e-mail with a password first
const atk = await call(accounts, { action: 'register', email: 'victim@gmail.com', password: 'attackerpass1', name: 'x' });
t('attacker pre-registers victim e-mail', atk.json.success);
r = await call(accounts, { action: 'google', credential: idToken({ sub: 'g-victim', email: 'victim@gmail.com' }) });
t('victim signs in with Google -> linked to that account', r.json.success && !r.json.isNew && r.json.account.id === atk.json.account.id);
const stale = await call(accounts, { action: 'me', id: atk.json.account.id, token: atk.json.token });
t('attacker session revoked', !stale.json.success);
const atkLogin = await call(accounts, { action: 'login', email: 'victim@gmail.com', password: 'attackerpass1' });
t('attacker password no longer works', atkLogin.status === 401);
// 5. another Google account claiming the same e-mail
r = await call(accounts, { action: 'google', credential: idToken({ sub: 'g-other', email: 'victim@gmail.com' }) });
t('different Google sub on same e-mail refused', r.status === 409 && r.json.code === 'google_conflict');
// 6. logout invalidates the session server-side
await call(accounts, { action: 'logout', id, token: tok });
me = await call(accounts, { action: 'me', id, token: tok });
t('logout kills the session', !me.json.success);
// 7. password login for unknown e-mail returns the same error as a wrong password
const bad1 = await call(accounts, { action: 'login', email: 'nobody@x.com', password: 'whatever123' });
const bad2 = await call(accounts, { action: 'login', email: 'victim@gmail.com', password: 'wrongwrong' });
t('unknown e-mail and wrong password look identical', bad1.status === 401 && bad2.status === 401 && bad1.json.code === bad2.json.code);

// 8. legacy migration: old plaintext file under an explicitly configured legacy-secret path
store.clear();
const legacyPath = 'private-data/' + crypto.createHash('sha256').update('accounts:' + process.env.LEGACY_ADMIN_SECRET).digest('hex').slice(0, 32) + '/accounts.json';
await put(legacyPath, JSON.stringify({ accounts: [{ id: 'old-1', email: 'old@user.com', name: 'Old', active: true, passwordEncoded: Buffer.from('oldpassword1').toString('base64') }], members: [{ id: 'vip-1', email: 'vip@user.com', name: 'V' }] }), { allowOverwrite: true });
t('legacy file exists before', store.has(legacyPath));
r = await call(accounts, { action: 'login', email: 'old@user.com', password: 'oldpassword1' });
t('legacy account can log in (password upgraded to a hash on import)', r.json.success, r);
t('legacy plaintext file purged after import', !store.has(legacyPath));
const dump = [...store.entries()].map(([k, v]) => k + v.text).join('');
t('no base64 password left anywhere', !dump.includes(Buffer.from('oldpassword1').toString('base64')));
const rawSecret = await call(accounts, null, { method: 'GET', headers: { 'x-admin-secret': process.env.ADMIN_API_SECRET } });
t('admin API refuses the raw password in x-admin-secret', rawSecret.status === 401, rawSecret);
const loginMod = await import('./api/admin-login.js');
const adm = await call(loginMod.default, { password: process.env.ADMIN_API_SECRET });
t('admin-login issues a token for the right password', adm.json.success && adm.json.token, adm);
const list = await call(accounts, null, { method: 'GET', headers: { authorization: 'Bearer ' + adm.json.token } });
t('admin list works with the Bearer token', list.status === 200 && Array.isArray(list.json.accounts) && !JSON.stringify(list.json).includes('passwordHash'), list.status);
const badTok = await call(accounts, null, { method: 'GET', headers: { authorization: 'Bearer 9999999999999.deadbeef' } });
t('forged admin token refused', badTok.status === 401);

console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
