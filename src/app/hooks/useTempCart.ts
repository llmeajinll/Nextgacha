import React, { useState } from 'react';
import useSWR from 'swr';
import { useAtom } from 'jotai';
import { tempCartAtom } from '@/jotai/store';
import { ProductProps } from '@/shared/type';
import { useModal, useCart } from '@/app/hooks';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { baseUrl } from '@/shared/baseUrl';

// const fetcher = (url: string) =>
//   fetch(url, { credentials: 'include' }).then(async (res) => {
//     const result = await res.json();
//     // console.log(result);
//     if (result.ok === true) {
//       return result.data.cart;
//     } else if (result.ok === false) {
//       // openModal('로그인 후 장바구니에 담을 수 있습니다.');
//       return [];
//     } else {
//       // openModal('로그인 후 장바구니에 담을 수 있습니다.');
//       return [];
//     }
//   });
const MAX_LIMIT = 5;
export default function useTempCart(num: number | string) {
  // const
  console.log('useTempCart : ', num);
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const [tempCart, setTempCart] = useAtom(tempCartAtom);
  // const [tempCart, setTempCart] = useState<{ num: number; list: any[] }>();

  const isValidNum = num !== null && num !== '' && !isNaN(Number(num));

  // if (!num) {
  //   return {
  //     data: { cart: { list: [] }, stock: { list: [] }, keep: { list: [] } },
  //     increase: () => {},
  //   };
  // }

  const { data } = useSuspenseQuery({
    queryKey: ['tempCartData'],
    queryFn: async () => {
      if (!isValidNum) return {};
      const res = await fetch(
        `${baseUrl}/api/protected/getSimpleCart?num=${num}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        } as any
      ).then(async (res) => {
        const data = await res.json();
        if (data.ok === true) {
          console.log('tempCartData : ', data.result);
          setTempCart({
            title: data.result.stock.title,
            price: data.result.stock.price,
            num: data.result.num,
            list: [],
          });
          return data.result;
        } else {
          return { cart: {}, keep: {}, stock: {}, num: null };
        }
      });
      return res;
    },
  });

  const { cart, stock, keep } = data;
  console.log(data);

  const increase = ({ name }: { name: string }) => {
    console.log('increase, name : ', name);
    console.log(cart, stock, keep);
    if (!isValidNum) return;
    const tempCount =
      tempCart?.list?.find((v: any) => v.name === name)?.count ?? 0;
    const cartCount = cart.find((v: any) => v.name === name)?.count ?? 0;
    const keepCount = keep.find((v: any) => v.name === name)?.count ?? 0;
    const stockCount = stock.list.find((v: any) => v.name === name)?.count ?? 0;

    console.log(
      'tempCount, cartCount, keepCount, stockCount : ',
      tempCount,
      cartCount,
      keepCount,
      stockCount
    );

    const owned = cartCount + keepCount + tempCount;
    const baseCap = Math.min(MAX_LIMIT, stockCount);
    const effectiveCap = owned >= MAX_LIMIT ? MAX_LIMIT : baseCap;
    const ableGet = owned < effectiveCap;

    if (ableGet === true) {
      // setTempCart;
      console.log('가농');
      setTempCart((prev: any) => {
        const current = prev ?? { num: Number(num), list: [] };

        const exists = current?.list?.find((item: any) => item.name === name);

        if (exists) {
          return {
            ...current,
            list: current.list.map((item: any) =>
              item.name === name ? { ...item, count: item.count + 1 } : item
            ),
          };
        }

        return {
          ...current,
          list: [...current.list, { name, count: 1 }],
        };
      });
      console.log('임시 수량 증가:', name);
    } else {
      openModal(
        `더 담울 수 없습니다. (장바구니 : ${cartCount}개, 배송중: ${keepCount}, 재고: ${stockCount})`
      );
    }

    console.log('after ADd : ', tempCart);
  };

  const decrease = ({ name }: { name: string }) => {
    console.log('decrease name : ', name);
  };

  const erase = ({ name }: { name: string }) => {
    console.log('erase name : ', name);
  };

  const mutation = useMutation({
    mutationFn: async ({
      num,
      name,
      preset,
    }: // newData,
    {
      num: number;
      name: string;
      preset: 'increase' | 'decrease' | 'erase';
      // newData?: any;
    }) => {
      const response = await fetch(`${baseUrl}/api/updateCart`, {
        method: 'POST', // 또는 POST
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preset, name, num }),
        // body: JSON.stringify({ num, ...newData }),
      });
      return response.json();
    },
    onMutate: async ({ preset, name, num }) => {
      await queryClient.cancelQueries({ queryKey: ['tempCartData'] });
      const previousData = queryClient.getQueryData<any[]>(['tempCartData']);
      if (previousData && Array.isArray(previousData)) {
        console.log('previousData : ', previousData);

        return { previousData };
      }
    },
    // 2. 서버 업데이트 성공 후 실행
    onSuccess: async () => {
      // 'cartData' 키를 가진 쿼리를 무효화하여 서버에서 최신 데이터를 다시 읽어옵니다.
      queryClient.invalidateQueries({ queryKey: ['tempCartData'] });
      const previousData = queryClient.getQueryData(['tempCartData']);
      console.log(previousData);
    },
    onError: (error) => {
      console.error('업데이트 실패:', error);
      alert('변경사항을 저장하지 못했습니다.');
    },
  });

  return {
    tempCart,
    increase,
    decrease,
    erase,
    data: isValidNum ? data : null,
  };
}
