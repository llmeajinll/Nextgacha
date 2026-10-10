import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

export const koreaTime = () =>
  dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

// 날짜는 KST 자정(UTC 15:00)으로 저장됨 → 서버(UTC)/브라우저 어디서 렌더해도 같은 KST 날짜로
export const toKoreaTime = (date: string | Date) => dayjs(date).tz('Asia/Seoul');
