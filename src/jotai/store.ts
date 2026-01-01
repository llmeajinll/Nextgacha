import { atom } from 'jotai';
import { ProductProps } from '@/shared/type';
import Cookie from 'js-cookie';

export const tempCartAtom = atom<any[]>([]);
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

// export const setUserInfoAtom = atom(null, (_get, set, updated: any) => {
//   console.log('setUserInfoAtom : ', updated);
//   set(userInfoAtom, updated);
//   console.log('userInfoAtom : ', userInfoAtom);
// });
