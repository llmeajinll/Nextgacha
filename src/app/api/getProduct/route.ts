import { NextResponse } from 'next/server';
import { productColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  // const { data } = await req.json();
  // console.log(data);

  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag');
  const count = searchParams.get('count');
  const num = Number(searchParams.get('num'));

  console.log('mongodb params', Number(search), tag, search);

  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

  let query = {};

  if (tag === 'new') {
    console.log(fourMonthsAgo);
    query = { create: { $gte: fourMonthsAgo } };
  } else if (tag === 'hot') {
    query = {};
  } else if (tag === 'reserve') {
    query = { reserve: { $exists: true, $ne: '' } };
  } else if (search && search.trim() !== '') {
    query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ],
    };
  } else if (!isNaN(Number(search))) {
    query = { num: Number(search) };
  }

  if (num) {
    query = { num: num };
  }

  let func = productColl.find(query).sort({ create: -1 });

  if (count) {
    func = func.limit(Number(count));
  }

  // console.log(func);

  const product = await func.toArray();

  return NextResponse.json(product);
}
