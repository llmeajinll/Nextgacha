import Link from 'next/link';
import { count as countStyle, tab, tabOn } from './countTab.css';

// 건수가 붙은 탭 링크 (관리자 주문 상태, 오류 처리 상태)
export default function CountTab({
  href,
  label,
  count,
  active,
}: {
  href: string;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <Link href={href} aria-current={active ? 'page' : undefined} className={active ? `${tab} ${tabOn}` : tab}>
      {label}
      <span className={countStyle}>{count}</span>
    </Link>
  );
}
