import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const token = (await cookies()).has('authjs.session-token');
  return NextResponse.json({ isAuth: !!token });
}
