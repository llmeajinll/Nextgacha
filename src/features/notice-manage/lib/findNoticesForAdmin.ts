import { noticeColl } from '@/shared/api/mongodb';
import type { Notice } from '@/entities/notice/model/types';

// 관리자 공지 목록: 고정 먼저, 그다음 최근 게시(예약 포함) 순
export async function findNoticesForAdmin(): Promise<Notice[]> {
  const rows = await noticeColl
    .find({}, { projection: { _id: 0, num: 1, category: 1, title: 1, content: 1, list: 1, pinned: 1, state: 1, publish_at: 1 } })
    .sort({ pinned: -1, publish_at: -1, num: -1 })
    .toArray();
  return JSON.parse(JSON.stringify(rows));
}
