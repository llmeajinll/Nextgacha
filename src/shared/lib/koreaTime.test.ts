import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toKoreaTime } from './koreaTime.ts';

// 서버(UTC)에서 렌더해도 KST 기준 월이 나와야 hydration 불일치가 없다
test('KST 자정(UTC 15:00)으로 저장된 날짜는 KST 월로 포맷', () => {
  assert.equal(toKoreaTime('2025-12-31T15:00:00.000Z').format('YYYY년 MM월'), '2026년 01월');
});
