import type { Stock } from '@/shared/api/docs';

export type { Stock };

// /api/getCart 가 돌려주는 상품(num) 하나. 장바구니 + 배송중(keep) + 재고·가격
export type CartItem = {
  num: number;
  cart: { num: number; list: Stock[]; check?: boolean };
  keep: { num: number; list: Stock[] };
  stock: { num: number; price: number; list: Stock[]; title: string; discount?: number };
};

// /api/protected/getSimpleCart 결과 (상품 상세의 임시 장바구니 계산용). 로그인 전이면 cart/keep이 비어 있다
export type SimpleCart = {
  num: number | null;
  cart: Stock[];
  keep: Stock[];
  stock: { list: Stock[]; price: number; discount?: number; title: string };
};
