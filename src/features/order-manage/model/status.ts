// 주문 상태와 관리자 화면 경로(/manager/order/{slug})
export const ORDER_STATUSES = [
  { status: '상품 확인중', slug: 'check' },
  { status: '배송중', slug: 'sending' },
  { status: '배송 완료', slug: 'arrive' },
  { status: '환불', slug: 'refund' },
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
  // 상품 확인중 탭에서만 채움 (findSuspects)
  suspects?: { orderId: string; email: string; by: string[] }[];
};
