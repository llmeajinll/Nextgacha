// 쇼핑몰 메인 상단 배너. 날짜는 KST 'YYYY-MM-DD', end가 ''이면 종료일 없이 계속 게시
export type Banner = {
  id: string;
  title: string; // 관리용 이름 (쇼핑몰에는 안 보임)
  link: string; // 눌렀을 때 이동할 쇼핑몰 안 경로, ''이면 이동 안 함
  image: string;
  start: string;
  end: string;
  visible: boolean;
  order: number; // 작을수록 앞
};

export type BannerStatus = 'live' | 'soon' | 'hidden' | 'ended';

// 숨김이 기간보다 먼저: 끄면 기간 안이어도 안 보인다
export const statusOf = (b: Pick<Banner, 'visible' | 'start' | 'end'>, today: string): BannerStatus =>
  !b.visible ? 'hidden' : b.end && b.end < today ? 'ended' : b.start > today ? 'soon' : 'live';

export const BANNER_STATUS_LABEL: Record<BannerStatus, string> = {
  live: '게시 중',
  soon: '예약',
  hidden: '숨김',
  ended: '종료',
};

// 서버(UTC)·브라우저 어디서든 같은 KST 날짜
export const todayKst = (now = Date.now()) => new Date(now + 9 * 3600000).toISOString().slice(0, 10);
