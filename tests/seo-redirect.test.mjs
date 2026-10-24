import test from 'node:test';
import assert from 'node:assert/strict';
import { onRequest } from '../functions/_middleware.js';

const testRequest = async (url) => onRequest({
  request: new Request(url),
  next: async () => new Response('PASS THROUGH', { status: 200 })
});

test('legacy production Pages domain redirects permanently to canonical domain', async () => {
  const response = await testRequest('https://caribbeanbusinessatlas.pages.dev/directory/tranquilitas-day-spa/?ref=old');
  assert.equal(response.status, 301);
  assert.equal(response.headers.get('Location'), 'https://mag.bahamasaisolutions.com/directory/tranquilitas-day-spa/?ref=old');
});

test('canonical domain serves static content without redirect or loop', async () => {
  const response = await testRequest('https://mag.bahamasaisolutions.com/directory/');
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'PASS THROUGH');
});

test('Cloudflare review branch URLs and submission API are preserved', async () => {
  const preview = await testRequest('https://design-living-atlas-swagv2.caribbeanbusinessatlas.pages.dev/');
  const api = await testRequest('https://mag.bahamasaisolutions.com/api/submissions');
  assert.equal(preview.status, 200);
  assert.equal(api.status, 200);
});

test('legacy robots, sitemap and pages retain paths and query strings', async () => {
  for (const path of ['/','/robots.txt','/sitemap.xml','/stories/?q=hotel']) {
    const result = await testRequest('https://caribbeanbusinessatlas.pages.dev'+path);
    assert.equal(result.status, 301);
    assert.equal(result.headers.get('Location'), 'https://mag.bahamasaisolutions.com'+path);
  }
});
