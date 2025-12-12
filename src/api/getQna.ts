export default async function getQna(num: string) {
  const data = await fetch(`/api/getQna?num=${num}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      const data = res.json();
      console.log('getQna Api', data);
      return data;
    })
    .catch((err) => {
      console.log('fetch getQna error:', err);
      return null;
    });

  // console.log('header user:', data);

  return data;
}
