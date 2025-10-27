export type ProductProps = {
  code: string;
  name: string;
  title: string;
  count: number;
  price: number;
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
  list: {
    name: string;
    count: number;
  }[];
};
