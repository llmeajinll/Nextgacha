// export type Props1 = {
//   code: string;
//   name: string;
//   title: string;
//   count: number;
//   price: number;
//   num: number;
//   limit: number;
// };

// export type Props2 = {
//   code: string;
//   name: string;
//   title: string;
//   count: number;
//   price: number;
//   num: number;
// };

// type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
// export type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>);

// export type ProductProps = XOR<Props1, Props2>;

export type ProductProps = {
  code: string;
  name: string;
  title: string;
  count: number;
  price: number;
  num: number;
  limit: number;
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
  like: boolean;
  list: {
    name: string;
    count: number;
  }[];
};

export interface ReviewProps {
  _id: string;
  user: string;
  buy: { code: string; count: number; name: string }[];
  created_at: string;
  rate: number;
  title: string;
  num: number;
  purchase_date: string;
}
