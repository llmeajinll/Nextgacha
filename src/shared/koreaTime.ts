import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);

export const koreaTime = dayjs().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
