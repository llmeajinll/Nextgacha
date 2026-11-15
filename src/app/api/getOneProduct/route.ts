import { NextResponse } from 'next/server';
import { productColl, userColl } from '@/shared/api/mongodb';
import { auth } from '@/auth';
import { withActiveDiscount } from '@/entities/product/lib/salePolicy';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session = await auth();
  const email = session?.user?.email;

  const num = Number(searchParams.get('num'));

  const doc = await productColl.findOne({ num });
  if (!doc) {
    return NextResponse.json({ ok: false, result: null }, { status: 404 });
  }

  // 할인은 지금 기준(기간)으로 바꿔서 내보낸다. 클라이언트 가격 계산은 그대로
  const func = withActiveDiscount(doc);

  let result = null;

  if (email) {
    const user = await userColl.findOne(
      { email },
      { projection: { like: 1, _id: 0 } },
    );


    const isLike = (user?.like || [])?.includes(num);
    result = {
      ...func,
      like: isLike,
    };

  } else {
    result = {
      ...func,
      like: false,
    };

  }

  return NextResponse.json({ result, ok: true });
}
