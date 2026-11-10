'use client';

import RcPagination from 'rc-pagination';
import ko from 'rc-pagination/es/locale/ko_KR';
import { pagination, wrap } from './pagination.css';

type Props = {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  // 바깥 여백용 (nav에 붙음)
  className?: string;
};

// 한 페이지에 다 들어가면 그리지 않는다
export default function Pagination({ current, total, pageSize, onChange, className }: Props) {
  if (total <= pageSize) return null;
  return (
    <nav aria-label='페이지' className={className ? `${wrap} ${className}` : wrap}>
      <RcPagination locale={ko} className={pagination} current={current} total={total} pageSize={pageSize} onChange={onChange} />
    </nav>
  );
}
