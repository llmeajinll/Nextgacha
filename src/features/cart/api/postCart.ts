export async function postCart(data: { num: number; updatedArray: { name: string; count: number }[] }) {
  const result = await fetch(`/api/protected/postCart`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.error(err);
      return { message: '로그인 후에 장바구니 추가가 가능합니다.' };
      // alert('로그인 후에 장바구니 추가가 가능합니다.');
    });

  return result;
}
