'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { Range, Btn } from '@/components/atoms';
import { Cart, EmptyCard } from '@/components/molecules';
import { totalPriceStyle } from './carttemplate.css';
import { comma } from '@/shared/comma';
import { BuyBtn } from '@/components/atoms';
import { userInfoAtom } from '@/jotai/store';
import { AddressModal } from '@/components/organisms';

export default function CartTemplate({ props }: { props?: any }) {
  console.log('props : ', props);
  const [userInfo] = useAtom(userInfoAtom);
  const [point, setPoint] = useState(0);
  const [isPointInputFocused, setIsPointInputFocused] = useState(false);
  console.log('userInfo : ', userInfo);
  const [cartItems, setCartItems] = useState(props);

  const totalPrice = useMemo(() => {
    setPoint(0);
    return cartItems.reduce((acc: any, item: any) => {
      if (item.check === true) {
        const itemTotal =
          item.price *
          item.product.reduce(
            (prodAcc: number, prod: any) => prodAcc + prod.count,
            0
          );
        return acc + itemTotal;
      } else {
        return acc + 0;
      }
    }, 0);
  }, [cartItems]);

  const checkedProduct = useMemo(() => {
    setPoint(0);
    return cartItems.filter((item: any) => item.check);
  }, [cartItems]);

  console.log('totalPrice', totalPrice);

  const handleUpdateItem = (num: number, newData: any) => {
    console.log('num : ', num, 'newData : ', newData);
    setCartItems((prev: any) =>
      prev.map((item: any) =>
        item.num === num ? { ...item, ...newData } : item
      )
    );
    console.log(cartItems);
  };

  const finalPrice = useMemo(() => {
    if (totalPrice === 0) return 0;
    else {
      if (totalPrice >= 50000) {
        return totalPrice - point;
      } else {
        return totalPrice - point + 3000;
      }
    }
  }, [totalPrice, point]);

  return (
    <>
      {props.length === 0 ? (
        <EmptyCard data='CART' />
      ) : (
        <Range
          preset='columnCenter'
          gap='10'
          style={{
            width: '100%',
            marginBottom: '50px',
            padding: '15px 0px',
          }}
        >
          {cartItems?.map((item: any, index: number) => (
            <Cart key={index} props={item} onUpdate={handleUpdateItem} />
          ))}
          {totalPrice < 50000 && totalPrice > 1 && (
            <>
              <div
                style={{
                  fontFamily: 'silkscreen',
                  fontSize: '24px',
                }}
              >
                PRICE :
                <span
                  style={{
                    display: 'inline-block',
                    width: '270px',
                    textAlign: 'right',
                  }}
                >
                  {comma(totalPrice)} WON
                </span>
              </div>

              <div>
                <span
                  style={{
                    fontFamily: 'silkscreen',
                    fontSize: '18px',
                  }}
                >
                  <span style={{ marginRight: '20px' }}>Delivery Fee :</span>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '202px',
                      textAlign: 'right',
                    }}
                  >
                    + 3,000<span style={{ marginLeft: '8px' }}>WON</span>
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
          {totalPrice !== 0 && (
            <div>
              <span
                style={{
                  fontFamily: 'silkscreen',
                  fontSize: '18px',
                }}
              >
                <span style={{ marginRight: '50px' }}>USE POINTS :</span>
                <span
                  style={{
                    display: 'inline-block',
                    width: '202px',
                    textAlign: 'right',
                  }}
                >
                  <span style={{ marginRight: '8px' }}>-</span>
                  <Image
                    src='/images/point.png'
                    alt='point'
                    width={20}
                    height={20}
                    style={{ marginRight: '5px' }}
                  ></Image>
                  <input
                    value={point}
                    style={{
                      width: '100px',
                      textAlign: 'right',
                      height: '30px',
                      border: isPointInputFocused
                        ? '1px solid #75C3FE'
                        : '1px solid lightgray',
                      fontFamily: 'silkscreen',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                    onFocus={() => setIsPointInputFocused(true)}
                    onBlur={() => setIsPointInputFocused(false)}
                    onChange={(e) => {
                      const inputVal = Number(e.target.value);

                      const limitPrice =
                        totalPrice >= 50000
                          ? totalPrice - 1000
                          : totalPrice + 2000;
                      const maxPoint = userInfo?.point ?? 0;

                      const limit =
                        maxPoint >= limitPrice ? limitPrice : maxPoint;

                      console.log(
                        'limitPrice, maxPoint, limit : ',
                        limitPrice,
                        maxPoint,
                        limit
                      );

                      if (limit < inputVal) {
                        setPoint(limit);
                      } else {
                        setPoint(inputVal);
                      }
                    }}
                  />
                  <span style={{ marginLeft: '8px' }}>P</span>
                </span>
              </span>
            </div>
          )}
          <div
            style={{
              width: '700px',
              height: '1px',
              backgroundColor: 'lightgray',
            }}
          ></div>
          <Range gap='30'>
            <div className={totalPriceStyle}>
              <span style={{ color: '#75C3FE' }}>TOTAL</span> :{' '}
              {comma(finalPrice)}
              <span style={{ marginLeft: '10px' }}>WON</span>
            </div>
            <Range preset='center' gap='8' className={totalPriceStyle}>
              <span style={{ color: '#75C3FE' }}>REWARD</span> :{' '}
              <Image
                src='/images/point.png'
                alt='point'
                width={24}
                height={24}
              ></Image>
              {totalPrice * 0.01}p
            </Range>
          </Range>
        </Range>
      )}
      {/* <Btn size='big'>BUY</Btn> */}
      <Range preset='column'>
        <AddressModal />
        <Range>
          <Image
            src='/images/Group 266.png'
            width={50}
            height={70}
            alt='truck1'
          />
          <div
            style={{
              position: 'relative',
              width: `${
                userInfo?.address !== undefined
                  ? userInfo?.address.length * 12 + 'px'
                  : '100%'
              }`,
              minWidth: '245px',
            }}
          >
            <img
              src='/images/Group 268.png'
              // width={245}
              // height={70}
              style={{ width: '100%', height: '70px' }}
              alt='truck2'
            ></img>
            <div
              style={{
                boxSizing: 'border-box',
                position: 'absolute',
                width: '100%',
                top: 0,
                height: '50px',
                padding: '12px 10px 10px 10px',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              {userInfo?.address || (
                <span style={{ color: '#3aaaff' }}>주소를 입력해주세요</span>
              )}
            </div>
          </div>
          <Image
            src='/images/Group 267.png'
            width={25}
            height={70}
            alt='truck3'
          />
        </Range>
      </Range>

      <BuyBtn
        props={{
          price: finalPrice,
          usedPoint: point,
          addPoint: totalPrice * 0.01,
          list: checkedProduct.reduce((acc: any, item: any) => {
            console.log(item.title);
            if (item && item.product) {
              acc.push({
                num: item.num,
                title: item.title,
                product: item.product.map((p: any) => ({
                  name: p.name,
                  count: p.count,
                })),
              });
            }
            return acc;
          }, [] as { num: number; product: { name: string; count: number }[] }[]),
        }}
        width={
          userInfo?.address !== undefined
            ? userInfo?.address.length * 12 + 75
            : 320
        }
      />
    </>
  );
}
