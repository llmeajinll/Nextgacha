import { userColl, cartColl } from '@/lib/mongodb';
import { ClientSession, AnyBulkWriteOperation } from 'mongodb';

export async function reducePoint({
  usedPoint,
  email,
  list,
  mongodbSession,
}: {
  usedPoint: number;
  email: string;
  list: any[];
  mongodbSession: ClientSession;
}) {
  console.log('reducePoint usedPoint, email : ', usedPoint, email, list);

  try {
    const bulkOps = [];

    for (const item of list) {
      const { num, product: newProducts } = item;

      for (const prod of newProducts) {
        // (A) num과 name이 모두 존재하는 경우: count 증가
        bulkOps.push({
          updateOne: {
            filter: { email, 'keep.num': num, 'keep.product.name': prod.name },
            update: {
              $inc: { 'keep.$[outer].product.$[inner].count': prod.count },
            },
            arrayFilters: [{ 'outer.num': num }, { 'inner.name': prod.name }],
          },
        });

        // (B) num은 있는데 name이 없는 경우: product 배열에 새 객체 추가
        // (A)가 실행되지 않았을 때만 실행되도록 filter 조건에 name: { $ne: prod.name } 추가
        bulkOps.push({
          updateOne: {
            filter: {
              email,
              'keep.num': num,
              'keep.product.name': { $ne: prod.name },
            },
            update: {
              $push: {
                'keep.$.product': { name: prod.name, count: prod.count },
              },
            },
          },
        });

        // (C) num 자체가 없는 경우: keep 배열에 전체 객체 추가
        bulkOps.push({
          updateOne: {
            filter: { email, 'keep.num': { $ne: num } },
            update: {
              $addToSet: {
                keep: {
                  num: num,
                  product: [{ name: prod.name, count: prod.count }],
                },
              },
            },
          },
        });
      }
    }

    const pointUpdate = await userColl.updateOne(
      { email },
      { $inc: { point: -usedPoint } },
      { session: mongodbSession }
    );

    const bulkResult = await userColl.bulkWrite(
      bulkOps as AnyBulkWriteOperation<any>[],
      { session: mongodbSession, ordered: false }
    );

    const result = await Promise.all([pointUpdate, bulkResult]);
    console.log(result);
    return { ok: true };
  } catch (err) {
    console.log(err);
    return { ok: false };
  }
}
