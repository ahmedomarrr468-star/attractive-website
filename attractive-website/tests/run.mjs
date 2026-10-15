// npm test  ->  unit tests (price engine, Google token check) + end-to-end tests of the API handlers
// against an in-memory Vercel Blob stand-in, + the real storefront script talking to those handlers.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const run = (file, cwd) => spawnSync(process.execPath, [file], { cwd, stdio: 'inherit' }).status === 0;
let ok = true;
for (const f of ['pricing.test.mjs', 'google.test.mjs']) { console.log('\n=== ' + f); ok = run(path.join(root, 'tests', f), path.join(root, 'tests')) && ok; }

// api/_defaults.js is generated from public/procable-data.js: fail loudly if someone edited the defaults and forgot to regenerate it
{
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'attractive-defaults-'));
  fs.mkdirSync(path.join(d, 'api')); fs.mkdirSync(path.join(d, 'public')); fs.mkdirSync(path.join(d, 'scripts'));
  fs.copyFileSync(path.join(root, 'public', 'procable-data.js'), path.join(d, 'public', 'procable-data.js'));
  fs.copyFileSync(path.join(root, 'scripts', 'extract-defaults.mjs'), path.join(d, 'scripts', 'extract-defaults.mjs'));
  const g = spawnSync(process.execPath, [path.join(d, 'scripts', 'extract-defaults.mjs')], { cwd: d, encoding: 'utf8' });
  const fresh = g.status === 0 ? fs.readFileSync(path.join(d, 'api', '_defaults.js'), 'utf8') : null;
  const same = fresh !== null && fresh === fs.readFileSync(path.join(root, 'api', '_defaults.js'), 'utf8');
  console.log('\n=== api/_defaults.js is in sync with public/procable-data.js: ' + (same ? 'PASS' : 'FAIL  -> run: npm run extract-defaults'));
  ok = same && ok;
  fs.rmSync(d, { recursive: true, force: true });
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'attractive-e2e-'));
fs.cpSync(path.join(root, 'api'), path.join(tmp, 'api'), { recursive: true });
fs.cpSync(path.join(root, 'tests', 'stub-blob'), path.join(tmp, 'node_modules', '@vercel', 'blob'), { recursive: true });
fs.copyFileSync(path.join(root, 'public', 'procable-data.js'), path.join(tmp, 'procable-data.js'));
fs.writeFileSync(path.join(tmp, 'package.json'), '{"type":"module"}');
for (const f of ['e2e-orders.mjs', 'e2e-accounts.mjs', 'client-flow.mjs']) {
  fs.copyFileSync(path.join(root, 'tests', f), path.join(tmp, f));
  console.log('\n=== ' + f);
  ok = run(path.join(tmp, f), tmp) && ok;
}
fs.rmSync(tmp, { recursive: true, force: true });
console.log(ok ? '\nALL TEST FILES PASSED' : '\nSOME TESTS FAILED');
process.exit(ok ? 0 : 1);
