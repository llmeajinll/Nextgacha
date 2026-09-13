export type ProductProps = {
  code: string;
  name: string;
  title: string;
  count: number;
  price: number;
  num: number;
  limit: { name: string; count: number };
};

export type CardProps = {
  company: string;
  title: string;
  image: string[];
  price: number;
  create: string;
  reserve: string;
  _id: string;
  group: string[];
  num: number;
  created_at: string;
  updated_at: string;
  discount: number;
  isDiscount: boolean;
  like: boolean;
  list: {
    name: string;
    count: number;
  }[];
  isLogin?: boolean;
};
