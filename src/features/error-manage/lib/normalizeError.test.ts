import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeError } from './normalizeError.ts';

test('옛 문서: API 경로면 시스템, 상태는 접수', () => {
  const e = normalizeError({ _id: 'a', textareaValue: '[결제 취소 실패] orderId=1', pathname: '/api/postPaymentsConfirm' });
  assert.equal(e.type, 'system');
  assert.equal(e.status, '접수');
  assert.equal(e.isPayment, true);
});

test('옛 문서: 페이지 경로면 사용자 제보, 결제 문구가 있어도 결제 기록 아님', () => {
  const e = normalizeError({ _id: 'b', textareaValue: '[결제 취소 실패] 라고 떴어요', pathname: '/cart' });
  assert.equal(e.type, 'report');
  assert.equal(e.isPayment, false);
});

test('환불 DB 실패 기록도 결제 기록', () => {
  const e = normalizeError({ _id: 'd', textareaValue: '[환불 DB 처리 실패 - 결제는 취소됨] orderId=2', pathname: '/api/postCheckToSending' });
  assert.equal(e.isPayment, true);
});

test('저장된 type·status를 그대로 쓴다', () => {
  const e = normalizeError({ _id: 'c', type: 'system', status: '처리 완료', textareaValue: 'Tracking Error', pathname: '/api/track' });
  assert.equal(e.status, '처리 완료');
  assert.equal(e.isPayment, false);
});
