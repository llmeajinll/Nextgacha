// 관리자 문의 답변 화면에서 쓰는 문의 한 건 (상품 문서의 qna 배열을 펼친 것)
export type QnaMessage = { writer: 'user' | 'master'; content: string; created_at: string };

export type AdminQna = {
  num: number; // 상품 번호
  product: string;
  qna_num: number;
  writer: string; // 닉네임, 없으면 마스킹한 이메일
  question: string;
  secret: boolean;
  created_at: string;
  request: QnaMessage[];
};

// 마지막 메시지가 관리자 답변이 아니면 답변 대기 (고객이 추가 질문을 남기면 다시 대기)
export const isWaiting = (q: Pick<AdminQna, 'request'>) => q.request.at(-1)?.writer !== 'master';

export const ANSWER_MIN = 10;
export const ANSWER_MAX = 1000;
