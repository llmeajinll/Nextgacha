export default async function getHistory() {
  const data = await fetch(`/api/protected/getHistory`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((err) => {
      console.log('fetch getHistory error:', err);
      return null;
    });

  // console.log('header user:', data);

  return data;
}
