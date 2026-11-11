// 관리자 회원 목록 한 줄
export type AdminUser = {
  id: string;
  nickname: string;
  email: string;
  point: number;
  created_at: string; // koreaTime() 'YYYY-MM-DD HH:mm:ss' (KST)
  orders: number; // 환불 뺀 주문 수
  spent: number; // 환불 뺀 결제 합계
  admin: boolean;
};

// 회원 상세 패널 (고른 회원만 따로 불러옴)
export type AdminUserDetail = {
  address: string;
  reviews: number;
  qna: number;
  likes: number;
  // 장바구니 + 진행 중 주문(확인중·배송중)을 옵션별로 합친 수량. 같은 옵션은 최대 5개
  keep: { num: number; title: string; name: string; count: number }[];
  recent: { orderId: string; created_at: string; status: string; totalPrice: number }[];
};
