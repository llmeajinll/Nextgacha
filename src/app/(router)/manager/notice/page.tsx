import NoticeManager from '@/features/notice-manage/ui/NoticeManager';
import { findNoticesForAdmin } from '@/features/notice-manage/lib/findNoticesForAdmin';

// 서버 컴포넌트에서 자기 API를 fetch하면 쿠키가 없어 관리자 API가 403 → DB 직접 조회
export const dynamic = 'force-dynamic';

export default async function NoticePage() {
  return <NoticeManager notices={await findNoticesForAdmin()} />;
}
