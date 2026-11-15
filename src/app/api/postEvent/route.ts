import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { productColl } from '@/shared/api/mongodb';
import { logAdmin } from '@/shared/api/adminLog';
import { parseProductEvent } from '@/entities/product/lib/parseProductForm';

// 관리자 전용(proxy ADMIN_API_PATHS). discount 0이면 할인을 내린다.
// 기간(start~end)을 주면 화면·결제가 그 기간에만 할인을 적용한다 (entities/product/lib/salePolicy.ts)
export async function POST(req: Request) {
  const event = parseProductEvent(await req.json().catch(() => null));
  if (!event) return NextResponse.json({ ok: false, message: '잘못된 요청이에요.' }, { status: 400 });

  const { discount, nums, start, end } = event;
  try {
    const before = await productColl
      .find({ num: { $in: nums } })
      .project<{ num: number; discount?: number; discountStart?: Date | null; discountEnd?: Date | null }>({
        _id: 0, num: 1, discount: 1, discountStart: 1, discountEnd: 1,
      })
      .toArray();
    const result = await productColl.updateMany(
      { num: { $in: nums } },
      {
        $set: {
          discount,
          isDiscount: discount > 0,
          discountStart: start,
          discountEnd: end,
          updated_at: new Date(),
        },
      },
    );
    await logAdmin(
      (await auth())?.user?.email,
      before.map((p) => ({
        action: 'discount' as const,
        target: p.num,
        before: { discount: p.discount ?? 0, start: p.discountStart ?? null, end: p.discountEnd ?? null },
        after: { discount, start, end },
      })),
    );
    return NextResponse.json({ ok: true, matchedCount: result.matchedCount });
  } catch (error) {
    console.error('postEvent 실패', error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false, message: '반영하지 못했어요.' }, { status: 500 });
  }
}
