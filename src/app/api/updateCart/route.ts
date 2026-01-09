import { cartColl } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { revalidateTag } from 'next/cache';

export async function POST(req: Request) {
  const data = await req.json();
  const session = await auth();
  const email = session?.user?.email;
  // console.log('data : ', data.code, 'email : ', session?.user?.email);

  const { name, num, preset } = data;
  console.log('name, num, preset : ', name, num, preset);

  // 갯수 증가할 때
  if (preset === 'increase') {
    const result = await cartColl.updateOne(
      { user: email, 'cart.num': num },
      { $inc: { 'cart.$[outer].product.$[inner].count': 1 } },
      { arrayFilters: [{ 'outer.num': num }, { 'inner.name': name }] }
    );

    console.log('increase result : ', result);
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
          { 'inner.name': name }, // 내부 product 배열 필터
        ],
      }
    );
    console.log(`decrease result : `, result);
    return NextResponse.json({ ok: true, result }, { status: 200 });
  }
  // 상품 삭제할 때
  else if (preset === 'erase') {
    const result = await cartColl.updateOne(
      { user: email, 'cart.num': num },
      {
        $pull: { 'cart.$.product': { name } } as any,
      }
    );

    // 만약 product 배열이 비었다면 해당 num 그룹 자체를 제거 (선택사항)
    await cartColl.updateOne(
      { user: email },
      { $pull: { cart: { product: { $size: 0 } } } as any }
    );

    return NextResponse.json({ ok: true, result }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Invalid preset' }, { status: 400 });
  }
}
