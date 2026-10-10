import { NextResponse } from 'next/server';
import { productColl, userColl } from '@/shared/api/mongodb';
import { auth } from '@/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const session = await auth();
  const email = session?.user?.email;
  const isLogin = email ? true : false;

  const search = searchParams.get('search')?.trim() ?? '';
  const tag = searchParams.get('tag');
  // 한 번에 가져올 수 있는 개수 상한 (count=999999로 전체 덤프 방지)
  const count = Math.min(Math.max(Number(searchParams.get('count')) || 20, 1), 100);
  const page = Math.max(Number(searchParams.get('page')) || 1, 1);
  const filter = searchParams.get('filter');

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  let query: Record<string, any> = {};

  // 사용자 입력을 정규식 리터럴로 (특수문자로 인한 500 / ReDoS 방지)
  const escapeRegex = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  if (tag === 'new') {
    query = { create: { $gte: twoMonthsAgo } };
  } else if (tag === 'reserve') {
    query = { reserve: { $exists: true, $ne: '' } };
  }
  // all / hot은 전체 조회 (hot 정렬 기준은 아직 없음)

  if (search) {
    const keyword = { $regex: escapeRegex(search), $options: 'i' };
    query.$or = [
      { title: keyword },
      { company: keyword },
      { group: keyword },
      { 'list.name': keyword },
      // 숫자로 검색하면 상품 번호도 매칭
      ...(/^\d+$/.test(search) ? [{ num: Number(search) }] : []),
    ];
  }

  if (filter) {
    query['list.name'] = { $regex: escapeRegex(filter), $options: 'i' };
  }

  let func = productColl
    .find(query)
    .skip((page - 1) * count)
    .sort({ create: -1 });

  if (count) {
    func = func.limit(count);
  }
  const product = await func.toArray();
  const total = await productColl.countDocuments(query);

  // console.log('product : ', product);
  // console.log('length : ', product.length);

  let data = null;

  if (isLogin === true) {
    const user = await userColl.findOne(
      { email: session?.user?.email },
      { projection: { like: 1, _id: 0 } },
    );

    // console.log('========== like:', user?.like);

    data = product.map((item) => {
      const isLike = (user?.like || [])?.includes(item.num);
      return {
        ...item,
        like: isLike,
      };
    });

    // console.log('[server] if result : ', result);
  } else {
    data = product.map((item) => {
      return {
        ...item,
        like: false,
      };
    });

    // console.log('[server] else result : ', result);
  }
  const result = { data, total };

  // console.log('result : ', result);

  return NextResponse.json(result);
}
