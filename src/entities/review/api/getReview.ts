export default async function getReview(num: string) {
  const data = await fetch(`/api/getReview?num=${num}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      const data = res.json();
      return data;
    })
    .catch((err) => {
      console.error('fetch getReview error:', err);
      return null;
    });


  return data;
}
