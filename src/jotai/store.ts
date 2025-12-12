import { atom } from 'jotai';
import { ProductProps } from '@/shared/type';
import Cookie from 'js-cookie';

export const tempCartAtom = atom<ProductProps[]>([]);

export const addToTempCartAtom = atom(
  null,
  (get, set, newItem: ProductProps) => {
    console.log('newItem:', newItem);
    //jotai
    const cart = get(tempCartAtom);
    const cartIndex = cart.findIndex((item) => item.code === newItem.code);
    const cartProduct = cart.find((val: any) => val.code === newItem.code);

    console.log(
      'jotai info | cart:',
      cart,
      'cartIndex:',
      cartIndex,
      'cartProduct:',
      cartProduct
    );

    //cookie
    const cookieCart = JSON.parse(Cookie.get('userInfo') || '').cart;
    //cookie에 해당 num의 index 찾는 변수
    const cookieIndex = cookieCart.findIndex(
      (val: any) => val.num === newItem.num
    );
    //cookieIndex안에 code물건이 있는지
    const cookieProduct = cookieCart[cookieIndex]?.product.find(
      (val: any) => val.code === newItem.code
    );

    const limit =
      newItem.limit.count > 5 || newItem.limit.count === -1
        ? 5
        : newItem.limit.count;

    console.log(
      'cookie info | cookieCart:',
      cookieCart,
      'cookieIndex:',
      cookieIndex,
      'cookieProduct:',
      cookieProduct
    );

    let checkCount = 5;

    if (cookieProduct !== undefined && cartProduct !== undefined) {
      console.log('cookie : O, jotai: O');
      if ((cookieProduct?.count || 0) === 5) checkCount = 0;
      else {
        checkCount = limit - (cookieProduct?.count || 0) - cartProduct.count;
      }
    } else if (cookieProduct !== undefined && cartProduct === undefined) {
      console.log('cookie : O, jotai: X');
      if ((cookieProduct?.count || 0) === 5) checkCount = 0;
      else {
        checkCount = limit - cookieProduct.count;
      }
    } else if (cookieProduct === undefined && cartProduct !== undefined) {
      console.log('cookie : X, jotai: O');

      checkCount = limit - cartProduct.count;
    } else if (cookieProduct === undefined && cartProduct === undefined) {
      console.log('cookie : X, jotai: X');
      checkCount = limit;
    }

    console.log('checkCount: ', checkCount);

    if (cookieProduct !== undefined && cartProduct !== undefined) {
      // if (cookieProduct.count + cart[cartIndex].count >= checkCount) {
      if (newItem.count > checkCount) {
        alert(
          `예비 장바구니에 장바구니에 ${cartProduct.count}개, 장바구니에 ${cookieProduct.count}개, 담을 수 있는 물량은 ${checkCount}개 입니다.`
        );
      } else {
        const updated = cart.map((item) =>
          item.code === newItem.code ? { ...item, count: item.count + 1 } : item
        );
        set(tempCartAtom, updated);
      }
    } else if (cookieProduct !== undefined && cartProduct === undefined) {
      // if (cookieProduct.count >= checkCount) {
      if (newItem.count > checkCount) {
        alert(
          `장바구니에 ${cookieProduct.count}개, 담을 수 있는 물량은 ${checkCount}개 입니다.`
        );
      } else {
        set(tempCartAtom, [...cart, newItem]);
      }
    } else if (cookieProduct === undefined && cartProduct !== undefined) {
      // if (cart[cartIndex].count >= checkCount) {
      if (newItem.count > checkCount) {
        alert(
          `예비 장바구니에 ${cart[cartIndex].count}개, 담을 수 있는 물량은 ${checkCount}개 입니다.`
        );
      } else {
        const updated = cart.map((item) =>
          item.code === newItem.code ? { ...item, count: item.count + 1 } : item
        );
        set(tempCartAtom, updated);
      }
    } else if (cookieProduct === undefined && cartProduct === undefined) {
      // if (cart[cartIndex].count >= checkCount) {
      if (newItem.count > checkCount) {
        alert(
          `예비 장바구니, 장바구니 모두 없습니다. 담을 수 있는 물량은 ${checkCount}개 입니다.`
        );
      } else {
        set(tempCartAtom, [...cart, newItem]);
      }
    }
  }
);

export const minusToTempCartAtom = atom(
  null,
  (get, set, newItem: ProductProps) => {
    const cart = get(tempCartAtom);

    console.log('newItem: ', newItem);
    const index = cart.findIndex((item) => item.code === newItem.code);

    if (index !== -1) {
      // 이미 있으면 count 감소
      if (cart[index].count === 1) {
        if (window.confirm('삭제하시겠습니까?')) {
          // 없으면 삭제
          const updated = cart.filter((item) => item.code !== newItem.code);
          set(tempCartAtom, updated);
        }
      } else {
        const updated = cart.map((item) =>
          item.code === newItem.code ? { ...item, count: item.count - 1 } : item
        );
        set(tempCartAtom, updated);
      }
    } else {
      alert('error');
    }
  }
);

export const deleteTempCartAtom = atom(null, (get, set, code: string) => {
  const cart = get(tempCartAtom);
  const updated = cart.filter((item) => item.code !== code);
  set(tempCartAtom, updated);
});
