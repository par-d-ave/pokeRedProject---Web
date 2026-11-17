import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app';

test('GET /no-existe devuelve 404 HTML con enlace a /', async () => {
  const res = await request(createApp()).get('/no-existe');
  assert.equal(res.status, 404);
  assert.match(res.headers['content-type'], /text\/html/);
  assert.match(res.text, /href="\/"/);
});