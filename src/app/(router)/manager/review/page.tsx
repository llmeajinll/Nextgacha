import ReviewBoard from '@/features/review-manage/ui/ReviewBoard';
import { findReviewsForAdmin } from '@/features/review-manage/lib/findReviewsForAdmin';
import * as s from '../error/page.css';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <span className={s.eyebrow}>REVIEWS</span>
        <h1 className={s.title}>리뷰 모아보기</h1>
        <p className={s.subText}>모든 상품의 리뷰와 별점을 한곳에서 봐요. 낮은 별점이 많은 상품부터 확인할 수 있어요.</p>
      </section>
      <ReviewBoard reviews={await findReviewsForAdmin()} />
    </div>
  );
}
