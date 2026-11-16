import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { productColl } from '@/shared/api/mongodb';

// 재입고 알림 신청 (docs/policies/operations.md "품절·재입고"). 품절(모든 옵션 재고 0) 상품만 받는다
export async function POST(req: Request) {
  const email = (await auth())?.user?.email;
  if (!email) return NextResponse.json({ ok: false, message: '로그인이 필요합니다.' }, { status: 401 });

  const { num } = await req.json().catch(() => ({}));
  if (!Number.isInteger(num) || num <= 0) {
    return NextResponse.json({ ok: false, message: '잘못된 요청입니다.' }, { status: 400 });
  }

  const result = await productColl.updateOne(
    { num, 'list.count': { $not: { $gt: 0 } } },
    { $addToSet: { restockSubs: email } },
  );
  if (result.matchedCount === 0) {
    return NextResponse.json({ ok: false, message: '지금 구매할 수 있는 상품입니다.' }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}
