import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = String(__ENV.BASE_URL || '').replace(/\/$/, '');
const targetVus = Number(__ENV.TARGET_VUS || 50);
const productionHost = 'attractive2.vercel.app';

if (!baseUrl || !Number.isInteger(targetVus) || targetVus < 1 || targetVus > 10000) {
  throw new Error('Set BASE_URL and TARGET_VUS (1..10000).');
}
const parsedUrl = new URL(baseUrl);
if (parsedUrl.protocol !== 'https:') throw new Error('Load tests require an HTTPS preview URL.');
if (parsedUrl.hostname === productionHost) throw new Error('Refusing to load test the production domain. Use a preview deployment.');
if (targetVus > 250 && __ENV.LOAD_TEST_ACK !== 'staging-only') {
  throw new Error('For tests above 250 VUs, set LOAD_TEST_ACK=staging-only and use a preview deployment you control.');
}

export const options = {
  scenarios: {
    storefront: {
      executor: 'ramping-vus',
      startVUs: Math.min(10, targetVus),
      stages: [
        { duration: '2m', target: Math.ceil(targetVus * 0.1) },
        { duration: '3m', target: Math.ceil(targetVus * 0.5) },
        { duration: '3m', target: targetVus },
        { duration: '2m', target: targetVus },
        { duration: '2m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const responses = http.batch([
    ['GET', `${baseUrl}/`, null, { tags: { route: 'home' } }],
    ['GET', `${baseUrl}/api/store`, null, { tags: { route: 'store' } }],
    ['GET', `${baseUrl}/api/reviews`, null, { tags: { route: 'reviews' } }],
  ]);
  check(responses[0], { 'home returns 200': r => r.status === 200 });
  check(responses[1], { 'catalog returns 200': r => r.status === 200 });
  check(responses[2], { 'reviews return 200': r => r.status === 200 });
  sleep(8 + Math.random() * 12);
}
