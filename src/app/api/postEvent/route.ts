import { NextResponse } from 'next/server';
import { orderColl, mongodbClient, userColl, productColl } from '@/lib/mongodb';

export async function POST(req: Request) {
  const data = await req.json();

  const { discount, checkList } = data;

  try {
    const discountResult = await productColl.updateMany(
      {
        num: {
          $in: checkList,
        },
      },
      {
        $set: {
          discount: discount,
          isDiscount: true,
        },
      }
    );
    console.log(
      `${discountResult.matchedCount}개의 상품이 조건과 일치하며, ${discountResult.modifiedCount}개의 상품이 업데이트되었습니다.`
    );
    return NextResponse.json({ ok: true, discountResult }, { status: 200 });
  } catch (error) {
    console.log(`${error} 오류다이`);
  }
  return NextResponse.json({ ok: false, discountResult: [] }, { status: 200 });
}
