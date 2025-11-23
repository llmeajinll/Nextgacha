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
  list: {
    name: string;
    count: number;
  }[];
};
