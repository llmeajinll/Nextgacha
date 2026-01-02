import { NextResponse } from 'next/server';
import { userColl, cartColl, orderColl } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || '';
  const lastId = searchParams.get('lastId') || '';
  console.log(status, lastId);

  let query: any = { status };

  if (lastId) {
    query._id = { $lt: new ObjectId(lastId) };
  }
  console.log(query);
  const data = await orderColl
    .find(query)
    .sort({ _id: -1 })
    .limit(10)
    .toArray();

  const result = data.map((item) => {
    return {
      ...item,
      check: false,
    };
  });

  console.log(result);
  const nextCursor = result[result.length - 1]?._id || '';
  return NextResponse.json({ result, nextCursor });
}
