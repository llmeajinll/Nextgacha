import type { QnaProps } from '../model/types';

// 상품 문의 목록. 실패하면 빈 목록
export default async function getQna(num: string): Promise<QnaProps[]> {
  try {
    const res = await fetch(`/api/getQna?num=${num}`);
    const data = await res.json();
    return data.result.qna;
  } catch (err) {
    console.error(err);
    return [];
  }
}
