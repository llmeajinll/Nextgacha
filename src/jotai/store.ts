import { atom } from 'jotai';

interface tempCartAtomType {
  num: number | null;
  title: string;
  price: number | null;
  discount: number;
  product: { name: string; count: number }[];
}

export const tempCartAtom = atom<tempCartAtomType>({
  num: null,
  title: '',
  price: null,
  discount: 0,
  product: [],
});

tempCartAtom.debugLabel = '임시장바구니';

export const setTempCartAtom = atom(
  null,
  (_get, set, updated: tempCartAtomType) => {
    set(tempCartAtom, updated);
  },
);
