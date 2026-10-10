import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';
import { userColl, productColl } from '@/shared/api/mongodb';

export async function GET(req: Request) {
  const session = await auth();
  const email = session?.user?.email;

  const { searchParams } = new URL(req.url);
  const pageStr = searchParams.get('page') || '';
  const page = Number(pageStr);

  const skip = (page - 1) * 20;
  const limit = 20;

  const likeResult = await userColl
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
              input: { $slice: ['$likedItems', skip, limit] },
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

  const totalResult = await userColl
    .aggregate([
      { $match: { email } },
      {
        $project: {
          _id: 0,
          likeCount: { $size: { $ifNull: ['$like', []] } },
        },
      },
    ])
    .toArray();

  // 유저 문서가 없거나 like 필드가 없어도 빈 목록으로
  const result = {
    likeResult: likeResult[0]?.products ?? [],
    total: totalResult[0]?.likeCount ?? 0,
  };

  console.log('result : ', result);

  return NextResponse.json({ result, ok: true });
}
