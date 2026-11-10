import { NextResponse } from 'next/server';
import { errorColl } from '@/shared/api/mongodb';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { koreaTime } from '@/shared/lib/koreaTime';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req: Request) {
  const data = await req.json();

  const { textareaValue, pathname } = data;
  // 비로그인도 제보 가능한 공개 API라 형식/길이만 제한
  if (
    typeof textareaValue !== 'string' ||
    typeof pathname !== 'string' ||
    textareaValue.length > 2000 ||
    pathname.length > 300
  ) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // const koreaTime = dayjs().tz('Asia/Seoul');

  try {
    const discountResult = await errorColl.insertOne({
      textareaValue,
      pathname,
      type: 'report',
      status: '접수',
      created_at: koreaTime(),
    });

    console.log('discountResult : ', discountResult);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.log(`${error} 오류다이`);
  }
  return NextResponse.json({ ok: false }, { status: 200 });
}
