import React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import Cookie from 'js-cookie';
import {
  tempCartAtom,
  addToTempCartAtom,
  minusToTempCartAtom,
  deleteTempCartAtom,
} from '@/jotai/store';
import { Ticket, TicketContainer } from '@/components/molecules';

export default function TicketPanel({
  props,
}: {
  props: { name: string; count: number }[];
}) {
  const [tempCart] = useAtom(tempCartAtom);

  const addToTempCart = useSetAtom(addToTempCartAtom);
  const minusToTempCart = useSetAtom(minusToTempCartAtom);
  const deleteToTempCart = useSetAtom(deleteTempCartAtom);

  return (
    <>
      {tempCart && (
        <TicketContainer status='detail'>
          {tempCart.map((val, key) => {
            return (
              <Ticket
                props={val}
                key={key}
                increase={addToTempCart}
                decrease={minusToTempCart}
                erase={deleteToTempCart}
              />
            );
          })}
        </TicketContainer>
      )}
    </>
  );
}
