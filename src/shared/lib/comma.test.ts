import { test } from 'node:test';
import assert from 'node:assert/strict';
import { comma } from './comma.ts';

test('number에 콤마 추가', () => {
  assert.equal(comma(123456789), '123,456,789');
});

test('string에 콤마 추가', () => {
  assert.equal(comma('123456789'), '123,456,789');
});

test('이미 콤마가 있는 string은 그대로', () => {
  assert.equal(comma('123,456,789'), '123,456,789');
});
