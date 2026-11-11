import { bannerColl } from '@/shared/api/mongodb';
import type { Banner } from '@/entities/banner/model/types';

// 관리자 배너 목록 (노출 순서대로)
export async function findBannersForAdmin(): Promise<Banner[]> {
  const rows = await bannerColl.find({}).sort({ order: 1 }).toArray();
  return rows.map((b) => ({
    id: String(b._id),
    title: String(b.title ?? ''),
    link: String(b.link ?? ''),
    image: String(b.image ?? ''),
    start: String(b.start ?? ''),
    end: String(b.end ?? ''),
    visible: b.visible === true,
    order: Number(b.order) || 0,
  }));
}
