import { NextResponse } from 'next/server';
import { errorColl, productColl } from '@/lib/mongodb';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { koreaTime } from '@/shared/koreaTime';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req: Request) {
  const data = await req.json();

  const { num, price, list } = data;

  console.log(num, price, list);

  // const koreaTime = dayjs().tz('Asia/Seoul');

  try {
    const updateResult = await productColl.updateOne(
      {
        num,
      },
      {
        $set: { price, list, updated_at: koreaTime },
      },
    );

    console.log('updateResult : ', updateResult);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.log(`${error} 오류다이`);
  }
  return NextResponse.json({ ok: false }, { status: 200 });
}
