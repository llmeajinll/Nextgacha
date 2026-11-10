import { NextResponse } from 'next/server';
import { findOrdersByStatus } from '@/features/order-manage/lib/findOrdersByStatus';
import { isOrderStatus } from '@/features/order-manage/model/status';

// 관리자 주문 목록 API (?status=상품 확인중&page=1). 관리자 화면은 서버 컴포넌트가 같은 함수를 직접 부른다
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const page = Number(searchParams.get('page') || 1);

  if (!isOrderStatus(status) || !Number.isInteger(page) || page < 1) {
    return NextResponse.json({ result: [], total: 0 }, { status: 400 });
  }

  return NextResponse.json(await findOrdersByStatus(status, page));
}
