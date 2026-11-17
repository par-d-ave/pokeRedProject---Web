import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app';

test('GET /health devuelve 200 y {status: "ok"}', async () => {
  const res = await request(createApp()).get('/health');
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /application\/json/);
  assert.deepEqual(res.body, { status: 'ok' });
});