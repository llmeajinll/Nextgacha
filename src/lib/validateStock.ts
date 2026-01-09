import { productColl, cartColl } from '@/lib/mongodb';
import { auth } from '@/auth';

export async function validateStock(list: any[]) {
  if (!list || list.length === 0) return { isAvailable: false };

  const session = await auth();
  const email = session?.user?.email;

  console.log('========== validateStock ==========');
  console.log('validateStock input list:', JSON.stringify(list, null, 2));

  // 1. 모든 num을 추출하여 DB에서 한꺼번에 조회
  const nums = list.map((i: any) => i.num);
  const dbDocs = await productColl
    .find({ num: { $in: nums } })
    .project({ _id: 0, num: 1, list: 1 }) // 상품 상세 정보(list 배열) 가져오기
    .toArray();

  // 2. 조회를 빠르게 하기 위해 Map 생성
  const docMap = new Map(dbDocs.map((doc) => [doc.num, doc]));

  // 3. 루프를 돌며 재고 검증
  for (const item of list) {
    const parentDoc = docMap.get(item.num);

    // 해당 num의 상품 그룹 자체가 DB에 없는 경우
    if (!parentDoc) {
      return {
        message: `상품 그룹(num: ${item.num})을 찾을 수 없습니다.`,
        isAvailable: false,
      };
    }

    // item.product 배열 순회 (예: [{ name: 'A', count: 2 }, ...])
    for (const p of item.product) {
      // DB의 list 배열에서 같은 이름을 가진 세부 상품 찾기
      const actual = parentDoc.list.find((li: any) => li.name === p.name);

      console.log(
        `[검증] num: ${item.num}, 상품명: ${p.name} -> DB재고: ${
          actual?.count ?? 0
        }, 요청: ${p.count}`
      );

      // 상품이 없거나 재고가 부족한 경우
      if (!actual || actual.count < p.count) {
        console.log(
          `[재고부족 발견] 삭제 시도: num ${item.num}, 상품명 ${p.name}`
        );

        // 3. cartCollection에서 해당 상품($pull) 제거
        await cartColl.updateOne(
          {
            user: email,
            'cart.num': item.num,
          },
          {
            $pull: { 'cart.$.product': { name: p.name } as any },
          }
        );

        // 4. 상품 제거 후, 만약 product 배열이 비어버렸다면 해당 num 그룹 자체를 제거
        await cartColl.updateOne(
          { user: email },
          { $pull: { cart: { product: { $size: 0 } } } as any }
        );

        return {
          message: `${p.name}의 재고가 부족하여 장바구니에서 삭제되었습니다.`,
          isAvailable: false,
        };
      }
    }
  }

  console.log('validateStock 검증 통과');
  return { isAvailable: true };
}
