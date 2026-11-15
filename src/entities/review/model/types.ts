export interface ReviewProps {
  orderId: string;
  user: string;
  list: { count: number; name: string }[];
  created_at: string;
  rate: number;
  content: string;
  purchaseDate: string;
  // 서버가 세션으로 계산 (작성자 이메일은 마스킹돼서 내려옴)
  isMine?: boolean;
}
