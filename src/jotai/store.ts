import { atom } from 'jotai';
import { ProductProps } from '@/shared/type';
import Cookie from 'js-cookie';
import { atomWithQuery } from 'jotai-tanstack-query';
import { useQuery } from '@tanstack/react-query';

interface tempCartAtomType {
  num: number | null;
  title: string;
  price: number | null;
  product: { name: string; count: number }[];
}

export const tempCartAtom = atom<tempCartAtomType>({
  num: null,
  title: '',
  price: null,
  product: [],
});
tempCartAtom.debugLabel = '임시장바구니';
// export const tempCartAtom = atom<ProductProps[]>([]);
export const setTempCartAtom = atom(
  null,
  (_get, set, updated: tempCartAtomType) => {
    set(tempCartAtom, updated);
  }
);

// export const userInfoAtom = atom<{
//   email: string;
//   nickname: string;
//   address: string;
//   point: number;
//   image: string;
// } | null>(null);

export const userInfoAtom = atomWithQuery<{
  email: string;
  nickname: string;
  address: string;
  point: number;
  image: string;
}>(() => ({
  queryKey: ['userInfo'],
  queryFn: async () => {
    const res = await fetch('/api/getUser');

    if (!res.ok) throw new Error('유저 정보를 가져오지 못했습니다.');

    const data = await res.json();
    return data.result;
  },
  staleTime: 1000 * 60 * 10,
}));

export const modalAtom = atom<{
  isOpen: boolean;
  message: string;

  // onClickClose: () => void;
  onClickCheck?: () => void;
  onClickCancel?: () => void;
  onClickClose?: () => void;
}>({
  isOpen: false,
  message: 'test',

  // onClickClose: () => {},
  onClickCheck: () => {},
  onClickCancel: () => {},
  onClickClose: () => {},
});

// export const setUserInfoAtom = atom(null, (_get, set, updated: any) => {
//   console.log('setUserInfoAtom : ', updated);
//   set(userInfoAtom, updated);
//   console.log('userInfoAtom : ', userInfoAtom);
// });
