// 유니크 인덱스(docs/policies/data.md "유니크 인덱스")와 보존 기간 TTL 인덱스("데이터 보존 기간", admin.md "관리자 작업 기록").
// 실행: node --env-file=.env.local scripts/migrations/2026-11-15-indexes.mjs <DB 이름>
//   gacha_dev 먼저, 그다음 gacha. 같은 이름·옵션의 인덱스가 이미 있으면 createIndex는 아무것도 하지 않는다(두 번 돌려도 같음).
//   유니크 인덱스는 중복 문서가 있으면 실패하므로, 먼저 중복을 찾아 출력하고 그 컬렉션은 건너뛴다.
import { MongoClient } from 'mongodb';

const dbName = process.argv[2];
if (!dbName) {
  console.error('DB 이름을 적어 주세요. 예: node --env-file=.env.local scripts/migrations/2026-11-15-indexes.mjs gacha_dev');
  process.exit(1);
}

const DAY = 24 * 60 * 60;
const UNIQUE = [
  ['order', 'orderId'],
  ['user', 'email'],
  ['cart', 'user'],
  ['product', 'num'],
];
const TTL = [
  // 시스템 에러 6개월. createdAt(Date)은 recordSystemError가 넣는다. 옛 문서(문자열 created_at만 있음)는 지워지지 않는다
  ['error', 'createdAt', 183 * DAY, { type: 'system' }],
  // 관리자 작업 기록 5년
  ['adminLog', 'createdAt', 5 * 365 * DAY, undefined],
];

const client = new MongoClient(process.env.MONGODB_URI);
try {
  const db = client.db(dbName);
  for (const [coll, field] of UNIQUE) {
    const dup = await db
      .collection(coll)
      .aggregate([
        { $match: { [field]: { $exists: true } } },
        { $group: { _id: `$${field}`, n: { $sum: 1 } } },
        { $match: { n: { $gt: 1 } } },
        { $limit: 20 },
      ])
      .toArray();
    if (dup.length) {
      console.warn(`${coll}.${field} 중복 ${dup.length}건 이상 → 정리 후 다시 실행:`, dup.map((d) => `${d._id}(${d.n})`).join(', '));
      continue;
    }
    await db.collection(coll).createIndex({ [field]: 1 }, { unique: true, name: `${field}_unique` });
    console.log(`${coll}.${field} 유니크 인덱스 OK`);
  }
  for (const [coll, field, seconds, partial] of TTL) {
    await db.collection(coll).createIndex(
      { [field]: 1 },
      { expireAfterSeconds: seconds, name: `${field}_ttl`, ...(partial && { partialFilterExpression: partial }) },
    );
    console.log(`${coll}.${field} TTL ${Math.round(seconds / DAY)}일 OK`);
  }
  // page_views(GA4 이전으로 수집 중단)는 날짜가 KST 문자열이라 TTL이 안 먹는다
  // → 마지막 방문(lastVisit) + 12개월을 Date로 expireAt에 넣고, expireAt 시각에 지우는 TTL을 건다
  const pv = db.collection('page_views');
  const r = await pv.updateMany({ expireAt: { $exists: false }, lastVisit: { $type: 'string' } }, [
    {
      $set: {
        expireAt: {
          $dateAdd: {
            startDate: { $dateFromString: { dateString: '$lastVisit', timezone: 'Asia/Seoul', onError: '$$NOW' } },
            unit: 'month',
            amount: 12,
          },
        },
      },
    },
  ]);
  await pv.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0, name: 'expireAt_ttl' });
  console.log(`page_views expireAt ${r.modifiedCount}건 채움, TTL(12개월) OK`);
} finally {
  await client.close();
}
