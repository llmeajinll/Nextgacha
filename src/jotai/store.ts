import { atom } from 'jotai';
import { ProductProps } from '@/shared/type';

export const tempCartAtom = atom<ProductProps[]>([]);

export const addToTempCartAtom = atom(
  null,
  (get, set, newItem: ProductProps) => {
    const cart = get(tempCartAtom);

    console.log('newItem: ', newItem);
    const index = cart.findIndex((item) => item.code === newItem.code);

    if (index !== -1) {
      // 이미 있으면 count 증가
      const updated = cart.map((item) =>
        item.code === newItem.code ? { ...item, count: item.count + 1 } : item
      );
      set(tempCartAtom, updated);
    } else {
      // 없으면 새로 추가
      set(tempCartAtom, [...cart, newItem]);
    }
  }
);
