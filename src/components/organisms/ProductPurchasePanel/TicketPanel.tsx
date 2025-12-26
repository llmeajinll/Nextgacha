'use client';

import React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import Cookie from 'js-cookie';
import { tempCartAtom } from '@/jotai/store';
import { Ticket, TicketContainer } from '@/components/molecules';
import { useTempCart } from '@/app/hooks';

export default function TicketPanel() {
  const [tempCart] = useAtom(tempCartAtom);
  console.log('tempCart : ', tempCart);

  const { TempCartAdd, TempCartMinus, TempCartDelete } = useTempCart();

  return (
    <>
      {tempCart && (
        <TicketContainer status='detail'>
          {tempCart.map((val, key) => {
            console.log('tempCart val : ', val);
            return (
              <Ticket
                props={val}
                key={key}
                increase={TempCartAdd}
                decrease={TempCartMinus}
                erase={TempCartDelete}
              />
            );
          })}
        </TicketContainer>
      )}
    </>
  );
}
