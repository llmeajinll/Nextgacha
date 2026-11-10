import { NextResponse } from 'next/server';
import { productColl } from '@/shared/api/mongodb';
import { parseProductEvent } from '@/entities/product/lib/parseProductForm';

// 관리자 전용(proxy ADMIN_API_PATHS). discount 0이면 할인을 내린다
export async function POST(req: Request) {
  const event = parseProductEvent(await req.json().catch(() => null));
  if (!event) return NextResponse.json({ ok: false, message: '잘못된 요청이에요.' }, { status: 400 });

  const { discount, nums } = event;
  try {
    const result = await productColl.updateMany(
      { num: { $in: nums } },
      { $set: { discount, isDiscount: discount > 0, updated_at: new Date() } },
    );
    return NextResponse.json({ ok: true, matchedCount: result.matchedCount });
  } catch (error) {
    console.error('postEvent 실패', error);
    return NextResponse.json({ ok: false, message: '반영하지 못했어요.' }, { status: 500 });
  }
}
