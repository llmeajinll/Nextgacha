import { userColl, cartColl } from '@/lib/mongodb';
import { ClientSession } from 'mongodb';

export async function reducePoint({
  usedPoint,
  email,
  mongodbSession,
}: {
  usedPoint: number;
  email: string;
  mongodbSession: ClientSession;
}) {
  console.log('reducePoint usedPoint, email : ', usedPoint, email);

  try {
    const result = await userColl.updateOne(
      { email },
      { $inc: { point: -usedPoint } },
      { session: mongodbSession }
    );
    console.log('result : ', result);
    return { ok: true };
  } catch (err) {
    console.log(err);
    return { ok: false };
  }
}
