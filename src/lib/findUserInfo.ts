import { userColl } from '@/lib/mongodb';
import dayjs from 'dayjs';
import { ClientSession } from 'mongodb';

export async function findUserInfo({
  email,
  // info,
  mongodbSession,
}: {
  email: string;
  // info: string;
  mongodbSession: ClientSession;
}) {
  try {
    const user = await userColl.findOne({ email }, { session: mongodbSession });
    // console.log('user : ', user?.address);
    const address = user?.address;

    return { ok: true, address };
  } catch (error) {
    console.error('Error finding user info:', error);
    return { ok: false, error: (error as Error).message };
  }
}
