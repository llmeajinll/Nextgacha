export default async function getHistory(email: string) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/getHistory?email=${email}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.log('fetch getHistory error:', err);
      return null;
    });

  // console.log('header user:', data);

  return data;
}
