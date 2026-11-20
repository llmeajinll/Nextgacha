import type { CardProps } from '../model/types';

// 찜한 상품 한 페이지. 실패하면 null
export default async function getLike(page: number): Promise<{ likeResult: CardProps[]; total: number } | null> {
  try {
    const res = await fetch(`/api/protected/getLike?page=${page}`);
    const data = await res.json();
    return data.ok === true ? data.result : null;
  } catch (err) {
    console.error('fetch getLike error:', err);
    return null;
  }
}
