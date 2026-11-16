// DB 테스트 (docs/policies/engineering.md "테스트 범위"): 실제 MongoDB의 gacha_test DB에서 트랜잭션을 돌린다.
// 실행: pnpm test:db (.env.local의 MONGODB_URI 사용). CI에는 DB 비밀값이 없어 돌리지 않는다.
// Toss 호출은 fetch를 바꿔치기해서 기록만 한다 (실제 결제 API를 부르지 않음).
import { test, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import type { CartLine } from '@/shared/api/docs';

// mongodb.ts가 import될 때 DB를 고르므로 반드시 import 전에
process.env.MONGODB_DB = 'gacha_test';
process.env.TOSS_SECRET_KEY ||= 'test_sk_dbtest';
delete process.env.KAKAO_ADMIN_REFRESH_TOKEN; // 실패 경로에서 관리자 카톡을 보내지 않게

const tossCalls: string[] = [];
globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
  const url = new URL(input instanceof Request ? input.url : input);
  if (url.origin !== 'https://api.tosspayments.com') throw new Error(`테스트에서 외부 호출 금지: ${url.origin}`);
  tossCalls.push(`${init?.method ?? 'GET'} ${url.pathname}`);
  return Response.json({ status: 'CANCELED' });
}) as typeof fetch;

const { mongodbClient, productColl, userColl, orderColl, cartColl, errorColl } = await import('@/shared/api/mongodb');
// 다른 DB면 아무것도 지우기 전에 멈춘다
if (productColl.dbName !== 'gacha_test') {
  await mongodbClient.close();
  throw new Error(`DB 테스트는 gacha_test에서만 돈다 (현재 ${productColl.dbName})`);
}
const { reducePoint } = await import('./reducePoint.ts');
const { reduceStock } = await import('./reduceStock.ts');
const { addOrder } = await import('./addOrder.ts');
const { resetCart } = await import('./resetCart.ts');
const { refundOrder } = await import('./refundOrder.ts');
const { shipExchange } = await import('./shipExchange.ts');

const email = 'buyer@dbtest.local';
const NUM = 1;

async function seed({ stock, point = 500, keep = [] }: { stock: { A: number; B: number }; point?: number; keep?: CartLine[] }) {
  await productColl.insertOne({
    num: NUM,
    title: '테스트 가챠',
    price: 1000,
    list: [
      { name: 'A', count: stock.A },
      { name: 'B', count: stock.B },
    ],
  });
  await userColl.insertOne({ email, point, keep });
  await cartColl.insertOne({ user: email, cart: [{ num: NUM, product: [{ name: 'A', count: 2 }, { name: 'B', count: 1 }] }] });
}

async function stockOf(name: string) {
  const p = await productColl.findOne({ num: NUM });
  return p?.list.find((o: { name: string }) => o.name === name)?.count;
}

const order = (orderId: string, status: string, list: CartLine[]) => ({
  customer: '테스트',
  email,
  orderId,
  paymentKey: `pk_${orderId}`,
  list,
  address: '서울',
  status,
  courier: '',
  invoice: '',
  totalPrice: 2000,
  addPoint: 20,
  usedPoint: 300,
  created_at: '2026-11-10 10:00:00',
  arrivedDate: '',
  review: false,
  deviceId: null,
  ip: null,
});

async function purchase(orderId: string, list: CartLine[], usedPoint: number) {
  const session = mongodbClient.startSession();
  try {
    // postPaymentsConfirm과 같은 순서
    await session.withTransaction(async () => {
      await reducePoint({ usedPoint, email, list, mongodbSession: session });
      await reduceStock({ list, mongodbSession: session });
      await addOrder({
        orderId,
        paymentKey: `pk_${orderId}`,
        list,
        amount: 2000,
        email,
        name: '테스트',
        mongodbSession: session,
        address: '서울',
        addPoint: 20,
        usedPoint,
        deviceId: null,
        ip: null,
      });
      await resetCart({ email, list, mongodbSession: session });
    });
  } finally {
    await session.endSession();
  }
}

beforeEach(async () => {
  tossCalls.length = 0;
  await Promise.all([productColl, userColl, orderColl, cartColl, errorColl].map((c) => c.deleteMany({})));
});

after(() => mongodbClient.close());

