import { auth } from '@/auth';
import { headers } from 'next/headers';
import { baseUrl } from '@/shared/baseUrl';

export default async function getProducts(props: {
  tag?: string;
  search?: string;
  count?: number;
}) {
  const { tag, search, count } = props;
  const params = new URLSearchParams();
  if (tag) params.set('tag', tag);
  if (search) params.set('search', search);
  if (count) params.set('count', String(count));
  const data = await fetch(`${baseUrl}/api/getProduct?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  } as any)
    .then(async (res) => {
      const result = await res.json();
      console.log(result);
      if (result) {
        return result;
      }
      return [];
    })
    .catch((err) => {
      console.log('fetch getDetailProduct error:', err);
      return { data: [], total: 0 };
    });

  // console.log('header user:', data);

  return data;
}
