export default async function getQna(num: string) {
  const data = await fetch(`/api/getQna?num=${num}`, {
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
      console.error('fetch getQna error:', err);
      return null;
    });


  return data;
}
