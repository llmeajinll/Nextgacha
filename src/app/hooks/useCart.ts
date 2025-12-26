import { ProductProps } from '@/shared/type';
import Cookies from 'js-cookie';
import updateCart from '@/api/updateCart';
import { useRouter } from 'next/navigation';

export default function useCart() {
  const router = useRouter();

  const increase = async (props: ProductProps) => {
    console.log('increase props: ', props);
    const limitCount = props.limit.count >= 5 ? 5 : props.limit.count;
    const count = limitCount - props.count;

    console.log('count : ', count);

    if (count > 0) {
      // plus cart api 호출
      const result = await updateCart({
        preset: 'increase',
        code: props.code,
      }).then((res) => {
        console.log('router refresh after increase');
        return res;
      });
      console.log('increase result: ', await result);
      router.refresh();
    } else {
      alert('더 이상 추가할 수 없습니다.');
    }
  };

  const decrease = async (props: ProductProps) => {
    console.log('decrease props: ', props);

    if (props.count > 1) {
      // decrease cart api 호출
      const result = await updateCart({
        preset: 'decrease',
        code: props.code,
      }).then((res) => {
        return res;
      });
      console.log('decrease result: ', await result);
      router.refresh();
    } else if (props.count === 1) {
      // erase cart api 호출
      if (window.confirm('삭제하시겠습니까?')) {
        const result = await updateCart({
          preset: 'erase',
          code: props.code,
        }).then((res) => {
          return res;
        });
        console.log('decrease erase result: ', await result);
        router.refresh();
      }
    } else {
      alert('error');
    }
  };

  const erase = async (props: ProductProps) => {
    console.log('erase code: ', props.code);

    const result = await updateCart({
      preset: 'erase',
      code: props.code,
    }).then((res) => {
      return res;
    });
    console.log('decrease result: ', await result);
    router.refresh();
    return result;
  };

  return { increase, decrease, erase };
}
