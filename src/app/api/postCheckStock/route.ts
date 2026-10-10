import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { validateStock } from '@/features/purchase/lib/validateStock';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ ok: false, message: '로그인 후 구매할 수 있습니다.' }, { status: 401 });
  }
  const { list } = await req.json();
  const result = await validateStock(list);
  //   console.log(result);
  if (result.isAvailable === false) {
    return Response.json(result, { status: 400 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
