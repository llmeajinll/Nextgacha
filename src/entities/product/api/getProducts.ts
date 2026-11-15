
export default async function getProducts(props: {
  tag?: string;
  search?: string;
  count?: number;
  page?: number;
}) {
  const { tag, search, count, page } = props;
  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (search) params.set('search', search);
  if (count) params.set('count', String(count));
  if (page) params.set('page', String(page));
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
