import { productColl, cartColl } from '@/lib/mongodb';
import { ClientSession } from 'mongodb';

export async function resetCart({
  email,
  list,
  mongodbSession,
}: {
  email: string;
  list: any[];
  mongodbSession: ClientSession;
}) {
  const num = list.filter((val) => val.num).map((val) => val.num);
  try {
    const result = await cartColl.updateOne(
      { user: email }, // 이메일이 일치하는 유저 찾기
      {
        $pull: {
          cart: { num: { $in: num } },
        },
      } as any, // cart 필드를 빈 배열로 설정 (cast to any to satisfy TS typings)
      {
        session: mongodbSession,
      }
    );
    console.log('result : ', result);
    return { ok: true };
  } catch (err) {
    console.log('카드를 초기화하지 못했습니다.');
    return { ok: false };
  }
  // .then((res) => {
  //   // console.log('res : ', res);
  //   return true;
  // })
  // .catch((err) => {
  //   console.log('err: ', err);
  //   return false;
  // });
}
