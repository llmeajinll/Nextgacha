// 할인 기간·예약 판매 기간 판정 (순수 함수, DB 접근 없음)
// 화면 조회(findProducts, getOneProduct, getCart, getSimpleCart)와 결제 승인(verifyOrder)이 같은 기준을 쓴다
// docs/policies/discounts.md "할인 기간", preorders.md "예약 상품 판매 기간"

const DAY = 24 * 60 * 60 * 1000;
// 종료일(discountEnd, reserveEnd)은 관리자가 고른 마지막 날의 KST 자정 → 그날 하루까지 포함 (끝 = 종료일 + 1일)
// 예약 마감 뒤 숨기는 기간. 그 뒤 일반 상품으로 다시 보인다
export const RESERVE_HIDE_DAYS = 14;

type DateLike = Date | string | null | undefined;
const time = (v: DateLike) => {
  if (!v) return null;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
};

export type DiscountFields = {
  discount?: number;
  isDiscount?: boolean;
  discountStart?: DateLike;
  discountEnd?: DateLike;
  // productColl은 타입 없는 Document라 그대로 받을 수 있게
  [key: string]: unknown;
};

// 지금 적용되는 할인율. 기간이 비어 있으면 그쪽은 제한 없음 (기간 도입 전 상품)
export function activeDiscount(p: DiscountFields, now = new Date()) {
  const rate = p.discount ?? 0;
  if (rate <= 0 || p.isDiscount === false) return 0;
  const start = time(p.discountStart);
  const end = time(p.discountEnd);
  const t = now.getTime();
  if (start !== null && t < start) return 0;
  if (end !== null && t >= end + DAY) return 0;
  return rate;
}

// 화면으로 내보낼 때: discount/isDiscount를 지금 기준 값으로 바꿔서 클라이언트 계산식은 그대로 둔다
export function withActiveDiscount<T extends DiscountFields>(p: T, now = new Date()): T {
  const discount = activeDiscount(p, now);
  return { ...p, discount, isDiscount: discount > 0 };
}

// 같은 판정을 Mongo 집계 식으로 ($project에서 discount 자리에 넣는다)
export function activeDiscountExpr(now = new Date()) {
  const unset = (f: string) => ({ $in: [{ $type: f }, ['missing', 'null', 'string']] });
  return {
    $cond: [
      {
        $and: [
          { $gt: [{ $ifNull: ['$discount', 0] }, 0] },
          { $ne: ['$isDiscount', false] },
          { $or: [unset('$discountStart'), { $lte: ['$discountStart', now] }] },
          { $or: [unset('$discountEnd'), { $gt: ['$discountEnd', new Date(now.getTime() - DAY)] }] },
        ],
      },
      '$discount',
      0,
    ],
  };
}

export type ReserveFields = {
  reserve?: DateLike;
  reserveStart?: DateLike;
  reserveEnd?: DateLike;
  [key: string]: unknown;
};
// upcoming: 예약 시작 전(보이지만 구매 불가) / reserve: 예약 판매 중 / hidden: 마감 후 2주 / normal: 일반 상품
export type SaleState = 'upcoming' | 'reserve' | 'hidden' | 'normal';

export function saleState(p: ReserveFields, now = new Date()): SaleState {
  const end = time(p.reserveEnd);
  if (end === null) return 'normal';
  const t = now.getTime();
  const start = time(p.reserveStart);
  if (start !== null && t < start) return 'upcoming';
  if (t < end + DAY) return 'reserve';
  if (t < end + (1 + RESERVE_HIDE_DAYS) * DAY) return 'hidden';
  return 'normal';
}

export const canBuy = (p: ReserveFields, now = new Date()) => {
  const s = saleState(p, now);
  return s === 'reserve' || s === 'normal';
};

// 목록·검색에서 마감 후 2주 상품을 빼는 Mongo 조건 (Date로 저장된 reserveEnd만 해당)
export function hiddenReserveFilter(now = new Date()) {
  return {
    reserveEnd: {
      $lte: new Date(now.getTime() - DAY),
      $gt: new Date(now.getTime() - (1 + RESERVE_HIDE_DAYS) * DAY),
    },
  };
}
