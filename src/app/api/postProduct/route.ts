import { NextResponse } from 'next/server';
import { productColl, counterColl } from '@/shared/api/mongodb';
import { put } from '@vercel/blob';
import { koreaTime, toKoreaTime } from '@/shared/lib/koreaTime';
import { parseProductForm } from '@/entities/product/lib/parseProductForm';

const MAX_IMAGES = 5;

const isImage = (v: FormDataEntryValue): v is File =>
  v instanceof File && v.size > 0 && v.type.startsWith('image/');

// 트랜잭션을 쓰지 않는다: Blob 업로드는 외부 호출이라 롤백이 안 되고,
// 카운터는 번호만 증가시키므로 상품 저장이 실패해 번호가 비어도 무해하다.
// ponytail: 파일을 함수로 받아서 요청 본문 4.5MB(Vercel 한도)를 못 넘음. 더 크게 받으려면 @vercel/blob/client 직접 업로드
export async function POST(req: Request) {
  const formData = await req.formData();

  const form = parseProductForm(
    Object.fromEntries([...formData].filter(([, v]) => typeof v === 'string')),
  );
  const images = formData.getAll('image');
  const detailImages = formData.getAll('detailImage');
  const detailImageSlots = form?.detail.filter((b) => b.type === 'image').length;

  if (
    !form ||
    images.length < 1 ||
    images.length > MAX_IMAGES ||
    !images.every(isImage) ||
    detailImages.length !== detailImageSlots ||
    !detailImages.every(isImage)
  ) {
    return NextResponse.json({ ok: false, message: 'invalid input' }, { status: 400 });
  }

  try {
    // product counter 증가
    const counterDoc = await counterColl.findOneAndUpdate(
      { id: 'num' },
      { $inc: { num: 1 } },
      { returnDocument: 'after', upsert: true },
    );
    const counter = counterDoc?.num;
    if (typeof counter !== 'number') throw new Error('상품 번호 생성 실패');

    // 대표 이미지는 예전 경로 규칙(images/{num}.png) 유지, 나머지는 {num}_{i}.png / {num}_detail_{i}.png
    const upload = (path: string, file: File) =>
      put(path, file, { access: 'public', contentType: file.type }).then((b) => b.url);
    const [imageUrls, detailUrls] = await Promise.all([
      Promise.all(images.map((f, i) => upload(`images/${counter}${i ? `_${i}` : ''}.png`, f))),
      Promise.all(detailImages.map((f, i) => upload(`images/${counter}_detail_${i}.png`, f))),
    ]);

    let d = 0;
    const detail = form.detail.map((b) => (b.type === 'image' ? { type: 'image', url: detailUrls[d++] } : b));

    const now = koreaTime();
    await productColl.insertOne({
      title: form.title,
      image: imageUrls,
      price: form.price,
      // 예약 상품이 아니면 등록일(KST 자정)을 출시일로 → NEW 태그
      create: form.reserve ? '' : toKoreaTime(new Date()).startOf('day').toDate(),
      reserve: form.reserve?.ship ?? '',
      reserveStart: form.reserve?.start ?? '',
      reserveEnd: form.reserve?.end ?? '',
      list: form.list,
      company: form.company,
      group: form.group,
      detail,
      created_at: now,
      updated_at: now,
      num: counter,
      discount: form.discount,
      isDiscount: form.discount > 0,
    });

    return NextResponse.json({ ok: true, num: counter }, { status: 201 });
  } catch (err) {
    console.error('상품 등록 실패:', err);
    return NextResponse.json(
      { message: '오류가 발생하였습니다.', ok: false },
      { status: 500 },
    );
  }
}
