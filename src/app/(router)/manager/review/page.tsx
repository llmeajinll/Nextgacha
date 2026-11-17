import ReviewBoard from '@/features/review-manage/ui/ReviewBoard';
import { findReviewsForAdmin } from '@/features/review-manage/lib/findReviewsForAdmin';
import * as s from '../error/page.css';
import { PageHeader } from '@/shared/ui';

export const dynamic = 'force-dynamic';

export default async function ReviewPage() {
  return (
    <div className={s.container}>
      <PageHeader
        eyebrow='REVIEWS'
        title='리뷰 모아보기'
        description='모든 상품의 리뷰와 별점을 한곳에서 봐요. 낮은 별점이 많은 상품부터 확인할 수 있어요.'
      />
      <ReviewBoard reviews={await findReviewsForAdmin()} />
    </div>
  );
}
