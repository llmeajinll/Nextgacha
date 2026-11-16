import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { productColl, counterColl } from '@/shared/api/mongodb';
import { put } from '@vercel/blob';
import { koreaTime, toKoreaTime } from '@/shared/lib/koreaTime';
import { parseProductForm } from '@/entities/product/lib/parseProductForm';
import { logAdmin } from '@/shared/api/adminLog';

const MAX_IMAGES = 5;

const isImage = (v: FormDataEntryValue): v is File =>
  v instanceof File && v.size > 0 && v.type.startsWith('image/');

// 트랜잭션을 쓰지 않는다: Blob 업로드는 외부 호출이라 롤백이 안 되고,
// 카운터는 번호만 증가시키므로 상품 저장이 실패해 번호가 비어도 무해하다.
// ponytail: 파일을 함수로 받아서 요청 본문 4.5MB(Vercel 한도)를 못 넘음. 더 크게 받으려면 @vercel/blob/client 직접 업로드
export async function POST(req: Request) {
  const formData = await req.formData();
  const session = await auth();

  const numRaw = formData.get('num');
  const isEdit = typeof numRaw === 'string' && numRaw.trim() !== '' && Number.isInteger(Number(numRaw));
  const editNum = isEdit ? Number(numRaw) : null;

  const form = parseProductForm(
    Object.fromEntries([...formData].filter(([, v]) => typeof v === 'string')),
    { minCount: isEdit ? 0 : 1 },
  );

  let keepImages: string[] = [];
  if (isEdit) {
    const keepRaw = formData.get('keepImages');
    if (typeof keepRaw === 'string') {
      try {
        const parsed = JSON.parse(keepRaw);
        if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
          keepImages = parsed;
        }
      } catch {
        return NextResponse.json({ ok: false, message: 'invalid keepImages' }, { status: 400 });
      }
    }
  }

  const rawImages = formData.getAll('image');
  const newImages = rawImages.filter(isImage);
  const detailImages = formData.getAll('detailImage');
  const detailImageSlots = form?.detail.filter((b) => b.type === 'image' && !b.url).length ?? 0;

  const totalImageCount = isEdit ? keepImages.length + newImages.length : rawImages.length;

  if (
    !form ||
    totalImageCount < 1 ||
    totalImageCount > MAX_IMAGES ||
    (isEdit ? false : rawImages.length !== newImages.length) ||
    detailImages.length !== detailImageSlots ||
    !detailImages.every(isImage)
  ) {
    return NextResponse.json({ ok: false, message: 'invalid input' }, { status: 400 });
  }

  const upload = (path: string, file: File) =>
    put(path, file, { access: 'public', contentType: file.type }).then((b) => b.url);

  try {
    const now = koreaTime();

    if (isEdit && editNum) {
      const existing = await productColl.findOne({ num: editNum });
      if (!existing) {
        return NextResponse.json({ ok: false, message: '상품을 찾을 수 없습니다.' }, { status: 404 });
      }

      const timestamp = Date.now();
      const [uploadedUrls, detailUrls] = await Promise.all([
        Promise.all(newImages.map((f, i) => upload(`images/${editNum}_${timestamp}_${i}.png`, f))),
        Promise.all(detailImages.map((f, i) => upload(`images/${editNum}_detail_${timestamp}_${i}.png`, f))),
      ]);

      const finalImages = [...keepImages, ...uploadedUrls];
      let d = 0;
      const detail = form.detail.map((b) =>
        b.type === 'image' ? { type: 'image' as const, url: b.url || detailUrls[d++] } : b,
      );

      await productColl.updateOne(
        { num: editNum },
        {
          $set: {
            title: form.title,
            image: finalImages,
            price: form.price,
            reserve: form.reserve?.ship ?? '',
            reserveStart: form.reserve?.start ?? '',
            reserveEnd: form.reserve?.end ?? '',
            list: form.list,
            company: form.company,
            group: form.group,
            detail,
            updated_at: now,
            discount: form.discount,
            isDiscount: form.discount > 0,
          },
        },
      );

      await logAdmin(session?.user?.email, [
        ...(existing.title !== form.title
          ? [{ action: 'other' as const, target: editNum, before: existing.title, after: form.title }]
          : []),
        ...(existing.price !== form.price
          ? [{ action: 'price' as const, target: editNum, before: existing.price, after: form.price }]
          : []),
        ...((existing.discount ?? 0) !== form.discount
          ? [{ action: 'discount' as const, target: editNum, before: existing.discount ?? 0, after: form.discount }]
          : []),
      ]);

      return NextResponse.json({ ok: true, num: editNum, updated: true }, { status: 200 });
    }

    // 신규 등록: product counter 증가
    const counterDoc = await counterColl.findOneAndUpdate(
      { id: 'num' },
      { $inc: { num: 1 } },
      { returnDocument: 'after', upsert: true },
    );
    const counter = counterDoc?.num;
    if (typeof counter !== 'number') throw new Error('상품 번호 생성 실패');

    // 대표 이미지는 예전 경로 규칙(images/{num}.png) 유지, 나머지는 {num}_{i}.png / {num}_detail_{i}.png
    const [imageUrls, detailUrls] = await Promise.all([
      Promise.all(newImages.map((f, i) => upload(`images/${counter}${i ? `_${i}` : ''}.png`, f))),
      Promise.all(detailImages.map((f, i) => upload(`images/${counter}_detail_${i}.png`, f))),
    ]);

    let d = 0;
    const detail = form.detail.map((b) => (b.type === 'image' ? { type: 'image', url: detailUrls[d++] } : b));

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
    console.error('상품 저장 실패:', err);
    return NextResponse.json(
      { message: '오류가 발생하였습니다.', ok: false },
      { status: 500 },
    );
  }
}
