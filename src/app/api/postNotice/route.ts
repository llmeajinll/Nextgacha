import { NextResponse } from 'next/server';
import { counterColl, noticeColl } from '@/shared/api/mongodb';
import { koreaTime } from '@/shared/lib/koreaTime';
import { nowKst } from '@/entities/notice/model/types';
import { parseNoticeForm, PIN_MAX } from '@/features/notice-manage/lib/parseNoticeForm';

// 관리자 공지 저장 (proxy의 ADMIN_API_PATHS). num이 없으면 새 공지, 있으면 수정
// publish_at이 ''이면 지금 올리기(수정이면 원래 게시 시각 유지), 시각이면 예약
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const form = parseNoticeForm(body);
  const num = body?.num;
  const isNew = num === undefined || num === null;
  if (!form || (!isNew && !Number.isInteger(num))) {
    return NextResponse.json({ ok: false, message: '입력값을 확인해 주세요.' }, { status: 400 });
  }
  const now = nowKst();
  if (form.publish_at && form.publish_at <= now && form.state === 'published') {
    // 예약은 지금 이후로만. 지금 올리려면 publish_at을 비워서 보냄
    const prev = isNew ? null : await noticeColl.findOne({ num }, { projection: { publish_at: 1 } });
    if (prev?.publish_at !== form.publish_at) {
      return NextResponse.json({ ok: false, message: '예약은 지금 이후 시각으로 골라 주세요.' }, { status: 400 });
    }
  }

  try {
    if (form.pinned) {
      const others = await noticeColl.countDocuments({ pinned: true, state: 'published', ...(!isNew && { num: { $ne: num } }) });
      if (others >= PIN_MAX) {
        return NextResponse.json({ ok: false, message: `고정은 ${PIN_MAX}개까지예요. 다른 공지의 고정을 먼저 풀어 주세요.` }, { status: 409 });
      }
    }
    const stamp = koreaTime();

    if (isNew) {
      // 번호만 증가시키는 카운터라 저장이 실패해 번호가 비어도 무해 → 트랜잭션 불필요
      const counter = await counterColl.findOneAndUpdate({ id: 'notice' }, { $inc: { num: 1 } }, { upsert: true, returnDocument: 'after' });
      const next = counter?.num;
      if (typeof next !== 'number') throw new Error('공지 번호 생성 실패');
      await noticeColl.insertOne({ ...form, num: next, publish_at: form.publish_at || now, created_at: stamp, updated_at: stamp });
      return NextResponse.json({ ok: true, num: next });
    }

    const { publish_at, ...rest } = form;
    const prev = await noticeColl.findOne({ num }, { projection: { state: 1, publish_at: 1 } });
    if (!prev) return NextResponse.json({ ok: false, message: '공지를 찾을 수 없어요.' }, { status: 404 });
    // 지금 올리기: 임시 저장·예약이던 공지는 지금 시각으로, 이미 게시 중이면 원래 시각 유지
    const keep = prev.state === 'published' && String(prev.publish_at) <= now;
    const at = publish_at || (keep ? String(prev.publish_at) : now);
    await noticeColl.updateOne({ num }, { $set: { ...rest, publish_at: at, updated_at: stamp } });
    return NextResponse.json({ ok: true, num });
  } catch (e) {
    console.error('postNotice failed', e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, message: '공지를 저장하지 못했어요.' }, { status: 500 });
  }
}
