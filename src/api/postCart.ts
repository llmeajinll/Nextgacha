export async function postCart(data: any) {
  console.log(data);
  const result = await fetch(`/api/protected/postCart`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => {
      console.log('postCartAction res:', res);
      if (res.ok === true) {
        if (
          window.confirm(
            `장바구니에 정상적으로 들어갔습니다.\n장바구니로 이동하시겠습니까?`
          )
        ) {
          window.location.href = '/mypage/cart';
        } else {
          window.location.reload();
        }
      } else {
        alert('로그인 후 장바구니에 담을 수 있습니다.');
      }
      return res.json();
    })
    .catch((err) => {
      console.log(err);
      alert('로그인 후에 장바구니 추가가 가능합니다.');
    });

  console.log(result);
  return result;
}
