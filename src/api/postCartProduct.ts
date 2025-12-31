export default async function postCartProduct({ data }: { data: number[] }) {
  // console.log('postLike data input:', data);

  const result = await fetch(`/api/postCartProduct`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      //   console.log(res);
      return res;
    })
    .catch((err) => {
      console.log('fetch postCartProduct error:', err);
      return null;
    });

  const product = await result?.json();
  //   console.log('postCartProduct product:', product);

  return product.data;
}
