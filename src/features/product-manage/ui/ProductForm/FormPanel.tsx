import type { ReactNode } from 'react';
import * as s from './productForm.css';

// 상품 폼의 번호 붙은 섹션 틀 (01 기본 정보, 02 가격 …). aside는 제목 줄 오른쪽(개수·토글)
export default function FormPanel({
  no,
  title,
  required,
  aside,
  children,
}: {
  no: string;
  title: string;
  required?: boolean;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className={s.panel}>
      <div className={s.panelHead}>
        <div className={s.panelTitleRow}>
          <span className={s.panelNo}>{no}</span>
          <h2 className={s.panelTitle}>
            {title}
            {required && (
              <>
                {' '}
                <span className={s.required}>*</span>
              </>
            )}
          </h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}
