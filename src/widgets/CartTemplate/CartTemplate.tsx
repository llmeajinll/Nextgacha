'use client';

import { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useAtom, useAtomValue } from 'jotai';
import { Range } from '@/shared/ui';
import { Cart } from '@/features/cart/ui';
import { AddressTruck } from '@/entities/order/ui';
import { EmptyCard } from '@/shared/ui';
import { queryClientAtom } from 'jotai-tanstack-query';
import {
  CartContainer,
  pointInput,
  pointInputFocused,
  bigText,
  smallText,
  line,
  priceValue,
  deliveryValue,
  pointValue,
  totalValue,
  deliverySection,
  unitLabel,
  deliveryNote,
  minusSign,
  totalRow,
  totalLabel,
  totalColor,
  rewardLabel,
  pointIcon,
} from './carttemplate.css';
import { comma } from '@/shared/lib/comma';
import BuyBtn from '@/features/purchase/ui/BuyBtn';
import { userInfoAtom } from '@/entities/user/model/store';
import AddressModal from '@/features/address/ui/AddressModal';
import { useCart } from '@/features/cart/model';

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
          <EmptyCard noSpacing>CART IS EMPTY</EmptyCard>
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
              <span className={priceValue}>{comma(Price)} WON</span>
            </div>

            <div className={deliverySection}>
              <span className={smallText}>
                <span>Delivery Fee :</span>
                <span className={deliveryValue}>
                  + 3,000<span className={unitLabel}>WON</span>
                </span>
                <span className={deliveryNote}>
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
              <span className={pointValue}>
                <span className={minusSign}>-</span>
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
                <span className={unitLabel}>P</span>
              </span>
            </span>
          </div>
        )}

        <div className={line} />
        <Range className={totalRow}>
          <div className={totalLabel}>
            <span>
              <span className={totalColor}>TOTAL :</span>
              <span className={totalValue}>{comma(ToTalPrice)} WON</span>
            </span>
          </div>
          <Range preset='center' className={smallText}>
            <span className={rewardLabel}>REWARD :</span>
            <Image
              src='/images/point.png'
              alt='point'
              width={24}
              height={24}
              className={pointIcon}
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
