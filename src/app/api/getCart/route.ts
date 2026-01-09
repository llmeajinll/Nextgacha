import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { userColl, cartColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  const session = await auth();
  const email = session?.user?.email;

  console.log('auth email : ', email);

  const pipeline = [
    { $match: { user: email } },
    {
      $facet: {
        cart: [
          { $project: { _id: 0, cart: 1 } },
          { $unwind: '$cart' },
          {
            $project: {
              num: '$cart.num',
              list: '$cart.product',
              check: { $literal: true },
            },
          },
        ],

        keep: [
          {
            $lookup: {
              from: 'user',
              localField: 'user',
              foreignField: 'email',
              as: 'userSide',
            },
          },
          { $unwind: '$userSide' },
          { $unwind: '$userSide.keep' },
          {
            $project: {
              _id: 0,
              num: '$userSide.keep.num',
              list: '$userSide.keep.product',
            },
          },
        ],

        // C. 상품 정보 (cart와 keep에 있는 모든 num들을 찾아 productCollection에서 가져옴)
        stock: [
          {
            $lookup: {
              from: 'user',
              localField: 'user',
              foreignField: 'email',
              as: 'u',
            },
          },
          { $unwind: '$u' },
          {
            $lookup: {
              from: 'product',
              let: {
                cartNums: '$cart.num',
                keepNums: '$u.keep.num',
              },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $in: [
                        '$num',
                        { $setUnion: ['$$cartNums', '$$keepNums'] },
                      ],
                    },
                  },
                },
                { $project: { _id: 0, num: 1, price: 1, list: 1, title: 1 } },
              ],
              as: 'products',
            },
          },
          { $unwind: '$products' },
          { $replaceRoot: { newRoot: '$products' } },
        ],
      },
    },
  ];

  const res = await cartColl.aggregate(pipeline).toArray();

  const data =
    res && res.length > 0 ? (res[0] as any) : { cart: [], keep: [], stock: [] };

  const { cart, stock, keep } = data;

  console.log('cart', cart, 'stock', stock, 'keep', keep);

  const cartMap = new Map<any, any>(
    (cart || []).map((item: any) => [item.num, item])
  );
  const keepMap = new Map<any, any>(
    (keep || []).map((item: any) => [item.num, item])
  );
  const stockMap = new Map<any, any>(
    (stock || []).map((item: any) => [item.num, item])
  );

  const validResults = [];
  const numsToDelete = [];

  // --- 재고 검증 로직 시작 ---
  for (const cartItem of cart || []) {
    const num = cartItem.num;
    const stockInfo = stockMap.get(num);

    console.log('stockInfo : ', stockInfo);

    // 1. 상품 정보(stock) 자체가 없으면 품절로 간주하고 전체 삭제 대상 등록
    if (!stockInfo) {
      numsToDelete.push(num);
      continue;
    }

    const validProducts = [];
    const namesToRemove = [];

    // 2. 장바구니 세부 품목(list) 순회 및 재고 비교
    for (const p of cartItem.list || []) {
      const actualStock = stockInfo.list?.find((s: any) => s.name === p.name);

      // 재고가 없거나, 장바구니 수량이 재고 수량보다 큰 경우 삭제 대상 등록
      if (!actualStock || p.count > actualStock.count) {
        namesToRemove.push(p.name);
        console.log(`[삭제대상] num: ${num}, 상품명: ${p.name} (재고 부족)`);
      } else {
        validProducts.push(p);
      }
    }

    if (namesToRemove.length > 0) {
      console.log('부분 삭제 실행 (일부 상품만 재고 초과인 경우)');
      await cartColl.updateOne({ user: email, 'cart.num': num }, {
        $pull: { 'cart.$.product': { name: { $in: namesToRemove } } },
      } as any);
    }

    // 4. 결과 배열 구성
    if (validProducts.length > 0) {
      // 살아남은 상품이 있는 경우에만 결과에 포함
      validResults.push({
        num: num,
        cart: { ...cartItem, list: validProducts },
        keep: keepMap.get(num) || { num, list: [] },
        stock: stockInfo,
      });
    } else {
      // 모든 세부 상품이 삭제된 경우 num 그룹 자체를 삭제 리스트에 등록
      if (!numsToDelete.includes(num)) numsToDelete.push(num);
    }
  }

  // 5. 빈 num 그룹들 일괄 삭제
  if (numsToDelete.length > 0) {
    await cartColl.updateOne({ user: email }, {
      $pull: { cart: { num: { $in: numsToDelete } } },
    } as any);
    console.log(
      `[삭제 완료] 품절/재고 부족 상품 그룹 ${numsToDelete.length}건 제거`
    );
  }

  return NextResponse.json(
    {
      ok: true,
      result: validResults,
      message:
        numsToDelete.length > 0
          ? `일부 품절 또는 재고 부족 상품이 정리되었습니다.`
          : '성공적으로 조회되었습니다.',
    },
    { status: 200 }
  );
}
