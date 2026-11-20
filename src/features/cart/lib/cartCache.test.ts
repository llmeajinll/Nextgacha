import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyCartChange, addToCartList } from './cartCache.ts';
import type { CartItem } from '../model/types';

const item = (num: number, list: { name: string; count: number }[]): CartItem => ({
  num,
  cart: { num, list },
  keep: { num, list: [] },
  stock: { num, price: 1000, list: [], title: 't' },
});

test('장바구니 수량 증가·감소는 그 옵션만 바꾸고 감소는 1 아래로 안 간다', () => {
  const items = [item(1, [{ name: 'a', count: 1 }, { name: 'b', count: 2 }]), item(2, [{ name: 'a', count: 3 }])];
  assert.deepEqual(applyCartChange(items, 1, 'a', 'increase')[0].cart.list, [{ name: 'a', count: 2 }, { name: 'b', count: 2 }]);
  assert.deepEqual(applyCartChange(items, 1, 'a', 'decrease')[0].cart.list[0], { name: 'a', count: 1 });
  assert.equal(applyCartChange(items, 1, 'a', 'increase')[1], items[1]);
});

test('마지막 옵션을 지우면 상품 묶음째 빠진다', () => {
  const items = [item(1, [{ name: 'a', count: 1 }]), item(2, [{ name: 'a', count: 3 }])];
  assert.deepEqual(applyCartChange(items, 1, 'a', 'erase').map((it) => it.num), [2]);
});

test('상품 상세에서 담으면 있는 옵션은 더하고 없는 옵션은 붙인다', () => {
  const cart = [{ name: 'a', count: 1 }];
  assert.deepEqual(addToCartList(cart, [{ name: 'a', count: 2 }, { name: 'b', count: 1 }]), [
    { name: 'a', count: 3 },
    { name: 'b', count: 1 },
  ]);
  assert.deepEqual(cart, [{ name: 'a', count: 1 }]);
});
