import { comma } from '@/shared/lib/comma';
import type { CardProps } from '@/entities/product/model/types';

// 쇼핑몰 카드와 같은 계산
export const saleOf = (price: number, rate: number) => comma(price * (1 - rate / 100));
export const discountOf = (p: CardProps) => (p.isDiscount ? p.discount : 0);
