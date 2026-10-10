import Link from 'next/link';
import { EmptyCard } from '@/shared/ui';

export default function NotFound() {
  return (
    <EmptyCard>
      페이지를 찾을 수 없습니다. <Link href='/'>HOME</Link>
    </EmptyCard>
  );
}
