import { NextResponse } from 'next/server';
import { productColl, counterColl } from '@/shared/api/mongodb';
import { put } from '@vercel/blob';
import { koreaTime } from '@/shared/lib/koreaTime';

// 트랜잭션을 쓰지 않는다: Blob 업로드는 외부 호출이라 롤백이 안 되고,
// 카운터는 번호만 증가시키므로 상품 저장이 실패해 번호가 비어도 무해하다.
export async function POST(req: Request) {
  const formData = await req.formData();

  const title = formData.get('title') as string;
  const price = Number(formData.get('price'));
  const company = formData.get('company') as string;
  const group = JSON.parse(formData.get('group') as string);
  const list = JSON.parse(formData.get('list') as string);
  const create = formData.get('create')
    ? new Date(formData.get('create') as string)
    : '';
  const reserve = formData.get('reserve')
    ? new Date(formData.get('reserve') as string)
    : '';
  const img = formData.get('image');

  try {
    // product counter 증가
    const counterDoc = await counterColl.findOneAndUpdate(
      { id: 'num' },
      { $inc: { num: 1 } },
      { returnDocument: 'after', upsert: true },
    );
    const counter = counterDoc?.num;
    if (typeof counter !== 'number') throw new Error('상품 번호 생성 실패');

    // 이미지가 있으면 blob storage에 추가 (경로 규칙: images/{num}.png — UI가 이 규칙으로 직접 참조)
    if (img instanceof File && img.size > 0) {
      await put(`images/${counter}.png`, img, { access: 'public' });
    }

    const now = koreaTime();
    await productColl.insertOne({
      title,
      image: [`${process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL}${counter}.png`],
      price,
      create,
      reserve,
      list,
      company,
      group,
      created_at: now,
      updated_at: now,
      num: counter,
      discount: 0,
      isDiscount: false,
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error('상품 등록 실패:', err);
    return NextResponse.json(
      { message: '오류가 발생하였습니다.', ok: false },
      { status: 500 },
    );
  }
}
