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

export type NoticeBlock =
  | { type: 'text'; text: string }
  | { type: 'head'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'image'; url: string };

// 이어진 글 줄은 한 덩어리로, 이미지·'## 소제목'·'> 인용' 줄은 따로
export function toBlocks(content: string): NoticeBlock[] {
  const blocks: NoticeBlock[] = [];
  for (const line of content.split('\n')) {
    const t = line.trim();
    const m = t.match(IMAGE_LINE);
    if (m) blocks.push({ type: 'image', url: m[1] });
    else if (t.startsWith('## ')) blocks.push({ type: 'head', text: t.slice(3) });
    else if (t.startsWith('> ')) blocks.push({ type: 'quote', text: t.slice(2) });
    else {
      const last = blocks.at(-1);
      if (last?.type === 'text') last.text += `\n${line}`;
      else blocks.push({ type: 'text', text: line });
    }
  }
  return blocks
    .map((b) => (b.type === 'text' ? { ...b, text: b.text.replace(/^\n+|\n+$/g, '') } : b))
    .filter((b) => b.type !== 'text' || b.text.trim());
}

// '**굵게**'를 글/굵은 글 조각으로 (홀수 번째 조각이 굵은 글)
export const boldParts = (text: string) => text.split(/\*\*(.+?)\*\*/g).map((t, i) => ({ text: t, bold: i % 2 === 1 })).filter((p) => p.text);

// 'YYYY-MM-DD HH:mm' → 'YYYY.MM.DD' (time이면 시각까지)
export const dotDate = (at: string, time = false) => (time ? at : at.slice(0, 10)).replace(/-/g, '.');

// 상세 아래 이전·다음 공지 한 줄
export type NoticeLink = Pick<Notice, 'num' | 'category' | 'title' | 'publish_at'>;

// 목록의 NEW 표시: 가장 최근 공지로부터 7일 안
export const isNewNotice = (n: Pick<Notice, 'publish_at'>, latest: string) =>
  (Date.parse(latest.slice(0, 10)) - Date.parse(n.publish_at.slice(0, 10))) / 86400000 <= 7;

export const imageLine = (url: string) => `![이미지](${url})`;
