import { NextResponse } from 'next/server';
import { orderColl } from '@/lib/mongodb';
import { validateStock } from '@/lib/validateStock';

export async function POST(req: Request) {
  return NextResponse.json({ ok: true }, { status: 200 });
}
