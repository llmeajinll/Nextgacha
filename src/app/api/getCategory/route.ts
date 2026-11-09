import { NextResponse } from 'next/server';
import { findCategoryMenu } from '@/entities/product/lib/findCategoryMenu';

export async function GET() {
  return NextResponse.json({ ok: true, menu: await findCategoryMenu() });
}
