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
};
