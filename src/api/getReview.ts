export default async function getReview(num: string) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/getReview?num=${num}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res) => {
      const data = res.json();
      console.log(data);
      return data;
    })
    .catch((err) => {
      console.log('fetch getHistory error:', err);
      return null;
    });

  // console.log('header user:', data);

  return data;
}
