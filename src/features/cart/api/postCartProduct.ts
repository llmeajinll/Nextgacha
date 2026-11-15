export default async function postCartProduct({ data }: { data: number[] }) {

  const result = await fetch(`/api/postCartProduct`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error('fetch postCartProduct error:', err);
      return null;
    });

  const product = await result?.json();

  return product.data;
}
