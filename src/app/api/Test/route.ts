import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: '테스트 성공',
    data: '여기에 원하는 데이터를 넣으세요',
  });
}
