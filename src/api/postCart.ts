export async function postCart(data: any) {
  console.log(data);
  const result = await fetch(`/api/postCart`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      console.log('postCartAction res:', res);
      return res;
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(result);
  return result;
}
