import { ProductProps } from '@/shared/type';

export default function useTicket() {
  const increase = (props: ProductProps) => {
    console.log('increase props: ', props);
  };

  const decrease = (props: ProductProps) => {
    console.log('decrease props: ', props);
  };

  const erase = (code: string) => {
    console.log('erase code: ', code);
  };

  return { increase, decrease, erase };
}
