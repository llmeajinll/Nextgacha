'use client';
import React, { useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Close } from 'pixelarticons/react';
import { useModal } from '@/shared/hooks';
import type { OrderView } from '@/entities/order/model/types';
import { Range } from '@/shared/ui';
import { StarRating } from '@/shared/ui';
import * as styles from '@/shared/ui/alertModal.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  textareaStyle,
  warningText,
  Text,
  fontSizeVar,
  titleLabel,
  contentLabel,
  detailContentLabel,
  overlay,
  headerBar,
  fieldGroup,
} from './reviewModal.css';
import { textareaBox, textareaCount } from '@/styles/ui.css';

// sessionStorage는 이 화면이 떠 있는 동안 바뀌지 않으므로 구독할 것이 없다
const subscribeNothing = () => () => {};

export default function ReviewModal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const [value, setValue] = useState(0);
  const [reviewInput, setreviewInput] = useState('');
  const [show, setShow] = useState(false);
  const [warningSize1, setWarningSize1] = useState(14);
  const [warningSize2, setWarningSize2] = useState(10);
  const { openModal } = useModal();

  // 주문 내역에서 넘겨 둔 주문 정보. 서버 렌더·hydration 첫 렌더에서는 null
  const raw = useSyncExternalStore(
    subscribeNothing,
    () => sessionStorage.getItem('productInfo'),
    () => null,
  );
  const productInfo = useMemo(() => (raw ? (JSON.parse(raw) as OrderView) : null), [raw]);

  return (
    <div className={`modal-overlay ${overlay}`}>
      <div className={styles.backgroundStyle}>
        <div className={styles.modalContainer}>
          <Range
            preset='between'
            width='full'
            height='45'
            className={headerBar}
          >
            <div className={styles.alertText}>REVIEW</div>
            <button
              className={styles.closeBtn}
              aria-label='닫기'
              onClick={() => router.back()}
            >
              <Close width={28} height={28} aria-hidden />
            </button>
          </Range>
          <div className={styles.contentContainer}>
            <h2>상품에 만족스러우셨나요?</h2>
            <Range
              width='full'
              preset='columnAlignCenter'
              className={fieldGroup}
              gap='5'
            >
              <Range
                preset='between'
              >
                <div className={titleLabel}>주문 번호</div>
                <div className={contentLabel}>{productInfo?.orderId}</div>
              </Range>

              <Range
                preset='between'
              >
                <div className={titleLabel}>주문일</div>
                <div className={contentLabel}>{productInfo?.created_at}</div>
              </Range>

              <Range
                preset='between'
              >
                <div className={titleLabel}>주문 상품</div>
                <Range className={contentLabel} gap='5' preset='column'>
                  {productInfo?.list?.map((value, index) => (
                    <div key={value.num}>
                      <div key={value.num + index} className={titleLabel}>
                        {value?.title ?? '상품 정보 없음'}
                      </div>
                      <Range gap='10'>
                        {value.product.map((val) => (
                          <div
                            key={val.name + value.num}
                            className={detailContentLabel}
                          >
                            {val.name} : {val.count}개
                          </div>
                        ))}
                      </Range>
                    </div>
                  ))}
                </Range>
              </Range>
            </Range>
            <Range preset='columnAlignCenter' gap='10'>
              <Range preset='columnAlignCenter'>
                <StarRating value={value} setValue={setValue} size='big' />
                <div
                  className={Text}
                  style={assignInlineVars({
                    [fontSizeVar]: warningSize1 + 'px',
                  })}
                >
                  별점은 필수입니다!
                </div>
              </Range>

              <Range preset='columnAlignCenter'>
                <div className={textareaBox}>
                  <textarea
                    className={textareaStyle}
                    value={reviewInput}
                    onChange={(e) => setreviewInput(e.target.value)}
                    placeholder='10자 이상 적어주세요. (선택)'
                    maxLength={100}
                  ></textarea>
                  <span className={textareaCount}>{reviewInput.length}/100</span>
                </div>
                {show && (
                  <div
                    className={Text}
                    style={assignInlineVars({
                      [fontSizeVar]: warningSize2 + 'px',
                    })}
                  >
                    10자 이상 적어주세요!
                  </div>
                )}
              </Range>
              <button
                className={styles.modalBtn}
                onClick={async () => {
                  if (value === 0) {
                    setWarningSize1((prev) =>
                      prev <= 40 ? (prev += 4) : prev,
                    );
                    return;
                  } else if (
                    reviewInput.length < 10 &&
                    reviewInput.length > 0
                  ) {
                    setShow(true);
                    setWarningSize2((prev) =>
                      prev <= 40 ? (prev += 4) : prev,
                    );
                    return;
                  }
                  const data = {
                    rate: value,
                    orderId: productInfo?.orderId,
                    text: reviewInput,
                    purchaseDate: productInfo?.created_at,
                    list: productInfo?.list,
                  };

                  await fetch('/api/protected/postReview', {
                    method: 'POST',
                    body: JSON.stringify({
                      data,
                    }),
                  })
                    .then(async (res) => {
                      // const result = await res;
                      if (res.ok) {
                        alert('리뷰가 성공적으로 등록되었습니다.');
                        // router.replace(`/mypage/history?page=${page}`);
                        router.back();
                        // router.refresh();
                        // openModal('리뷰가 성공적으로 등록되었습니다.', () => {
                        //   router.back();
                        // });
                      } else {
                        alert('오류가 발생했습니다.');
                        // router.replace(`/mypage/history?page=${page}`);
                        router.back();
                        // router.refresh();
                        // openModal('오류가 발생했습니다.', () => {
                        //   router.back();
                        // });
                      }
                    })
                    .catch((err) => {
                      console.error(err);
                      alert('오류가 발생했습니다.');
                      // router.replace(`/mypage/history?page=${page}`);
                      router.back();
                      // router.refresh();
                    });
                }}
              >
                SUBMIT
              </button>
            </Range>
          </div>
        </div>
      </div>
    </div>
  );
}
