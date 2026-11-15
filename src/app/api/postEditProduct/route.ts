import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { productColl } from '@/shared/api/mongodb';
import { logAdmin } from '@/shared/api/adminLog';
import { koreaTime } from '@/shared/lib/koreaTime';
import { parseProductEdit } from '@/entities/product/lib/parseProductForm';

// 관리자 상품 수정: 가격·할인율·옵션 재고
// ponytail: 옵션 목록을 통째로 덮어써서, 편집하는 동안 결제로 줄어든 재고는 저장 때 되돌아감. 동시 주문이 많아지면 옵션별 $set으로
export async function POST(req: Request) {
  const edit = parseProductEdit(await req.json().catch(() => null));
  if (!edit) {
    return NextResponse.json({ ok: false, message: 'invalid input' }, { status: 400 });
  }

  const { num, price, discount, list } = edit;
  try {
    // 바꾸기 전 값 (관리자 작업 기록용)
    const before = await productColl.findOneAndUpdate(
      { num },
      { $set: { price, discount, isDiscount: discount > 0, list, updated_at: koreaTime() } },
      { projection: { _id: 0, price: 1, discount: 1, list: 1 } },
    );
    if (!before) {
      return NextResponse.json({ ok: false, message: 'not found' }, { status: 404 });
    }
    const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
    await logAdmin((await auth())?.user?.email, [
      ...(before.price !== price ? [{ action: 'price' as const, target: num, before: before.price, after: price }] : []),
      ...((before.discount ?? 0) !== discount
        ? [{ action: 'discount' as const, target: num, before: before.discount ?? 0, after: discount }]
        : []),
      ...(!same(before.list, list) ? [{ action: 'stock' as const, target: num, before: before.list, after: list }] : []),
    ]);
    return NextResponse.json({ ok: true, product: { num, price, discount, isDiscount: discount > 0, list } });
  } catch (err) {
    console.error('상품 수정 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: '오류가 발생하였습니다.' }, { status: 500 });
  }
}
