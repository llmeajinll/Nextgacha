
export default async function getProducts(props: {
  tag?: string;
  search?: string;
  count?: number;
  page?: number;
  // 옵션 이름으로 거르기 (비우면 전체)
  filter?: string;
  // 관리자 화면: 품절·마감 후 숨김 상품도 받고, 할인은 저장된 값 그대로 (기간 판정 전)
  admin?: boolean;
}) {
  const { tag, search, count, page, filter, admin } = props;
  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (search) params.set('search', search);
  if (count) params.set('count', String(count));
  if (page) params.set('page', String(page));
  if (filter) params.set('filter', filter);
  if (admin) params.set('admin', '1');
  const data = await fetch(`/api/getProduct?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      const result = await res.json();
      if (result) {
        return result;
      }
      return [];
    })
    .catch((err) => {
      console.error('fetch getDetailProduct error:', err);
      return { data: [], total: 0 };
    });


  return data;
}
