export default async function postLike({
  status,
  num,
}: {
  status: boolean;
  num: number;
}) {
  console.log('postLike data input:', status, num);
  const data = { status, num };
  const result = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/postLike`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.log('fetch postLike error:', err);
      return null;
    });

  console.log('postLike data:', result);
  return result;
}
