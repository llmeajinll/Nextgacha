// 주문 상태와 관리자 화면 경로(/manager/order/{slug})
export const ORDER_STATUSES = [
  { status: '상품 확인중', slug: 'check' },
  { status: '배송중', slug: 'sending' },
  { status: '배송 완료', slug: 'arrive' },
  { status: '환불', slug: 'refund' },
  // 불량 교환: 배송 완료 → 교환 요청(구매자) → 교환 완료(관리자, 재고 차감) 또는 반려 시 배송 완료로
  { status: '교환 요청', slug: 'exchange' },
  { status: '교환 완료', slug: 'exchanged' },
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number]['status'];

export const isOrderStatus = (v: unknown): v is OrderStatus =>
  ORDER_STATUSES.some((s) => s.status === v);

export const ORDER_PAGE_SIZE = 20;

export type AdminOrder = {
  _id: string;
  orderId: string;
  status: OrderStatus;
  customer: string;
  email: string;
  address: string;
  list: { num: number; title?: string; product: { name: string; count: number }[] }[];
  totalPrice: number;
  addPoint: number;
  usedPoint?: number;
  courier: string;
  invoice: string;
  created_at: string;
  arrivedDate: string;
  reason?: string;
  exchangeReason?: string;
  exchangeRequestedDate?: string;
  exchangedDate?: string;
  // 상품 확인중 탭에서만 채움 (findSuspects)
  suspects?: { orderId: string; email: string; by: string[] }[];
};
