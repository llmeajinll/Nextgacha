'use client';
import { useState, useEffect } from 'react';
import useSplitRoute from '@/app/hooks/useSplitRoute';
import { CardProps } from '@/shared/type';
import TicketPanel from './TicketPanel';
import InfoPanel from './InfoPanel';

export default function ProductPurchasePanel() {
  const { firstRoute } = useSplitRoute();
  const [info, setInfo] = useState<CardProps>({} as CardProps);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getProduct?num=${firstRoute}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const data = await res.json();
        console.log(data);
        setInfo(data[0] as CardProps);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [firstRoute]);

  return (
    <>
      <InfoPanel props={info} />
      <TicketPanel props={info.list} />
    </>
  );
}
