import { productColl, userColl } from '@/shared/api/mongodb';
import { CardProps } from '@/entities/product/model/types';

// 상품 목록 조회 (getProduct 라우트 + 서버 컴포넌트 공용). email이 있으면 좋아요 여부 포함
export async function findProducts(props: {
  tag?: string | null;
  search?: string;
  count?: number;
  page?: number;
  filter?: string | null;
  email?: string | null;
}) {
  const { tag, search = '', filter, email } = props;
  // 한 번에 가져올 수 있는 개수 상한 (count=999999로 전체 덤프 방지)
  const count = Math.min(Math.max(props.count || 20, 1), 100);
  const page = Math.max(props.page || 1, 1);

  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

  let query: Record<string, any> = {};

  // 사용자 입력을 정규식 리터럴로 (특수문자로 인한 500 / ReDoS 방지)
  const escapeRegex = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  if (tag === 'new') {
    query = { create: { $gte: twoMonthsAgo } };
  } else if (tag === 'reserve') {
    query = { reserve: { $exists: true, $ne: '' } };
  }
  // all / hot은 전체 조회 (hot 정렬 기준은 아직 없음)

  if (search) {
    const keyword = { $regex: escapeRegex(search), $options: 'i' };
    query.$or = [
      { title: keyword },
      { company: keyword },
      { group: keyword },
      { 'list.name': keyword },
      // 숫자로 검색하면 상품 번호도 매칭
      ...(/^\d+$/.test(search) ? [{ num: Number(search) }] : []),
    ];
  }

  if (filter) {
    query['list.name'] = { $regex: escapeRegex(filter), $options: 'i' };
  }

  const [product, total, user] = await Promise.all([
    productColl
      .find(query)
      .sort({ create: -1 })
      .skip((page - 1) * count)
      .limit(count)
      .toArray(),
    productColl.countDocuments(query),
    email
      ? userColl.findOne({ email }, { projection: { like: 1, _id: 0 } })
      : null,
  ]);

  const likes: number[] = user?.like || [];
  const data = product.map((item) => ({
    ...item,
    like: likes.includes(item.num),
  }));

  // 클라이언트 컴포넌트/JSON으로 넘기므로 ObjectId/Date → string
  return JSON.parse(JSON.stringify({ data, total })) as {
    data: CardProps[];
    total: number;
  };
}
