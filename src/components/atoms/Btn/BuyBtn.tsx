'use client';

import React, { useState } from 'react';
import Btn from './Btn';
import { useCallback } from 'react';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { v4 as uuidv4 } from 'uuid';
import { useAtom, useAtomValue } from 'jotai';
import { userInfoAtom } from '@/jotai/store';
import { useModal } from '@/app/hooks';
import { transform } from 'next/dist/build/swc/generated-native';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { queryClientAtom } from 'jotai-tanstack-query';
import useSplitRoute from '@/app/hooks/useSplitRoute';

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
      process.env.NEXT_PUBLIC_TOSSPAYMENTS_CLIENT_KEY || ''
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
      })
      .catch((err) => {
        console.log('err : ', err);
        // alert('결재 취소');
      });
  };
  //   [props, userInfo, openModal]
  // );

  return (
    <div style={{ position: 'relative' }}>
      {/* {ready && <div id='payment-method' />} */}
      <Btn
        // size={props.size || 'medium'}
        onClick={onClickPayment}
        style={{ width: `${width}px` }}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
      >
        BUY
      </Btn>
      {isHover && firstRoute !== 'mypage' && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            paddingTop: '6px',
            transform: 'translate(-50%, 0)',
            zIndex: '10',
          }}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div
            style={{
              backgroundColor: 'white',

              border: '1px solid lightgray',
              padding: '10px',
              width: 'fit-content',

              textAlign: 'center',
            }}
          >
            {data === undefined ? (
              <span>로그인 후 구매할 수 있습니다!</span>
            ) : (
              <div style={{ width: 'fit-content', textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: '20px',
                    marginBottom: '5px',
                    fontWeight: 500,
                  }}
                >
                  !! 배송지를 확인해주세요 !!
                </div>
                <div>
                  {data.address !== '' ? (
                    // 주소가 있을 때: 주소 텍스트와 버튼을 함께 렌더링
                    <>{data.address}</>
                  ) : (
                    // 주소가 없을 때
                    <>
                      <span style={{ color: '#999999' }}>
                        지정된 배송지가 없습니다.
                      </span>
                    </>
                  )}
                  <span
                    style={{
                      marginLeft: '5px',
                      color: '#75C3FE',
                      cursor: 'pointer',
                    }}
                    onClick={handleClick}
                  >
                    [검색]
                  </span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <input
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    placeholder='상세 주소 입력 ( ex. 102호 / 상세 주소가 없을 시 . 입력)'
                    style={{
                      width: '400px',
                      padding: ' 8px',
                      border: '1px solid lightgray',
                      fontSize: '14px',
                    }}
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
                  style={{
                    backgroundColor: '#75C3FE',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '5px 0',
                    marginTop: '8px',
                  }}
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
