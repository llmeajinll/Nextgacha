'use client';

import { useModal } from '@/shared/hooks';
import deleteReview from '../api/deleteReview';
import { deleteBtn } from './deleteReviewBtn.css';

// 본인 리뷰에만 보여준다. 지우면 같은 주문으로 다시 쓸 수 없다
export default function DeleteReviewBtn({ num, orderId, onDeleted }: { num: number; orderId: string; onDeleted: () => void }) {
  const { openModal } = useModal();

  const run = async () => {
    try {
      await deleteReview(num, orderId);
      onDeleted();
    } catch (e) {
      openModal(e instanceof Error ? e.message : '리뷰를 삭제하지 못했습니다.');
    }
  };

  return (
    <button
      type='button'
      className={deleteBtn}
      onClick={() =>
        openModal('리뷰를 삭제할까요? 삭제하면 이 주문으로 다시 리뷰를 쓸 수 없습니다.', {
          onClickCheck: run,
          onClickCancel: () => {},
        })
      }
    >
      삭제
    </button>
  );
}
