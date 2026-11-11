import BannerManager from '@/features/banner-manage/ui/BannerManager';
import { findBannersForAdmin } from '@/features/banner-manage/lib/findBannersForAdmin';

// 서버 컴포넌트에서 자기 API를 fetch하면 쿠키가 없어 관리자 API가 403 → DB 직접 조회
export const dynamic = 'force-dynamic';

export default async function BannerPage() {
  return <BannerManager banners={await findBannersForAdmin()} />;
}
