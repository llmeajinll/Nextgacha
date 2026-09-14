'use client';

import React, { useState } from 'react';
import { Btn } from '@/shared/ui';
import { useCallback } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { v4 as uuidv4 } from 'uuid';
import { useAtom, useAtomValue } from 'jotai';
import { userInfoAtom } from '@/entities/user/model/store';
import { useModal } from '@/shared/hooks';
import { transform } from 'next/dist/build/swc/generated-native';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { queryClientAtom } from 'jotai-tanstack-query';
import useSplitRoute from '@/shared/hooks/useSplitRoute';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import {
  btnWidthVar,
  wrapper,
  dynamicWidthBtn,
  tooltipWrap,
  centerFit,
  tooltipBox,
  warningTitle,
  noAddressText,
  searchLink,
  detailAddressWrap,
  detailAddressInput,
  updateBtn,
} from './buyBtn.css';

interface BuyBtnType {
  // email: string;
  price: number;
  size?: 'big' | 'medium';
  list: { num: number | null; product: { name: string; count: number }[] }[];
  usedPoint: number;
  addPoint: number;
}

export default function BuyBtn({
  props,
  width,
}: {
  props: BuyBtnType;
  width?: number;
}) {
  console.log('buyBtn list : ', props);
  const queryClient = useAtomValue(queryClientAtom);

  const [isHover, setIsHover] = useState(false);
  const [detailAddress, setDetailAddress] = useState('');

  const [{ data, isPending, isError }] = useAtom(userInfoAtom);
  const { firstRoute } = useSplitRoute();
  const { openModal } = useModal();

  const refetchUser = () => {
    return () => {
      queryClient.invalidateQueries({
        queryKey: ['userInfo'],
      });
    };
  };

  const scriptUrl =
    'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(scriptUrl);

  const handleComplete = async (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '')
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    console.log(fullAddress); // 주소 결과 처리
    await fetch('/api/updateAddress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        address: fullAddress,
      }),
    });

    queryClient.invalidateQueries({ queryKey: ['userInfo'] });
  };

  const handleClick = () => {
    open({
      onComplete: handleComplete,
      width: 500,
      height: 600,
      top: 300, // 화면 상단에서의 거리
      left: 500, // 화면 왼쪽에서의 거리
      popupTitle: '배송지 주소 찾기', // 팝업창 타이틀
    });
  };

  const onClickPayment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    console.log('buyBtn userInfo : ', props?.list);

    if (data === undefined) {
      alert('로그인 후 구매할 수 있습니다.');
      return;
    }

    if (props.price === 0) {
      console.log('list no');
      alert('담은 제품이 없습니다.');
      return;
    }

    props.list.map((val) => {
      if (val.num === null) {
        alert('빈값이 들어있습니다.');
      }
      return;
    });

    if (data?.address === '') {
      alert('배송지를 입력해주세요.');
      return;
    }

    const orderId = `order_${Date.now()}`;
    const customerKey = uuidv4();
    const result = await fetch('/api/postCheckStock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ list: props?.list }),
    })
      .then((res) => {
        return res.json();
      })
      .catch((err) => {
        console.log(err);
      });

    if (result.ok !== true) {
      window.alert(result.message);
    } else {
      // console.log('통과');
      localStorage.setItem('pending_order_items', JSON.stringify(props.list));
      localStorage.setItem('address', JSON.stringify(data?.address));
      localStorage.setItem('used_point', JSON.stringify(props.usedPoint));
      localStorage.setItem('add_point', JSON.stringify(props.addPoint));
    }

    const tossPayments = await loadTossPayments(
      // 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
      process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY || '',
    );
    const payment = tossPayments.payment({
      customerKey: customerKey,
    });
    await payment
      .requestPayment({
        method: 'CARD',

        amount: {
          currency: 'KRW',
          value: props.price,
        },
        orderId: orderId,
        orderName: 'NextGacha 결재',
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
        // windowTarget: 'popup',
        card: {
          useCardPoint: false,
          useAppCardOnly: false, // 앱카드 전용 결제를 끄면 일반 선택창이 뜹니다
        },
      })
      .catch((err) => {
        console.log('err : ', err);
        // alert('결재 취소');
      });
  };
  //   [props, userInfo, openModal]
  // );

  return (
    <div className={wrapper}>
      {/* {ready && <div id='payment-method' />} */}
      <Btn
        // size={props.size || 'medium'}
        onClick={onClickPayment}
        className={dynamicWidthBtn}
        style={
          width !== undefined
            ? assignInlineVars({ [btnWidthVar]: `${width}px` })
            : undefined
        }
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        disabled={isPending || props.list.length === 0}
      >
        BUY
      </Btn>
      {isHover && firstRoute !== 'mypage' && (
        <div
          className={tooltipWrap}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div className={tooltipBox}>
            {data === undefined ? (
              <span>로그인 후 구매할 수 있습니다!</span>
            ) : (
              <div className={centerFit}>
                <div className={warningTitle}>!! 배송지를 확인해주세요 !!</div>
                <div>
                  {data.address !== '' ? (
                    // 주소가 있을 때: 주소 텍스트와 버튼을 함께 렌더링
                    <>{data.address}</>
                  ) : (
                    // 주소가 없을 때
                    <>
                      <span className={noAddressText}>
                        지정된 배송지가 없습니다.
                      </span>
                    </>
                  )}
                  <span className={searchLink} onClick={handleClick}>
                    [검색]
                  </span>
                </div>
                <div className={detailAddressWrap}>
                  <input
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    placeholder='상세 주소 입력 ( ex. 102호 / 상세 주소가 없을 시 . 입력)'
                    className={detailAddressInput}
                  />
                </div>
                <div
                  onClick={async () => {
                    if (data.address === '') {
                      alert('주소를 입력해주세요');
                      return;
                    }

                    if (detailAddress === '') {
                      alert('상세 주소를 입력해주세요');
                      return;
                    }
                    const address = data.address + ' ' + detailAddress;

                    await fetch('/api/updateAddress', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },

                      body: JSON.stringify({
                        address,
                      }),
                    });

                    queryClient.invalidateQueries({ queryKey: ['userInfo'] });
                    setDetailAddress('');
                  }}
                  className={updateBtn}
                >
                  수정
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
