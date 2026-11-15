import { test } from 'node:test';
import assert from 'node:assert/strict';
import { businessDaysBefore, daysBefore } from './businessDays.ts';

// 2026-11-16은 월요일
test('영업일은 주말을 건너뛴다', () => {
  const mon = new Date('2026-11-16T10:00:00+09:00');
  assert.equal(businessDaysBefore(1, mon), '2026-11-13 10:00:00'); // 금
  assert.equal(businessDaysBefore(3, mon), '2026-11-11 10:00:00'); // 수
  const wed = new Date('2026-11-18T10:00:00+09:00');
  assert.equal(businessDaysBefore(2, wed), '2026-11-16 10:00:00');
  assert.equal(businessDaysBefore(3, wed), '2026-11-13 10:00:00');
});

test('KST 기준으로 요일을 본다 (UTC로는 아직 일요일인 월요일 새벽)', () => {
  const monEarly = new Date('2026-11-16T01:00:00+09:00');
  assert.equal(businessDaysBefore(1, monEarly), '2026-11-13 01:00:00');
});

test('달력일', () => {
  assert.equal(daysBefore(5, new Date('2026-11-16T10:00:00+09:00')), '2026-11-11 10:00:00');
});
