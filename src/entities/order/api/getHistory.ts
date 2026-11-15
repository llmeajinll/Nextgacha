export default async function getHistory() {
  const data = await fetch(`/api/protected/getHistory`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error('fetch getHistory error:', err);
      return null;
    });


  return data;
}
