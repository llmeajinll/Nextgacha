import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { findProducts } from '@/entities/product/lib/findProducts';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session = await auth();

  const result = await findProducts({
    tag: searchParams.get('tag'),
    search: searchParams.get('search')?.trim() ?? '',
    count: Number(searchParams.get('count')),
    page: Number(searchParams.get('page')),
    filter: searchParams.get('filter'),
    email: session?.user?.email,
  });

  return NextResponse.json(result);
}
