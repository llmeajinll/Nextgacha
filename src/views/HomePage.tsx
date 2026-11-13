import Link from 'next/link';
import { ChevronRight } from 'pixelarticons/react';
import { auth } from '@/auth';
import { Banner } from '@/widgets';
import { findProducts } from '@/entities/product/lib/findProducts';
import { findActiveBanners } from '@/entities/banner/lib/findActiveBanners';
import { Card } from '@/entities/product/ui';
import * as s from './homePage.css';

const sections = [
  { tag: 'hot', en: 'HOT', title: '인기 상품' },
  { tag: 'new', en: 'NEW', title: '신규 상품' },
  { tag: 'reserve', en: 'RESERVE', title: '예약 판매' },
] as const;

const more = (title: string) => `/search?type=main&tag=${title}&page=1`;

// 디자인 캔버스 ShopHome / ShopHomeMobile. 서버에서 상품을 바로 렌더 → 클라이언트 fetch 직렬 대기(LCP 지연·CLS) 없음
export default async function HomePage() {
  const email = (await auth())?.user?.email;
  const [banners, ...results] = await Promise.all([
    findActiveBanners(),
    ...sections.map(({ tag }) => findProducts({ tag, count: 4, email })),
  ]);

  return (
    <div className={s.page}>
      <Banner banners={banners} />

      {sections.map(({ tag, en, title }, i) => (
        <section key={tag} aria-labelledby={`home-${tag}`} className={s.section}>
          <header className={s.head}>
            <div className={s.headText}>
              <h2 id={`home-${tag}`} className={s.title}>
                {title}
              </h2>
              <span className={`${s.badge} ${s.badgeTone[tag]}`}>{en}</span>
            </div>
            <Link href={more(title)} className={s.moreLink} aria-label={`${title} 더보기`}>
              더보기
              <ChevronRight width={14} height={14} aria-hidden />
            </Link>
          </header>
          <div className={s.grid}>
            {results[i].data.map((val) => (
              <Card props={val} key={val._id} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
