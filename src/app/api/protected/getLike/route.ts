import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { userColl, productColl } from '@/lib/mongodb';

export async function GET(req: Request) {
  // const { searchParams } = new URL(req.url);
  // const email = searchParams.get('email') || '';
  // console.log('email : ', email);

  console.log('========================= server getLike');

  const session = await auth();
  const email = session?.user?.email;

  console.log('auth email : ', email);

  const result = await userColl
    .aggregate([
      { $match: { email } },
      {
        $lookup: {
          from: 'product',
          localField: 'like',
          foreignField: 'num',
          as: 'likedItems',
        },
      },
      {
        $project: {
          _id: 0,
          products: {
            $map: {
              input: '$likedItems',
              as: 'item',
              in: {
                $mergeObjects: ['$$item', { like: true }],
              },
            },
          },
        },
      },
    ])
    .toArray();

  console.log('result : ', result[0].products);

  return NextResponse.json({ result: result[0]?.products || [], ok: true });
}
