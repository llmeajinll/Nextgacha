import type { ReactNode } from 'react';
import * as s from './pageHeader.css';

// 관리자 화면 맨 위 제목 블록: 영문 eyebrow + 제목 + 설명, 오른쪽에 action(버튼), 위에 top(뒤로 가기 링크)
export default function PageHeader({
  eyebrow,
  title,
  description,
  action,
  top,
}: {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  top?: ReactNode;
}) {
  return (
    <section className={s.section}>
      <div className={s.text}>
        {top}
        <span className={s.eyebrow}>{eyebrow}</span>
        <h1 className={s.title}>{title}</h1>
        {description && <p className={s.description}>{description}</p>}
      </div>
      {action}
    </section>
  );
}
