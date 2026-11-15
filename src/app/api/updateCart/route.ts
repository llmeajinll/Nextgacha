import { cartColl } from '@/shared/api/mongodb';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkCartLimit } from '@/features/purchase/lib/checkCartLimit';

export async function POST(req: Request) {
  const data = await req.json();
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ ok: false, message: 'unauthorized' }, { status: 401 });
  }

  const { name, num, preset } = data;

  // 갯수 증가할 때
  if (preset === 'increase') {
    const limitError = await checkCartLimit(email, num, [{ name, count: 1 }]);
    if (limitError) {
      return NextResponse.json({ ok: false, message: limitError }, { status: 400 });
    }

    const result = await cartColl.updateOne(
      { user: email, 'cart.num': num },
      { $inc: { 'cart.$[outer].product.$[inner].count': 1 } },
      { arrayFilters: [{ 'outer.num': num }, { 'inner.name': name }] },
    );

    return NextResponse.json({ ok: true, result });
  }
  // 갯수 감소할 때
  else if (preset === 'decrease') {
    const result = await cartColl.updateOne(
      {
        user: email,
        'cart.num': num, // 어떤 카트 그룹인지 식별
      },
      {
        // cart 배열에서 num이 일치하는 요소의 product 배열 안에서 code가 일치하는 p 요소를 찾음
        $inc: { 'cart.$[outer].product.$[inner].count': -1 },
      },
      {
        arrayFilters: [
          { 'outer.num': num }, // 외부 cart 배열 필터
          { 'inner.name': name, 'inner.count': { $gt: 1 } }, // 내부 product 배열 필터 (1 미만으로 내려가지 않음)
        ],
      },
    );
    return NextResponse.json({ ok: true, result }, { status: 200 });
  }
  // 상품 삭제할 때
  else if (preset === 'erase') {
    const result = await cartColl.updateOne(
      { user: email, 'cart.num': num },
      {
        $pull: { 'cart.$.product': { name } },
      },
    );

    // 만약 product 배열이 비었다면 해당 num 그룹 자체를 제거 (선택사항)
    await cartColl.updateOne(
      { user: email },
      { $pull: { cart: { product: { $size: 0 } } } },
    );

    return NextResponse.json({ ok: true, result }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Invalid preset' }, { status: 400 });
  }
}
