// import { useState, useEffect } from 'react';
// import useSplitRoute from '@/app/hooks/useSplitRoute';
import { CardProps } from '@/shared/type';
import TicketPanel from './TicketPanel';
import InfoPanel from './InfoPanel';
import getDetailProduct from '@/api/getDetailProduct';

export default async function ProductPurchasePanel({ num }: { num: string }) {
  console.log(num);
  // const { firstRoute } = useSplitRoute();
  // const [info, setInfo] = useState<CardProps>({} as CardProps);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // const res = await fetch(
  //       //   `${process.env.NEXT_PUBLIC_API_URL}/getProduct?num=${firstRoute}`,
  //       //   {
  //       //     method: 'GET',
  //       //     headers: {
  //       //       'Content-Type': 'application/json',
  //       //     },
  //       //   }
  //       // );
  //       // const data = await res.json();
  //       // console.log(data);
  //       const result = await getDetailProduct(firstRoute);
  //       console.log('result:', result);
  //       setInfo(result as CardProps);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   fetchData();
  // }, [firstRoute]);

  const info = await getDetailProduct(num);

  return (
    <>
      <InfoPanel props={info} />
      <TicketPanel />
    </>
  );
}
