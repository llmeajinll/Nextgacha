import NoticeAdd from '@/features/notice-manage/ui/NoticeAdd';
import { findNoticesForAdmin } from '@/features/notice-manage/lib/findNoticesForAdmin';

export const dynamic = 'force-dynamic';

export default async function NoticeAddPage() {
  const notices = await findNoticesForAdmin();
  return <NoticeAdd pinCount={notices.filter((n) => n.pinned && n.state === 'published').length} />;
}
