import getProducts from './getProducts';
import type { CardProps } from '../model/types';

// 관리자 화면용: getProduct는 한 번에 100개까지라 끝까지 넘겨 받는다. 번호 큰(최근 등록) 순
export default async function getAllProducts(): Promise<CardProps[]> {
  const all: CardProps[] = [];
  for (let page = 1; ; page++) {
    const { data = [], total = 0 } = await getProducts({ tag: 'all', count: 100, page });
    all.push(...data);
    if (data.length === 0 || all.length >= total) break;
  }
  return all.sort((a, b) => b.num - a.num);
}
