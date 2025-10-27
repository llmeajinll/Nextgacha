import { NextResponse } from 'next/server';
import { productDB } from '@/lib/mongodb';

export async function GET(req: Request) {
  // const { data } = await req.json();
  // console.log(data);

  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';

  console.log('mongodb params', Number(search), tag);

  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

  let query = {};

  if (search === '') {
    query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ],
    };
  } else if (tag === 'new') {
    query = { create: { $gte: fourMonthsAgo } };
  } else if (tag === 'hot') {
    query = {};
  } else if (typeof Number(search) === 'number') {
    query = { num: Number(search) };
  }

  const product = await productDB.find(query).sort({ create: -1 }).toArray();

  return NextResponse.json(product);
  // return NextResponse.json({
  //   title: '치이카와 우물우물파티 3탄',
  //   id: 'chiikawa_mogumogu_num3',
  //   manufacturer: '반다이',
  //   price: 4000,
  //   point: 40,
  //   count: 5,
  //   list: [
  //     {
  //       name: '치이카와',
  //       code: 'ban3_1',
  //       count: 1,
  //       price: 4000,
  //       title: '치이카와 우물우물파티 3탄',
  //     },
  //     {
  //       name: '하치와레',
  //       code: 'ban3_2',
  //       count: 0,
  //       price: 4000,
  //       title: '치이카와 우물우물파티 3탄',
  //     },
  //     {
  //       name: '우사기',
  //       code: 'ban3_3',
  //       count: 1,
  //       price: 4000,
  //       title: '치이카와 우물우물파티 3탄',
  //     },
  //     {
  //       name: '밤만쥬',
  //       code: 'ban3_4',
  //       count: 1,
  //       price: 4000,
  //       title: '치이카와 우물우물파티 3탄',
  //     },
  //     {
  //       name: '모몬가',
  //       code: 'ban3_5',
  //       count: 1,
  //       price: 4000,
  //       title: '치이카와 우물우물파티 3탄',
  //     },
  //   ],
  // });
}
