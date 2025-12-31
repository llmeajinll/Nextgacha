import { productColl, cartColl } from '@/lib/mongodb';
import { ClientSession } from 'mongodb';

export async function resetCart({
  email,
  mongodbSession,
}: {
  email: string;
  mongodbSession: ClientSession;
}) {
  try {
    const result = await cartColl.updateOne(
      { user: email }, // 이메일이 일치하는 유저 찾기
      { $set: { cart: [] } }, // cart 필드를 빈 배열로 설정
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
