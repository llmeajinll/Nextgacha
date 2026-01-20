import { NextResponse } from 'next/server';
import { productColl, userColl } from '@/lib/mongodb';
import { auth } from '@/auth';

export async function GET(req: Request) {
  // const { data } = await req.json();
  // console.log(data);
  // const cookieStore = cookies();
  const { searchParams } = new URL(req.url);
  const session = await auth();
  const email = session?.user?.email;
  const isLogin = email ? true : false;

  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag');
  const count = Number(searchParams.get('count') || 20);
  const page = Number(searchParams.get('page'));

  console.log('mongodb params', Number(search), tag, search, page);

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  let query = {};

  function buildSearchQuery(search: string) {
    if (!search || !search.trim()) return {};

    const keyword = search.trim();

    return {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { group: { $regex: keyword, $options: 'i' } },
        { 'list.name': { $regex: keyword, $options: 'i' } },
      ],
    };
  }
  if (tag === 'all') {
    query = {};
  } else if (tag === 'new') {
    // console.log(fourMonthsAgo);
    query = { create: { $gte: twoMonthsAgo } };
  } else if (tag === 'hot') {
    query = {};
  } else if (tag === 'reserve') {
    query = { reserve: { $exists: true, $ne: '' } };
  } else if (!isNaN(Number(search))) {
    query = { num: Number(search) };
  }

  if (search && search.trim()) {
    query = {
      ...query,
      ...buildSearchQuery(search),
    };
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
  console.log('product : ', product);

  let data = null;

  if (isLogin === true) {
    const user = await userColl.findOne(
      { email: session?.user?.email },
      { projection: { like: 1, _id: 0 } }
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

  return NextResponse.json(result);
}
