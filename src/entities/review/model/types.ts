export interface ReviewProps {
  orderId: string;
  user: string;
  list: { count: number; name: string }[];
  created_at: string;
  rate: number;
  content: string;
  purchasDate: string;
}
