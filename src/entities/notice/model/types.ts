// 쇼핑몰 공지. 시각은 KST 'YYYY-MM-DD HH:mm' 문자열
export const NOTICE_CATEGORIES = [
  { key: 'notice', label: '공지', tone: 'info', hint: '일반 안내, 정책 변경' },
  { key: 'ship', label: '배송', tone: 'warning', hint: '배송 일정, 택배사 변경' },
  { key: 'event', label: '이벤트', tone: 'success', hint: '이벤트, 당첨자 발표' },
  { key: 'check', label: '점검', tone: 'danger', hint: '서버·결제 점검' },
] as const;

export type NoticeCategory = (typeof NOTICE_CATEGORIES)[number]['key'];

export const isNoticeCategory = (v: unknown): v is NoticeCategory => NOTICE_CATEGORIES.some((c) => c.key === v);

export const categoryLabel = (k: string) => NOTICE_CATEGORIES.find((c) => c.key === k)?.label ?? '공지';

export type Notice = {
  num: number;
  category: NoticeCategory;
  title: string;
  content: string; // 줄마다 글, '![이미지](url)' 한 줄은 이미지
  list?: string[]; // 예전 공지에 붙어 있던 상품 이름 목록
  pinned: boolean;
  state: 'published' | 'draft';
  publish_at: string;
};

export type NoticeStatus = 'live' | 'soon' | 'draft';

// 게시했어도 올리는 시각 전이면 예약
export const statusOf = (n: Pick<Notice, 'state' | 'publish_at'>, now: string): NoticeStatus =>
  n.state === 'draft' ? 'draft' : n.publish_at > now ? 'soon' : 'live';

export const NOTICE_STATUS_LABEL: Record<NoticeStatus, string> = { live: '게시 중', soon: '예약', draft: '임시 저장' };

export const nowKst = (now = Date.now()) => new Date(now + 9 * 3600000).toISOString().slice(0, 16).replace('T', ' ');

// 본문 이미지는 이 서비스의 Blob 주소만 그린다 (다른 주소는 글자로 보여줌)
const IMAGE_LINE = /^!\[[^\]]*\]\((https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/[^\s)]+)\)$/i;

export type NoticeBlock = { type: 'text'; text: string } | { type: 'image'; url: string };

// 이어진 글 줄은 한 덩어리로, 이미지 줄은 따로
export function toBlocks(content: string): NoticeBlock[] {
  const blocks: NoticeBlock[] = [];
  for (const line of content.split('\n')) {
    const m = line.trim().match(IMAGE_LINE);
    if (m) blocks.push({ type: 'image', url: m[1] });
    else {
      const last = blocks.at(-1);
      if (last?.type === 'text') last.text += `\n${line}`;
      else blocks.push({ type: 'text', text: line });
    }
  }
  return blocks
    .map((b) => (b.type === 'text' ? { ...b, text: b.text.replace(/^\n+|\n+$/g, '') } : b))
    .filter((b) => b.type === 'image' || b.text.trim());
}

export const imageLine = (url: string) => `![이미지](${url})`;
