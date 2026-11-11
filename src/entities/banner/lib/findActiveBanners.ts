import { bannerColl } from '@/shared/api/mongodb';
import { todayKst } from '../model/types';

// 쇼핑몰 메인에 지금 보일 배너 (보이기 켜짐 + 게시 기간 안), 노출 순서대로
export async function findActiveBanners(): Promise<{ image: string; link: string }[]> {
  const today = todayKst();
  const rows = await bannerColl
    .find(
      { visible: true, start: { $lte: today }, $or: [{ end: '' }, { end: { $gte: today } }] },
      { projection: { _id: 0, image: 1, link: 1 } },
    )
    .sort({ order: 1 })
    .toArray();
  return rows.map((b) => ({ image: String(b.image), link: String(b.link ?? '') }));
}
