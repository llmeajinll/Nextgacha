export default function getUser({ email }: { email: string }) {
  const data = fetch(`/api/getUser?email=${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log('fetch getUser error:', err);
      return null;
    });

  // console.log('header user:', data);

  return data;
}
