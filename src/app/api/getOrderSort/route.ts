import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { findOrdersByStatus } from '@/features/order-manage/lib/findOrdersByStatus';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || '';
  const lastId = searchParams.get('lastId') || '';

  if (lastId && !ObjectId.isValid(lastId)) {
    return NextResponse.json({ result: [], nextCursor: '' }, { status: 400 });
  }

  return NextResponse.json(await findOrdersByStatus(status, lastId));
}
