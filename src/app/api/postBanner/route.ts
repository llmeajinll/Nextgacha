import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { put } from '@vercel/blob';
import { bannerColl } from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import { parseBannerForm } from '@/features/banner-manage/lib/parseBannerForm';

const MAX_SIZE = 4 * 1024 * 1024;

// 관리자 배너 저장 (proxy의 ADMIN_API_PATHS). id가 없으면 새 배너(이미지 필수), 있으면 수정(이미지는 바꿀 때만)
// 트랜잭션 안 씀: Blob 업로드는 외부 호출이고 문서 하나만 쓴다
// ponytail: 바꾼 뒤 예전 이미지는 Blob에 남음, 용량이 문제되면 del()로 정리
export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null);
  if (!fd) return NextResponse.json({ ok: false, message: 'invalid input' }, { status: 400 });

  const form = parseBannerForm(Object.fromEntries([...fd].filter(([, v]) => typeof v === 'string')));
  const id = fd.get('id');
  const file = fd.get('image');
  const hasFile = file instanceof File && file.size > 0;
  const isNew = id === null || id === '';

  if (
    !form ||
    (!isNew && (typeof id !== 'string' || !ObjectId.isValid(id))) ||
    (isNew && !hasFile) ||
    (hasFile && (!file.type.startsWith('image/') || file.size > MAX_SIZE))
  ) {
    return NextResponse.json({ ok: false, message: '입력값을 확인해 주세요.' }, { status: 400 });
  }

  try {
    const image = hasFile
      ? (await put(`banners/${Date.now()}.png`, file, { access: 'public', contentType: file.type })).url
      : undefined;
    const now = koreaTime();

    if (isNew) {
      const [last] = await bannerColl.find({}, { projection: { order: 1 } }).sort({ order: -1 }).limit(1).toArray();
      await bannerColl.insertOne({ ...form, image, order: (Number(last?.order) || 0) + 1, created_at: now, updated_at: now });
    } else {
      const res = await bannerColl.updateOne(
        { _id: new ObjectId(id as string) },
        { $set: { ...form, ...(image && { image }), updated_at: now } },
      );
      if (res.matchedCount !== 1) return NextResponse.json({ ok: false, message: '배너를 찾을 수 없어요.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('postBanner failed', e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, message: '배너를 저장하지 못했어요.' }, { status: 500 });
  }
}
