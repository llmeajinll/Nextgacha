import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const MAX_SIZE = 4 * 1024 * 1024;

// 관리자 공지 본문 이미지 올리기 (proxy의 ADMIN_API_PATHS). 올린 주소를 본문 줄로 넣는다
// ponytail: 올리고 공지를 저장하지 않으면 Blob에 남음, 용량이 문제되면 저장 때 쓰인 주소만 남기고 del()
export async function POST(req: Request) {
  const fd = await req.formData().catch(() => null);
  const file = fd?.get('image');
  if (!(file instanceof File) || file.size === 0 || file.size > MAX_SIZE || !file.type.startsWith('image/')) {
    return NextResponse.json({ ok: false, message: '4MB 이하 이미지 파일만 올릴 수 있어요.' }, { status: 400 });
  }
  try {
    const { url } = await put(`notice/${Date.now()}.png`, file, { access: 'public', contentType: file.type });
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error('postNoticeImage failed', e instanceof Error ? e.message : e);
    return NextResponse.json({ ok: false, message: '이미지를 올리지 못했어요.' }, { status: 500 });
  }
}
