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

  // const userInfoCookie = (await cookieStore).get('userInfo');
  // let likeList: number[] = [];

  // if (userInfoCookie) {
  //   try {
  //     const parsed = JSON.parse(userInfoCookie.value);
  //     likeList = parsed.like || [];
  //   } catch (e) {
  //     likeList = [];
  //   }
  // }

  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag');
  const count = searchParams.get('count');
  const num = Number(searchParams.get('num'));

  // console.log('mongodb params', Number(search), tag, search);

  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

  let query = {};
  if (tag === 'all') {
    query = {};
  } else if (tag === 'new') {
    // console.log(fourMonthsAgo);
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
  // if (!session?.user?.email) {
  // return NextResponse.json({ error: 'User not login' }, { status: 401 });
  // console.log(session?.user?.email);
  // }

  const isLogin = email ? true : false;
  console.log('isLogin : ', isLogin, email);

  // return NextResponse.json(user?.like || []);

  const product = await func.toArray();

  if (isLogin === true) {
    const user = await userColl.findOne(
      { email: session?.user?.email },
      { projection: { like: 1, _id: 0 } }
    );

    console.log('========== like:', user?.like);

    const result = product.map((item) => {
      const isLike = (user?.like || [])?.includes(item.num);
      return {
        ...item,
        like: isLike,
      };
    });

    // console.log('[server] if result : ', result);

    return NextResponse.json(result);
  } else {
    const result = product.map((item) => {
      return {
        ...item,
        like: false,
      };
    });

    // console.log('[server] else result : ', result);

    return NextResponse.json(result);
  }
}
