import { NextResponse } from 'next/server';
import { productColl } from '@/shared/api/mongodb';
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
    const result = await productColl.updateOne(
      { num },
      { $set: { price, discount, isDiscount: discount > 0, list, updated_at: koreaTime() } },
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ ok: false, message: 'not found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, product: { num, price, discount, isDiscount: discount > 0, list } });
  } catch (err) {
    console.error('상품 수정 실패:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: '오류가 발생하였습니다.' }, { status: 500 });
  }
}
