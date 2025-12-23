'use server';

export async function postCartAction(data: any) {
  console.log(data);
  const result = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/protected/postCart`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
    .then((res) => {
      console.log('postCartAction res:', res);
      return res;
    })
    .catch((err) => {
      console.log(err);
    });

  console.log(result);
  return result;
}
