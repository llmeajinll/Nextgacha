import { auth } from '@/auth';
import { Banner } from '@/widgets';
import { cardTemplateContainer } from '@/widgets/CardTemplate/cardtemplate.css';
import { findProducts } from '@/entities/product/lib/findProducts';
import { Btn, Title, Range } from '@/shared/ui';
import { Card } from '@/entities/product/ui';
import { section, sectionTitle } from './homePage.css';

const sections = [
  { tag: 'hot', title: '인기 상품' },
  { tag: 'new', title: '신규 상품' },
  { tag: 'reserve', title: '예약 판매' },
];

// 서버에서 상품을 바로 렌더 → 클라이언트 fetch 3회 직렬 대기(LCP 지연·CLS) 제거
export default async function HomePage() {
  const email = (await auth())?.user?.email;
  const results = await Promise.all(
    sections.map(({ tag }) => findProducts({ tag, count: 8, email })),
  );

  return (
    <>
      <Banner />

      {sections.map(({ tag, title }, i) => (
        <div className={section} key={tag}>
          <Title text={title} className={sectionTitle} />
          <Range className={cardTemplateContainer}>
            {results[i].data.map((val) => (
              <Card props={val} key={val._id} />
            ))}
          </Range>
          <Btn type='more' href='search' query={{ type: 'main', tag: title }} />
        </div>
      ))}
    </>
  );
}
