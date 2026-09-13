import { notice } from './notice';

export default function useGetNotice({ num }: { num: number }) {
  const result = notice.find((item) => item.num === num);
  const count = notice.length;
  return { result, count };
}
