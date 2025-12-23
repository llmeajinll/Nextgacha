export default async function postLike({ num }: { num: number }) {
  console.log('postLike data input:', num);
  const data = { num };
  const result = await fetch(`/api/protected/updateLike`, {
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

  // console.log('postLike data:', result);
  return result;
}
