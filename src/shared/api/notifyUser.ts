import type { ClientSession } from 'mongodb';
import { notificationColl } from './mongodb';

// 사이트 안 알림을 남긴다 (헤더 종 아이콘). 알림톡 대행사 계약 전까지 구매자 알림은 이 방법만 쓴다
// session을 주면 그 트랜잭션에 포함되고, 실패하면 throw한다
export async function notifyUser(emails: string | string[], message: string, link: string, session?: ClientSession) {
  const list = [...new Set(Array.isArray(emails) ? emails : [emails])];
  if (list.length === 0) return;
  const createdAt = new Date();
  await notificationColl.insertMany(
    list.map((email) => ({ email, message, link, read: false, createdAt })),
    { session },
  );
}
