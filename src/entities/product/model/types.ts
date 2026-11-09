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

// 쇼핑몰 헤더 카테고리 메뉴 (category 컬렉션 _id 'menu'). series.company는 상품 문서의 company 값
export type CategoryMenu = {
  character: string[];
  ani: string[];
  series: { company: string; name: string; items: string[] }[];
  // 관리자가 추가한 대분류 (캐릭터·애니처럼 항목 목록만 있음)
  groups: { name: string; items: string[] }[];
};
