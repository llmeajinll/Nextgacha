import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findSuspects } from './findSuspects.ts';

const base = { orderId: 'A', email: 'a@x.com', deviceId: 'd1', ip: '1.1.1.1', address: '서울시 강남구 1', list: [{ num: 7 }] };

test('같은 상품 + 같은 기기·배송지인 다른 계정을 찾는다', () => {
  const other = { ...base, orderId: 'B', email: 'b@x.com', ip: '2.2.2.2', address: '서울시  강남구1' };
  assert.deepEqual(findSuspects(base, [other]), [{ orderId: 'B', email: 'b@x.com', by: ['같은 기기', '같은 배송지'] }]);
});

test('같은 계정, 다른 상품, 겹치는 신호 없음은 제외', () => {
  const same = { ...base, orderId: 'C' };
  const otherItem = { ...base, orderId: 'D', email: 'd@x.com', list: [{ num: 8 }] };
  const clean = { orderId: 'E', email: 'e@x.com', deviceId: 'd9', ip: '9.9.9.9', address: '부산', list: [{ num: 7 }] };
  assert.deepEqual(findSuspects(base, [same, otherItem, clean]), []);
});

test('기기·IP가 없는 옛 주문끼리는 빈 값으로 매칭하지 않는다', () => {
  const t = { ...base, deviceId: null, ip: null, address: '' };
  const o = { ...t, orderId: 'F', email: 'f@x.com' };
  assert.deepEqual(findSuspects(t, [o]), []);
});
