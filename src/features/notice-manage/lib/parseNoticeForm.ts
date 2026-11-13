// plain Node 테스트에서도 풀리게 상대 경로 + .ts
import { isNoticeCategory, type NoticeCategory } from '../../../entities/notice/model/types.ts';

// 공지 저장 폼 검증 (route와 화면이 같은 규칙을 쓴다)
export type NoticeForm = {
  category: NoticeCategory;
  title: string;
  content: string;
  pinned: boolean;
  state: 'published' | 'draft';
  publish_at: string; // '' = 지금 올리기, 'YYYY-MM-DD HH:mm' = 예약
};

export const TITLE_MAX = 60;
export const CONTENT_MAX = 2000;
export const PIN_MAX = 3;

const isAt = (v: string) => /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(v) && !Number.isNaN(Date.parse(v.replace(' ', 'T')));

// 이미지 줄을 뺀 글이 있는지 (게시하려면 글이 한 줄은 있어야 함)
export const hasText = (content: string) => content.replace(/!\[[^\]]*\]\([^)]+\)/g, '').trim().length > 0;

export function parseNoticeForm(b: Record<string, unknown>): NoticeForm | null {
  const { category, title, content, pinned, state, publish_at } = b;
  if (!isNoticeCategory(category) || typeof title !== 'string' || typeof content !== 'string') return null;
  if (typeof pinned !== 'boolean' || (state !== 'published' && state !== 'draft') || typeof publish_at !== 'string') return null;
  const t = title.trim();
  if (!t || t.length > TITLE_MAX || content.length > CONTENT_MAX) return null;
  if (state === 'published' && !hasText(content)) return null;
  if (publish_at && !isAt(publish_at)) return null;
  // 임시 저장은 고정하지 않는다 (쇼핑몰에 안 보이는데 고정 3개 자리를 차지하지 않게)
  return { category, title: t, content: content.replace(/\s+$/, ''), pinned: state === 'draft' ? false : pinned, state, publish_at };
}
