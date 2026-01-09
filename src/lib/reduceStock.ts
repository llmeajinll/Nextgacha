import { productColl, cartColl } from '@/lib/mongodb';
import { ClientSession } from 'mongodb';

export async function reduceStock({
  list,
  email,
  mongodbSession,
}: {
  list: any[];
  email: string;
  mongodbSession: ClientSession;
}) {
  // console.log('reduceStock list, email : ', list, email);
  console.log('========== reduceStock ==========');

  const bulkOps = list.flatMap((item) =>
    item.product.map((p: any) => ({
      updateOne: {
        filter: {
          num: item.num, // 상위 문서 찾기
          'list.name': p.name, // list 배열 내 특정 상품 찾기
        },
        update: {
          $inc: { 'list.$.count': -p.count }, // 해당 상품의 count를 요청 수량만큼 차감
        },
      },
    }))
  );

  if (bulkOps.length === 0) return;

  // 2. 한 번의 네트워크 요청으로 모든 업데이트 실행
  try {
    const result = await productColl.bulkWrite(bulkOps, {
      session: mongodbSession,
    });
    console.log('result : ', result);
    return { ok: true };
  } catch (err) {
    console.log(err);
    return { ok: false };
  }
}
