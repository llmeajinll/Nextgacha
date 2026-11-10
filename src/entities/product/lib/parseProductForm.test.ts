import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseProductEdit, parseProductEvent, parseProductForm } from './parseProductForm.ts';

const ok = {
  title: ' 상품 ',
  price: '3000',
  discount: '10',
  company: 'BANDAI',
  group: JSON.stringify(['산리오', '산리오']),
  list: JSON.stringify([{ name: 'A', count: 3 }]),
  detail: JSON.stringify([{ type: 'text', text: '설명' }, { type: 'image' }]),
};

test('정상 폼은 정리되어 통과', () => {
  const r = parseProductForm(ok);
  assert.equal(r?.title, '상품');
  assert.equal(r?.price, 3000);
  assert.deepEqual(r?.group, ['산리오']);
  assert.equal(r?.reserve, null);
  assert.equal(r?.detail.length, 2);
});

test('가격·할인율·수량 범위 밖이면 거부', () => {
  assert.equal(parseProductForm({ ...ok, price: '0' }), null);
  assert.equal(parseProductForm({ ...ok, price: '1.5' }), null);
  assert.equal(parseProductForm({ ...ok, discount: '100' }), null);
  assert.equal(parseProductForm({ ...ok, list: JSON.stringify([{ name: 'A', count: 0 }]) }), null);
});

test('옵션 없음·이름 중복·연산자 객체는 거부', () => {
  assert.equal(parseProductForm({ ...ok, list: '[]' }), null);
  assert.equal(
    parseProductForm({ ...ok, list: JSON.stringify([{ name: 'A', count: 1 }, { name: 'A', count: 2 }]) }),
    null,
  );
  assert.equal(parseProductForm({ ...ok, group: JSON.stringify([{ $ne: '' }]) }), null);
  assert.equal(parseProductForm({ ...ok, group: '[]' }), null);
  assert.equal(parseProductForm({ ...ok, list: 'not json' }), null);
});

test('예약은 세 날짜가 다 있고 종료일이 시작일 이후여야 함', () => {
  const res = { reserveStart: '2026-12-01', reserveEnd: '2026-12-10', reserveShip: '2027-01-15' };
  assert.ok(parseProductForm({ ...ok, ...res })?.reserve);
  assert.equal(parseProductForm({ ...ok, reserveStart: '2026-12-01' }), null);
  assert.equal(parseProductForm({ ...ok, ...res, reserveEnd: '2026-11-01' }), null);
});

test('빈 글 블록은 거부', () => {
  assert.equal(parseProductForm({ ...ok, detail: JSON.stringify([{ type: 'text', text: ' ' }]) }), null);
});

test('상품 수정: 재고 0은 허용, 이상한 값은 거부', () => {
  const edit = { num: 3, price: 4500, discount: 10, list: [{ name: ' A ', count: 0 }] };
  assert.deepEqual(parseProductEdit(edit), { num: 3, price: 4500, discount: 10, list: [{ name: 'A', count: 0 }] });
  assert.equal(parseProductEdit({ ...edit, num: { $ne: 0 } }), null);
  assert.equal(parseProductEdit({ ...edit, price: 0 }), null);
  assert.equal(parseProductEdit({ ...edit, discount: 100 }), null);
  assert.equal(parseProductEdit({ ...edit, list: [] }), null);
  assert.equal(parseProductEdit({ ...edit, list: [{ name: 'A', count: 1 }, { name: 'A', count: 2 }] }), null);
  assert.equal(parseProductEdit({ ...edit, list: [{ name: 'A', count: -1 }] }), null);
  assert.equal(parseProductEdit(null), null);
});

test('이벤트 할인: 0~99%, 상품 번호 1~500개', () => {
  assert.deepEqual(parseProductEvent({ discount: 20, nums: [3, 5, 3] }), { discount: 20, nums: [3, 5] });
  assert.deepEqual(parseProductEvent({ discount: 0, nums: [1] }), { discount: 0, nums: [1] });
  assert.equal(parseProductEvent({ discount: 100, nums: [1] }), null);
  assert.equal(parseProductEvent({ discount: 10, nums: [] }), null);
  assert.equal(parseProductEvent({ discount: 10, nums: [{ $gt: 0 }] }), null);
  assert.equal(parseProductEvent({ discount: 10, nums: ['1'] }), null);
  assert.equal(parseProductEvent({ discount: 10, nums: 'all' }), null);
  assert.equal(parseProductEvent(null), null);
});
