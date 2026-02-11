import { ProductProps } from '@/shared/type';
import Cookies from 'js-cookie';
import updateCart from '@/api/updateCart';
import getCart from '@/api/getCart';

import { useRouter } from 'next/navigation';
import { useModal } from '@/app/hooks';

import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
  QueryKey,
} from '@tanstack/react-query';
import { baseUrl } from '@/shared/baseUrl';

export default function useCart() {
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const { data } = useSuspenseQuery({
    queryKey: ['cartData'],
    queryFn: async () =>
      await fetch(`${baseUrl}/api/getCart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      } as any).then(async (res) => {
        const data = await res.json();
        if (data.ok === true) {
          console.log('useSuspenseQuery : ', data.result);
          return data.result;
        } else {
          return { cart: {}, keep: {}, stock: {} };
        }
      }),
  });

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
      if (!response.ok) throw new Error('useCart mutation error');
      return response.json();
    },
    onMutate: async ({ preset, name, num }) => {
      await queryClient.cancelQueries({ queryKey: ['cartData'] });
      const previousData = queryClient.getQueryData<any[]>(['cartData']);

      if (
        previousData
          ?.find((i: any) => i.num === num)
          ?.cart?.list?.find((v: any) => v.name === name)?.count > 5
      ) {
        return;
      }
      queryClient.setQueryData(['cartData'], (old: any) => {
        if (!old) return old;

        const next = structuredClone(old);

        console.log('======== oldData ======== : ', old);

        const item = next?.cart?.list?.find((v: any) => v.name === name);
        if (!item) return old;

        if (preset === 'increase') item.count += 1;
        if (preset === 'decrease') item.count -= 1;
        if (preset === 'erase') {
          next.cart.list = next.cart.list.filter((v: any) => v.name !== name);
        }

        return next;
      });

      return { previousData };
      // if (previousData && Array.isArray(previousData)) {
      //   console.log('previousData : ', previousData);

      //   return { previousData };
      // }
    },
    // 2. 서버 업데이트 성공 후 실행
    onSuccess: async () => {
      // 'cartData' 키를 가진 쿼리를 무효화하여 서버에서 최신 데이터를 다시 읽어옵니다.
      queryClient.invalidateQueries({ queryKey: ['cartData'] });
      const previousData = queryClient.getQueryData(['cartData']);
      console.log(previousData);
    },
    onError: (error, vars, context) => {
      console.error('업데이트 실패:', error);
      if (context?.previousData) {
        queryClient.setQueryData(['cartData'], context.previousData);
      }
      alert('변경사항을 저장하지 못했습니다.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cartData'] });
    },
  });

  const { mutate, isPending } = mutation;

  console.log('useCart data : ', mutate, isPending, data);

  const increase = (
    keepCount: number,
    stockCount: number,
    num: number,
    name: string,
    count: number,
    // newData: any
  ) => {
    console.log('INCREASE num, name, count : ', num, name, count);

    console.log('keepCount : ', keepCount);

    // B. 해당 물건의 실제 재고 (stock)

    console.log('stockCount : ', stockCount);
    // const stockCount = stockItem ? stockItem.count : 0;

    // C. 최대 한도 계산 (재고량 vs 5개 중 작은 값)
    // const maxLimit = Math.min(5, stockCount);
    const isLeft = keepCount + count < Math.min(5, stockCount + keepCount);
    console.log(isLeft, keepCount + count, Math.min(5, stockCount + keepCount));

    if (isLeft === true) {
      if (isPending) return;

      mutation.mutate({
        num,
        name,
        preset: 'increase',
      });
    } else {
      window.alert(
        `더 담을 수 없습니다. (재고 : ${stockCount}, 배송중 : ${keepCount}, 최대로 담을 수 있는 갯수 : ${Math.min(
          5,
          stockCount + keepCount,
        )})`,
      );
      // openModal(
      //   `더 담을 수 없습니다. (재고 : ${stockCount}, 배송중 : ${keepCount}, 최대로 담을 수 있는 갯수 : ${Math.min(
      //     5,
      //     stockCount + keepCount
      //   )}`
      // );
    }
  };

  const decrease = (
    num: number,
    name: string,
    // count: number,
    // newData: any
  ) => {
    console.log('DECREASE1', name);
    if (isPending) return;

    const current = queryClient.getQueryData<any>(['cartData']);
    const item = current
      ?.find((item: any) => item.num === num)
      ?.cart?.list?.find((v: any) => v.name === name);

    console.log(
      'DECREASE current : ',
      current?.find((item: any) => item.num === num),
    );

    if (!item) return;

    const count = item.count;
    console.log('DECREASE num, name, count : ', num, name, count);

    if (count > 1) {
      mutation.mutate({
        num,
        name,
        preset: 'decrease',
      });
    } else if (count === 1) {
      console.log('decrease count is 1');
      if (window.confirm('상품을 삭제하시겠습니까?')) {
        mutation.mutate({
          num,
          name,
          preset: 'erase',
        });
      }
    } else if (count <= 0) {
      console.log('count is 0 or less, doing nothing');
      mutation.mutate({
        num,
        name,
        preset: 'erase',
      });
    }
  };

  const erase = (num: number, name: string) => {
    console.log('ERASE num, name, count : ', num, name);
    if (window.confirm('상품을 삭제하시겠습니까?')) {
      mutation.mutate({
        num,
        name,
        preset: 'erase',
      });
    } else {
      return;
    }

    // openModal('상품을 삭제하시겠습니까?', {
    //   onClickCheck: () =>
    //     mutation.mutate({
    //       num,
    //       name,
    //       preset: 'erase',
    //     }),
    // });
  };

  return { data, increase, decrease, erase, mutate, isPending };
}
