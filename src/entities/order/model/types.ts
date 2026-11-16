// 주문 내역 API(getHistory, getOneHistory)가 돌려주는 주문 한 건
export type OrderLineView = {
  num: number;
  title?: string;
  product: { name: string; count: number }[];
};

export type OrderView = {
  orderId: string;
  created_at: string;
  status: string;
  courier: string;
  invoice: string;
  address: string;
  totalPrice: number;
  addPoint: number;
  list: OrderLineView[];
  review?: boolean;
  // 관리자가 교환 요청을 반려한 사유
  exchangeRejected?: string;
};
