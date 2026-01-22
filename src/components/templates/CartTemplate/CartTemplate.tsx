'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useAtom, useAtomValue } from 'jotai';
import { Range } from '@/components/atoms';
import { Cart, EmptyCard, AddressTruck } from '@/components/molecules';
import { queryClientAtom } from 'jotai-tanstack-query';
import {
  CartContainer,
  pointInput,
  pointInputFocused,
  bigText,
  smallText,
  line,
} from './cartTemplate.css';
import { comma } from '@/shared/comma';
import { BuyBtn } from '@/components/atoms';
import { userInfoAtom } from '@/jotai/store';
import { AddressModal } from '@/components/organisms';
import { useCart } from '@/app/hooks';

export default function CartTemplate() {
  // console.log('props : ', props);
  // const data = await getCart();

  const [{ data: userData, isPending, error }] = useAtom(userInfoAtom);
  const [point, setPoint] = useState(0);
  const [isPointInputFocused, setIsPointInputFocused] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useCart();

  // console.log(data);

  const Price = useMemo(() => {
    setPoint(0);

    return data.reduce((accumulator: number, currentValue: any) => {
      const price =
        currentValue.stock.price * (1 - currentValue.stock.discount / 100);
      return (
        accumulator +
        currentValue.cart.list.reduce((acc: number, item: any) => {
          if (currentValue.cart.check === true) {
            const itemTotal = item.count * price;
            return acc + itemTotal;
          } else {
            return acc + 0;
          }
        }, 0)
      );
    }, 0);
  }, [data]);

  const ToTalPrice = useMemo(() => {
    if (Price === 0) return 0;
    else {
      if (Price >= 50000) {
        return Price - point;
      } else {
        return Price - point + 3000;
      }
    }
  }, [Price, point]);

  const handleUpdateItem = (num: number, newData: any) => {
    // 'cartData'라는 키를 가진 캐시 데이터를 직접 수정합니다.
    queryClient.setQueryData(['cartData'], (oldData: any) => {
      if (!Array.isArray(oldData)) return oldData;
      console.log('oldData : ', oldData, 'newData', newData, 'num', num);

      return oldData.map((item) => {
        if (item.cart?.num !== num) return item;

        return {
          ...item,
          cart: {
            ...item.cart,
            ...newData, // { check: false } 등
          },
        };
      });
    });
  };

  // {
  //   num: item.stock.num,
  //   title: item.stock.title,
  //   product: item.cart.map((p: any) => ({
  //     name: p.name,
  //     count: p.count,
  //   }

  const checkedProduct = useMemo(() => {
    setPoint(0);
    console.log('checkedProduct data  : ', data);
    return data
      .filter((item: any) => item.cart?.check === true)
      .map((item: any) => ({
        num: item.cart.num,
        title: item.stock.title,
        product: item.cart.list ?? [],
      }));
  }, [data]);

  console.log('useQuery data : ', data);
  console.log('checkedProduct : ', checkedProduct);

  return (
    <>
      <Range preset='columnCenter' gap='10' className={CartContainer}>
        {!data || data.length === 0 ? (
          <EmptyCard style={{ marginTop: 0 }}>CART IS EMPTY</EmptyCard>
        ) : (
          data?.map((item: any, index: number) => {
            return (
              <Cart key={index} props={item} onClickCheck={handleUpdateItem} />
            );
          })
        )}

        {Price < 50000 && Price > 1 && (
          <>
            <div className={bigText}>
              PRICE :
              <span
                style={{
                  display: 'inline-block',
                  width: '320px',
                  textAlign: 'right',
                }}
              >
                {comma(Price)} WON
              </span>
            </div>

            <div style={{ margin: '5px 0px 0px 0px' }}>
              <span className={smallText}>
                <span>Delivery Fee :</span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '248px',
                    textAlign: 'right',
                  }}
                >
                  + 3,000<span style={{ marginLeft: '15px' }}>WON</span>
                </span>
                <span
                  style={{
                    marginLeft: '10px',
                    fontSize: '16px',
                    color: 'gray',
                  }}
                >
                  [50,000원 이상 구매 시 무료배송]
                </span>
              </span>
            </div>
          </>
        )}

        {Price !== 0 && (
          <div>
            <span className={smallText}>
              <span>USE POINTS :</span>
              <span
                style={{
                  display: 'inline-block',
                  width: '238px',
                  textAlign: 'right',
                }}
              >
                <span style={{ marginRight: '8px' }}>-</span>
                {/* <Image
                  src='/images/point.png'
                  alt='point'
                  width={20}
                  height={20}
                  style={{ marginRight: '5px' }}
                ></Image> */}
                <input
                  value={point}
                  className={
                    isPointInputFocused ? pointInputFocused : pointInput
                  }
                  onFocus={() => setIsPointInputFocused(true)}
                  onBlur={() => setIsPointInputFocused(false)}
                  onChange={(e) => {
                    const inputVal = Number(e.target.value);

                    const limitPrice =
                      Price >= 50000 ? Price - 1000 : Price + 2000;
                    const maxPoint = userData?.point ?? 0;

                    const limit =
                      maxPoint >= limitPrice ? limitPrice : maxPoint;

                    console.log(
                      'limitPrice, maxPoint, limit : ',
                      limitPrice,
                      maxPoint,
                      limit,
                    );

                    if (limit < inputVal) {
                      setPoint(limit);
                    } else {
                      setPoint(inputVal);
                    }
                  }}
                />
                <span style={{ marginLeft: '15px' }}>P</span>
              </span>
            </span>
          </div>
        )}

        <div className={line} />
        <Range style={{ marginBottom: '30px' }}>
          <div className={bigText} style={{ marginRight: '30px' }}>
            <span>
              <span style={{ color: '#75C3FE' }}>TOTAL :</span>
              <span
                style={{
                  display: 'inline-block',
                  width: '315px',
                  textAlign: 'right',
                }}
              >
                {comma(ToTalPrice)} WON
              </span>
            </span>
          </div>
          <Range preset='center' className={smallText}>
            <span style={{ marginRight: '20px', color: '#75C3FE' }}>
              REWARD :
            </span>
            <Image
              src='/images/point.png'
              alt='point'
              width={24}
              height={24}
              style={{ marginRight: '5px' }}
            ></Image>
            {Math.floor(Price * 0.01)}p
          </Range>
        </Range>

        {/* <Btn size='big'>BUY</Btn> */}
        <Range preset='column'>
          <AddressModal />
          <AddressTruck address={userData?.address || ''} />
        </Range>

        <BuyBtn
          props={{
            price: ToTalPrice,
            usedPoint: point,
            addPoint: Number(Math.floor(Price * 0.01)),
            list: checkedProduct,
          }}
          width={
            userData?.address !== undefined
              ? userData?.address.length * 12 + 75
              : 320
          }
        />
      </Range>
    </>
  );
}
