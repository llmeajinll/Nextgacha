import { noticeColl } from '@/shared/api/mongodb';
import { nowKst, type Notice, type NoticeLink } from '../model/types';

const PROJECT = { _id: 0, num: 1, category: 1, title: 1, content: 1, list: 1, pinned: 1, state: 1, publish_at: 1 };

const liveFilter = () => ({ state: 'published', publish_at: { $lte: nowKst() } });

const LINK = { _id: 0, num: 1, category: 1, title: 1, publish_at: 1 };

const clean = (n: Record<string, unknown>) => JSON.parse(JSON.stringify(n)) as Notice;

const link = (n?: Record<string, unknown>): NoticeLink | undefined => n && clean(n);

// 쇼핑몰 공지 목록: 게시 중인 공지만, 고정 공지 먼저 → 최근 게시 순
export async function findLiveNotices(): Promise<Notice[]> {
  const rows = await noticeColl.find(liveFilter(), { projection: PROJECT }).sort({ pinned: -1, publish_at: -1, num: -1 }).toArray();
  return rows.map(clean);
}

// 공지 상세 + 이전(더 오래된)·다음(더 최근) 공지. 게시 중이 아니면 null
export async function findLiveNotice(num: number) {
  const notice = await noticeColl.findOne({ ...liveFilter(), num }, { projection: PROJECT });
  if (!notice) return null;
  const at = String(notice.publish_at);
  const [older, newer] = await Promise.all([
    noticeColl.find({ ...liveFilter(), publish_at: { $lt: at } }, { projection: LINK }).sort({ publish_at: -1 }).limit(1).toArray(),
    noticeColl.find({ state: 'published', publish_at: { $gt: at, $lte: nowKst() } }, { projection: LINK }).sort({ publish_at: 1 }).limit(1).toArray(),
  ]);
  return { notice: clean(notice), prev: link(older[0]), next: link(newer[0]) };
}
