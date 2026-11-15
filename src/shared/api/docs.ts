// MongoDB 문서 타입. 컬렉션에 제네릭으로 주면 $pull/$push 같은 갱신 연산과 find 결과가 타입 검사된다.
export type Stock = { name: string; count: number };
export type CartLine = { num: number; product: Stock[] };

export type CartDoc = { user: string; cart: CartLine[] };

export type UserDoc = {
  email: string;
  nickname?: string | null;
  address?: string;
  like?: number[];
  keep?: CartLine[];
  point?: number;
  qna?: unknown[];
  review?: unknown[];
  created_at?: string;
  lastSeen?: unknown;
};

export type OrderDoc = {
  customer: string;
  email: string;
  orderId: string;
  list: CartLine[];
  address: string;
  status: string;
  courier: string;
  invoice: string;
  totalPrice: number;
  addPoint: number;
  usedPoint?: number;
  created_at: string;
  arrivedDate: string;
  review: boolean;
  deviceId: string | null;
  ip: string | null;
  reason?: string;
  refundedDate?: string;
};

export type ReviewDoc = {
  num: number;
  review: {
    created_at: string;
    purchaseDate: string;
    list: Stock[];
    user: string;
    content: string;
    orderId: string;
    rate: number;
  }[];
};

export type QnaMessage = { writer: string; content?: string; created_at?: string };
export type QnaItem = {
  qna_num: number;
  email: string;
  secret?: boolean;
  question?: string;
  created_at?: string;
  updated_at?: string;
  request?: QnaMessage[];
};
export type QnaDoc = { num: number; qna: QnaItem[] };

// 문서 하나(_id 'menu')에 헤더 카테고리 메뉴 전체를 저장
export type CategoryDoc = {
  _id: string;
  character: string[];
  ani: string[];
  series: { company: string; name: string; items: string[] }[];
  groups?: { name: string; items: string[] }[];
};
