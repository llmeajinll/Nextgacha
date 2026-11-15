import { test } from 'node:test';
import assert from 'node:assert/strict';
import { activeDiscount, canBuy, saleState, withActiveDiscount } from './salePolicy.ts';

const now = new Date('2026-11-15T00:00:00Z');
const d = (s: string) => new Date(s);

test('기간 없는 할인은 그대로, 기간 밖이면 0', () => {
  assert.equal(activeDiscount({ discount: 20, isDiscount: true }, now), 20);
  assert.equal(activeDiscount({ discount: 20, isDiscount: false }, now), 0);
  assert.equal(activeDiscount({ discount: 20, discountStart: d('2026-11-16'), discountEnd: d('2026-11-20') }, now), 0);
  assert.equal(activeDiscount({ discount: 20, discountStart: d('2026-11-01'), discountEnd: d('2026-11-14') }, now), 0);
  // 종료일 당일까지는 할인
  assert.equal(activeDiscount({ discount: 20, discountStart: d('2026-11-01'), discountEnd: d('2026-11-15') }, now), 20);
  assert.equal(activeDiscount({ discount: 20, discountStart: d('2026-11-01'), discountEnd: d('2026-11-16') }, now), 20);
  assert.equal(activeDiscount({ discount: 20, discountStart: '', discountEnd: '' }, now), 20);
});

test('withActiveDiscount는 isDiscount도 맞춘다', () => {
  const p = withActiveDiscount({ discount: 30, isDiscount: true, discountEnd: d('2026-11-01') }, now);
  assert.equal(p.discount, 0);
  assert.equal(p.isDiscount, false);
});

test('예약 상품 판매 상태', () => {
  const p = { reserveStart: d('2026-11-01'), reserveEnd: d('2026-11-20') };
  assert.equal(saleState({ reserve: '', reserveEnd: '' }, now), 'normal');
  assert.equal(saleState(p, d('2026-10-31')), 'upcoming');
  assert.equal(saleState(p, now), 'reserve');
  assert.equal(saleState(p, d('2026-11-20T12:00:00Z')), 'reserve');
  assert.equal(saleState(p, d('2026-11-25')), 'hidden');
  assert.equal(saleState(p, d('2026-12-05')), 'normal');
  assert.equal(saleState(p, d('2026-12-04')), 'hidden');
  assert.equal(canBuy(p, d('2026-11-25')), false);
  assert.equal(canBuy(p, d('2026-10-31')), false);
  assert.equal(canBuy(p, now), true);
});
