import Image from 'next/image';
import { findProductDetail } from '@/entities/product/lib/findProductDetail';
import { detailText, detailImage } from './page.css';

export default async function InfoTab({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const detail = await findProductDetail(code);

  return (
    <div>
      {detail.length > 0 ? (
        detail.map((b, i) =>
          b.type === 'text' ? (
            <p key={i} className={detailText}>
              {b.text}
            </p>
          ) : (
            <Image key={i} src={b.url} alt='' width={958} height={958} sizes='958px' className={detailImage} />
          ),
        )
      ) : (
        // 상세 블록이 없던 예전 상품은 수동 업로드한 {num}_info.png
        <Image
          src={`${process.env.NEXT_PUBLIC_VERCEL_IMAGE_URL}${code}_info.png`}
          alt='Info image'
          width={958}
          height={960}
        />
      )}
      <div>한 캐릭터 당 최대 5개까지 장바구니에 담을 수 있습니다.</div>
    </div>
  );
}
