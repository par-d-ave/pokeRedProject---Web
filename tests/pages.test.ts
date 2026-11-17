import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app';

const ANCHOR_IDS = [
  'combates',
  'movimiento',
  'texto-fast',
  'alarma-hp',
  'evoluciones',
  'safari-zone',
];

function count(text: string, pattern: RegExp): number {
  return (text.match(pattern) ?? []).length;
}

test('GET / devuelve la landing con 6 filas de comparativa', async () => {
  const res = await request(createApp()).get('/');
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /text\/html/);
  assert.match(res.text, /<h1>/);
  assert.match(res.text, /\.sav/);
  assert.match(res.text, /href="\/implementacion"/);
  assert.equal(count(res.text, /class="compare-row"/g), 6);
});

test('GET / no carga el script de copiar', async () => {
  const res = await request(createApp()).get('/');
  assert.doesNotMatch(res.text, /copy-code\.js/);
});

test('GET /implementacion contiene las 6 anclas', async () => {
  const res = await request(createApp()).get('/implementacion');
  assert.equal(res.status, 200);
  assert.match(res.headers['content-type'], /text\/html/);
  for (const id of ANCHOR_IDS) {
    assert.match(res.text, new RegExp(`id="${id}"`));
  }
});

test('GET /implementacion tiene 6 botones, 6 bloques de código y el script', async () => {
  const res = await request(createApp()).get('/implementacion');
  assert.equal(count(res.text, /class="copy-btn"/g), 6);
  assert.equal(count(res.text, /<pre[ >]/g), 6);
  assert.match(res.text, /\/js\/copy-code\.js/);
});