test('결제 트랜잭션: 포인트·keep·재고·주문·장바구니가 함께 반영된다', async () => {
  await seed({ stock: { A: 3, B: 1 } });
  await purchase('order_ok', [{ num: NUM, product: [{ name: 'A', count: 2 }] }], 300);

  const user = await userColl.findOne({ email });
  assert.equal(user?.point, 200);
  assert.deepEqual(user?.keep, [{ num: NUM, product: [{ name: 'A', count: 2 }] }]);
  assert.equal(await stockOf('A'), 1);
  assert.equal((await orderColl.findOne({ orderId: 'order_ok' }))?.status, '상품 확인중');
  // 산 옵션(A)만 장바구니에서 빠지고 B는 남는다
  assert.deepEqual((await cartColl.findOne({ user: email }))?.cart, [{ num: NUM, product: [{ name: 'B', count: 1 }] }]);
});

test('결제 트랜잭션: 재고가 모자라면 앞 단계(포인트·keep)까지 모두 롤백된다', async () => {
  await seed({ stock: { A: 3, B: 1 } });
  await assert.rejects(
    purchase('order_short', [{ num: NUM, product: [{ name: 'A', count: 2 }, { name: 'B', count: 2 }] }], 300),
    /재고/,
  );

  const user = await userColl.findOne({ email });
  assert.equal(user?.point, 500);
  assert.deepEqual(user?.keep, []);
  assert.equal(await stockOf('A'), 3);
  assert.equal(await stockOf('B'), 1);
  assert.equal(await orderColl.countDocuments({}), 0);
  assert.equal((await cartColl.findOne({ user: email }))?.cart[0].product.length, 2);
});

test('환불: 재고 복구, 사용 포인트 반환, keep 차감, 상태 환불. 두 번째 호출은 거절', async () => {
  const list = [{ num: NUM, product: [{ name: 'A', count: 2 }] }];
  await seed({ stock: { A: 1, B: 1 }, point: 200, keep: [{ num: NUM, product: [{ name: 'A', count: 3 }] }] });
  await orderColl.insertOne(order('order_refund', '상품 확인중', list));

  const first = await refundOrder('order_refund', '테스트 환불', { by: 'admin' });
  assert.equal(first.ok, true);
  assert.deepEqual(tossCalls, ['POST /v1/payments/pk_order_refund/cancel']);
  assert.equal(await stockOf('A'), 3);
  const user = await userColl.findOne({ email });
  assert.equal(user?.point, 500);
  assert.deepEqual(user?.keep, [{ num: NUM, product: [{ name: 'A', count: 1 }] }]);
  assert.equal((await orderColl.findOne({ orderId: 'order_refund' }))?.status, '환불');

  const second = await refundOrder('order_refund', '테스트 환불', { by: 'admin' });
  assert.equal(second.ok, false);
  assert.equal(tossCalls.length, 1, '두 번째에는 결제 취소를 부르지 않는다');
  assert.equal(await stockOf('A'), 3);
  assert.equal((await userColl.findOne({ email }))?.point, 500);
});

test('교환 발송: 재고가 모자라면 실패하고 주문 상태·재고는 그대로', async () => {
  await seed({ stock: { A: 1, B: 1 } });
  await orderColl.insertOne(order('order_ex', '교환 요청', [{ num: NUM, product: [{ name: 'A', count: 2 }] }]));

  await assert.rejects(shipExchange('order_ex'), /재고/);
  const after = await orderColl.findOne({ orderId: 'order_ex' });
  assert.equal(after?.status, '교환 요청');
  assert.equal(after?.exchangedDate, undefined);
  assert.equal(await stockOf('A'), 1);
});

test('교환 발송: 재고가 있으면 수량만큼 빼고 교환 완료. 다시 부르면 거절', async () => {
  await seed({ stock: { A: 3, B: 1 } });
  await orderColl.insertOne(order('order_ex2', '교환 요청', [{ num: NUM, product: [{ name: 'A', count: 2 }] }]));

  await shipExchange('order_ex2');
  assert.equal((await orderColl.findOne({ orderId: 'order_ex2' }))?.status, '교환 완료');
  assert.equal(await stockOf('A'), 1);

  await assert.rejects(shipExchange('order_ex2'), /이미 처리/);
  assert.equal(await stockOf('A'), 1);
});
