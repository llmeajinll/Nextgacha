import { atom } from 'jotai';
import { ProductProps } from '@/shared/type';
import Cookie from 'js-cookie';

export const tempCartAtom = atom<any>({
  num: null,
  title: '',
  price: null,
  list: [],
});
// export const tempCartAtom = atom<ProductProps[]>([]);
export const setTempCartAtom = atom(null, (_get, set, updated: any[]) => {
  set(tempCartAtom, updated);
});

export const userInfoAtom = atom<{
  email: string;
  nickname: string;
  address: string;
  point: number;
  image: string;
} | null>(null);

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
