export default async function getLike(like: number[]) {
  console.log(like);
  const result = await fetch(`/api/getLike`, {
    method: 'POST',
    body: JSON.stringify(like),
  })
    .then((res) => {
      console.log(res);
      if (res.ok === true) {
        return res.json();
      } else {
        return [];
      }
    })
    .catch((err) => {
      console.log('fetch postLike error:', err);
      return null;
    });

  console.log('postLike data:', result);
  return result;
}
