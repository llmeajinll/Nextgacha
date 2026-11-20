'use client';

import React, { useEffect } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import Cookie from 'js-cookie';
import { setTempCartAtom, tempCartAtom } from '@/features/cart/model/store';
import { Ticket, TicketContainer } from '@/features/cart/ui';
import { useTempCart } from '@/features/cart/model';
import useSplitRoute from '@/shared/hooks/useSplitRoute';

export default function TicketPanel() {
  const { firstRoute } = useSplitRoute();
  const isValid = firstRoute && !isNaN(Number(firstRoute));

  const { increase, decrease, erase } = useTempCart(firstRoute);
  const [tempCart, setTempCart] = useAtom(tempCartAtom);
  const { title, price, num, discount } = tempCart;

  // 상세 페이지를 떠날 때 임시 장바구니 초기화
  useEffect(() => {
    return () =>
      setTempCart({
        title: '',
        price: 0,
        num: null,
        discount: 0,
        product: [],
      });
  }, []);

  if (!isValid) return null;
  // const data = tempCartQuery?.data;
  // const increase = tempCartQuery?.increase;


  return (
    <>
      {Array.isArray(tempCart?.product) && tempCart.product.length > 0 && (
        <TicketContainer status='detail'>
          {tempCart?.product?.map((val, key) => {
            return (
              <Ticket
                props={{
                  title,
                  price: price ?? 0,
                  num: num ?? 0,
                  name: val.name,
                  count: val.count,
                  discount: discount,
                }}
                key={key}
                increase={increase}
                decrease={decrease}
                erase={erase}
              />
            );
          })}
        </TicketContainer>
      )}
    </>
  );
}
