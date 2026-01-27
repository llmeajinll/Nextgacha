import { NextResponse } from 'next/server';
import { errorColl } from '@/lib/mongodb';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req: Request) {
  const data = await req.json();

  const { textareaValue, pathname } = data;

  const koreaTime = dayjs().tz('Asia/Seoul');

  try {
    const discountResult = await errorColl.insertOne({
      textareaValue,
      pathname,
      created_at: koreaTime.format('YYYY-MM-DD hh-mm-ss'),
    });

    console.log('discountResult : ', discountResult);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.log(`${error} 오류다이`);
  }
  return NextResponse.json({ ok: false }, { status: 200 });
}
