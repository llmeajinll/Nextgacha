import React from 'react';
import useSWR from 'swr';
import { useAtom } from 'jotai';
import { tempCartAtom } from '@/jotai/store';
import { ProductProps } from '@/shared/type';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' }).then(async (res) => {
    const result = await res.json();
    console.log(result);
    if (result.ok === true) {
      return result.data.cart;
    } else if (result.ok === false) {
      alert('로그인 후 장바구니에 담을 수 있습니다.');
    } else {
      alert('로그인 후 장바구니에 담을 수 있습니다.');
    }
  });

export default function useTempCart() {
  const { data: DBcart, mutate } = useSWR(
    '/api/protected/getSimpleCart',
    fetcher,
    {
      revalidateOnFocus: false, // 창 포커스 시 자동 갱신 끄기
      revalidateOnReconnect: false, // 네트워크 재연결 시 자동 갱신 끄기
      dedupingInterval: 10000, // 10초 동안은 중복 요청 방지
    }
  );

  const [tempCart, setTempCart] = useAtom(tempCartAtom);

  console.log('swr getCart : ', DBcart);

  const MAX = 5;

  // 예비 장바구니 값 증가
  const TempCartAdd = (newItem: ProductProps) => {
    console.log('newItem: ', newItem);

    const DBGroup = DBcart || []?.find((val: any) => val.num === newItem.num);
    const DBcartCount =
      DBGroup?.product?.find((p: any) => p.code === newItem.code)?.count ?? 0;

    // const preGroup = tempCart.find((val: any) => val.num === newItem.num);
    const preCount =
      tempCart?.find((p: any) => p.code === newItem.code)?.count ?? 0;

    console.log(
      'DBGroup, DBcartCount, preGroup, preCount : ',
      DBGroup,
      DBcartCount,
      tempCart,
      preCount
    );

    if (DBcartCount + preCount >= MAX) {
      // console.log(
      //   `장바구니는 최대 ${MAX}개까지만 이용 가능합니다. (현재 DB: ${DBcartCount}, 예비: ${preCount})`
      // );
      alert(
        `장바구니는 최대 ${MAX}개까지만 이용 가능합니다. (현재 장바구니: ${DBcartCount}, 예비 장바구니: ${preCount})`
      );

      return;
      //   return false;
    } else if (DBcartCount + preCount < MAX && preCount === 0) {
      // console.log(`jotai 없음 (현재 DB: ${DBcartCount}, 예비: ${preCount})`);
      const data = {
        num: newItem.num,
        code: newItem.name + newItem.num,
        name: newItem.name,
        title: newItem.title,
        count: 1,
        price: newItem.price,
        limit: { name: '', count: 0 },
      };
      setTempCart((prev) => [...prev, data]);
    }
    // jotai 있음
    else if (DBcartCount + preCount < MAX && preCount !== 0) {
      console.log(`jotai 있음 (현재 DB: ${DBcartCount}, 예비: ${preCount})`);
      const updated = tempCart.map((item) =>
        item.code === newItem.code ? { ...item, count: item.count + 1 } : item
      );
      setTempCart(updated);
    }
  };

  // 예비 장바구니 값 감소
  const TempCartMinus = (newItem: ProductProps) => {
    const preCount =
      tempCart?.find((p: any) => p.code === newItem.code)?.count ?? 0;

    if (preCount > 1) {
      const updated = tempCart.map((item) =>
        item.code === newItem.code ? { ...item, count: item.count - 1 } : item
      );
      setTempCart(updated);

      return;
      //   return false;
    } else if (preCount === 1) {
      if (window.confirm('삭제하시겠습니까?')) {
        const updated = tempCart.filter((item) => item.code !== newItem.code);
        setTempCart(updated);
      } else {
        return;
      }
    }
  };

  // 예비 장바구니 삭제
  const TempCartDelete = (newItem: ProductProps) => {
    console.log('newItem: ', newItem);

    const updated = tempCart.filter((item) => item.code !== newItem.code);
    setTempCart(updated);
  };

  return { TempCartAdd, TempCartMinus, TempCartDelete };
}
