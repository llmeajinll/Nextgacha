// 장바구니 + 배송중(keep) + 상품 정보. useCart(장바구니 화면)와 마이페이지 탭 개수가 같은 캐시(['cartData'])를 쓴다
export async function getCart() {
  const res = await fetch('/api/getCart');
  const data = await res.json();
  return data.ok === true ? data.result : [];
}
