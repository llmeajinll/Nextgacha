// 관리자 리뷰 모아보기의 리뷰 한 건 (상품 문서의 review 배열을 펼친 것)
export type AdminReview = {
  num: number; // 상품 번호
  product: string;
  image: string; // 상품 대표 이미지, 없으면 ''
  rate: number; // 1~5
  content: string;
  options: string[]; // 주문한 옵션 이름
  created_at: string; // koreaTime() 'YYYY-MM-DD HH:mm:ss' (KST)
  writer: string; // 닉네임, 없으면 마스킹한 이메일
};
