import { atom } from 'jotai';
import { ProductProps } from '@/shared/type';
import Cookie from 'js-cookie';

export const tempCartAtom = atom<any[]>([]);
// export const tempCartAtom = atom<ProductProps[]>([]);
export const setTempCartAtom = atom(null, (_get, set, updated: any[]) => {
  set(tempCartAtom, updated);
});
