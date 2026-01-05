'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useModal } from '@/app/hooks';
import { Range } from '@/components/atoms';
import { StarRating } from '@/components/molecules';
import * as styles from './alertModal.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  textareaStyle,
  warningText,
  Text,
  fontSizeVar,
  titleLabel,
  contentLabel,
  detailContentLabel,
} from './reviewModal.css';

export default function ReviewModal() {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [reviewInput, setreviewInput] = useState('');
  const [show, setShow] = useState(false);
  const [warningSize, setWarningSize] = useState(14);
  const [warningSize2, setWarningSize2] = useState(10);
  interface ProductInfo {
    orderId?: string;
    list?: any[];
    [key: string]: any;
  }
  const [productInfo, setProductInfo] = useState<ProductInfo | null>(null);
  const { openModal } = useModal();

  useEffect(() => {
    const getItem = sessionStorage.getItem('productInfo');
    const item = getItem ? (JSON.parse(getItem) as ProductInfo) : null;
    setProductInfo(item);
  }, []);

  console.log(productInfo);

  return (
    <div
      className='modal-overlay'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      <div className={styles.backgroundStyle}>
        <div className={styles.modalContainer}>
          <Range
            preset='between'
            width='full'
            height='45'
            style={{
              backgroundColor: '#75C3FE',
              border: '1px solid #75C3FE',
            }}
          >
            <div className={styles.alertText}>REVIEW</div>
            <button
              className={styles.closeBtn}
              onClick={() => router.back()}
            ></button>
          </Range>
          <div className={styles.contentContainer}>
            <h2>상품에 만족스러우셨나요?</h2>
            <Range
              width='full'
              preset='columnAlignCenter'
              style={{ marginBottom: '10px' }}
              gap='5'
            >
              <Range
                preset='between'
                //   style={{ border: '1px solid red' }}
              >
                <div className={titleLabel}>주문 번호</div>
                <div className={contentLabel}>{productInfo?.orderId}</div>
              </Range>

              <Range
                preset='between'
                //   style={{ border: '1px solid red' }}
              >
                <div className={titleLabel}>주문일</div>
                <div className={contentLabel}>{productInfo?.created_at}</div>
              </Range>

              <Range
                preset='between'
                //   style={{ border: '1px solid red' }}
              >
                <div className={titleLabel}>주문 상품</div>
                <Range className={contentLabel} gap='5' preset='column'>
                  {productInfo?.list?.map((value: any, index: number) => (
                    <div key={value.num}>
                      <div key={value.num + index} className={titleLabel}>
                        {value?.title ?? '상품 정보 없음'}
                      </div>
                      <Range gap='10'>
                        {value.product.map((val: any) => (
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
                    [fontSizeVar]: warningSize + 'px',
                  })}
                >
                  별점은 필수입니다!
                </div>
              </Range>

              <Range preset='columnAlignCenter'>
                <textarea
                  className={textareaStyle}
                  value={reviewInput}
                  onChange={(e) => setreviewInput(e.target.value)}
                  placeholder='10자 이상 적어주세요. (선택)'
                  maxLength={100}
                ></textarea>
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
                    setWarningSize((prev) => (prev <= 40 ? prev : (prev += 4)));
                    return;
                  } else if (
                    reviewInput.length < 10 &&
                    reviewInput.length > 0
                  ) {
                    setShow(true);
                    setWarningSize2((prev) =>
                      prev >= 40 ? prev : (prev += 4)
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
                  console.log(data);

                  await fetch('/api/protected/postReview', {
                    method: 'POST',
                    body: JSON.stringify({
                      data,
                    }),
                  })
                    .then(async (res) => {
                      const result = await res;
                      if (result.ok) {
                        alert('리뷰가 성공적으로 등록되었습니다.');
                        router.back();
                        // openModal('리뷰가 성공적으로 등록되었습니다.', () => {
                        //   router.back();
                        // });
                      } else {
                        alert('오류가 발생했습니다.');
                        router.back();
                        // openModal('오류가 발생했습니다.', () => {
                        //   router.back();
                        // });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      alert('오류가 발생했습니다.');
                      router.back();
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
