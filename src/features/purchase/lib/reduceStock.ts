import { productColl } from '@/shared/api/mongodb';
import { ClientSession } from 'mongodb';
import { OrderLine } from './orderPolicy';

// 재고가 충분한 경우에만 차감. 하나라도 부족하면 throw → 전체 롤백
export async function reduceStock({
  list,
  mongodbSession,
}: {
  list: OrderLine[];
  mongodbSession: ClientSession;
}) {
  const bulkOps = list.flatMap((item) =>
    item.product.map((p) => ({
      updateOne: {
        filter: {
          num: item.num,
          list: { $elemMatch: { name: p.name, count: { $gte: p.count } } },
        },
        update: { $inc: { 'list.$.count': -p.count } },
      },
    })),
  );

  const result = await productColl.bulkWrite(bulkOps, {
    session: mongodbSession,
  });

  if (result.matchedCount !== bulkOps.length) {
    throw new Error('재고가 부족한 상품이 있습니다.');
  }
}
