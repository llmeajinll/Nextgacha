import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModal } from '@/shared/hooks';
import { postCart } from '../api/postCart';
import { addToCartList } from '../lib/cartCache';
import { tempCartAtom } from './store';
import type { SimpleCart, Stock } from './types';

// 상품 상세 "CART" 낙관적 업데이트: 서버 응답 전에 고른 옵션을 비우고, 한도 계산용 캐시(['tempCartData', num])에
// 담은 수량을 먼저 더한 뒤 완료 안내를 띄운다. 실패하면 둘 다 되돌리고 서버 메시지를 보여준다
export default function useAddToCart() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModal();
  const setTempCart = useSetAtom(tempCartAtom);

  const { mutate } = useMutation({
    mutationFn: async (vars: { num: number; updatedArray: Stock[] }) => {
      const res = await postCart(vars);
      if (res.ok !== true) throw new Error(res.message ?? '로그인 후 장바구니에 담을 수 있습니다.');
    },
    onMutate: async ({ num, updatedArray }) => {
      const key = ['tempCartData', num];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<SimpleCart | null>(key);
      if (previous) queryClient.setQueryData(key, { ...previous, cart: addToCartList(previous.cart, updatedArray) });
      setTempCart((prev) => ({ ...prev, product: [] }));
      openModal('장바구니에 정상적으로 들어갔습니다.\n장바구니로 이동하시겠습니까?', {
        onClickCheck: () => router.push('/mypage/cart'),
        onClickCancel: () => {},
      });
      return { previous };
    },
    onError: (error, { num, updatedArray }, context) => {
      if (context?.previous) queryClient.setQueryData(['tempCartData', num], context.previous);
      // 그새 다른 상품 상세로 옮겼으면 그 상품의 선택은 건드리지 않는다
      setTempCart((prev) => (prev.num === num ? { ...prev, product: updatedArray } : prev));
      openModal(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tempCartData'] });
      queryClient.invalidateQueries({ queryKey: ['cartData'] });
    },
  });

  return { addToCart: mutate };
}
