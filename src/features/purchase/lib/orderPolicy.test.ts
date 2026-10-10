import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcOrder, isValidOrderList, mergeKeep, overCapItem, subtractKeep } from './orderPolicy.ts';

test('orderPolicy: 금액/포인트/보유 한도/keep 계산', () => {
  const products = [
    { num: 1, price: 10000, discount: 0 },
    { num: 2, price: 20000, discount: 50 },
  ];

  // 배송비 포함 (50,000원 미만)
  const small = calcOrder(products, [{ num: 1, product: [{ name: 'a', count: 2 }] }], 0)!;
  assert.equal(small.total, 23000);
  assert.equal(small.addPoint, 200);
  assert.equal(small.maxUsablePoint, 22000);

  // 무료배송 + 할인 + 포인트 사용
  const big = calcOrder(
    products,
    [
      { num: 1, product: [{ name: 'a', count: 4 }] },
      { num: 2, product: [{ name: 'b', count: 2 }] },
    ],
    5000,
  )!;
  assert.equal(big.subtotal, 60000);
  assert.equal(big.total, 55000);

  // 없는 상품
  assert.equal(calcOrder(products, [{ num: 9, product: [{ name: 'x', count: 1 }] }], 0), null);

  // 입력 검증
  assert.equal(isValidOrderList([{ num: 1, product: [{ name: 'a', count: -1 }] }]), false);
  assert.equal(isValidOrderList([{ num: 1, product: [{ name: 'a', count: 1.5 }] }]), false);
  assert.equal(isValidOrderList([]), false);
  assert.equal(isValidOrderList([{ num: 1, product: [{ name: 'a', count: 1 }] }]), true);

  // 보유 한도: 배송중 3 + 구매 2 = 5 OK, + 3 = 6 초과
  const keep = [{ num: 1, product: [{ name: 'a', count: 3 }] }];
  assert.equal(overCapItem(mergeKeep(keep, [{ num: 1, product: [{ name: 'a', count: 2 }] }])), null);
  assert.equal(overCapItem(mergeKeep(keep, [{ num: 1, product: [{ name: 'a', count: 3 }] }])), 'a');
  // 같은 이름이라도 다른 상품(num)이면 별개
  assert.equal(overCapItem(mergeKeep(keep, [{ num: 2, product: [{ name: 'a', count: 5 }] }])), null);
  // 원본 불변
  assert.equal(keep[0].product[0].count, 3);

  // 배송 완료/환불: keep에서 차감, 0이 된 상품·빈 그룹 제거
  const held = [
    { num: 1, product: [{ name: 'a', count: 3 }, { name: 'b', count: 1 }] },
    { num: 2, product: [{ name: 'a', count: 2 }] },
  ];
  assert.deepEqual(
    subtractKeep(held, [
      { num: 1, product: [{ name: 'b', count: 1 }] },
      { num: 2, product: [{ name: 'a', count: 2 }] },
    ]),
    [{ num: 1, product: [{ name: 'a', count: 3 }] }],
  );
  assert.equal(held[0].product.length, 2);
});
