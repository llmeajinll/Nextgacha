'use client';

import React from 'react';
import { Close } from 'pixelarticons/react';
import * as s from './drawer.css';

// 화면 오른쪽에 붙는 상세 패널. 뒤 목록을 계속 쓸 수 있게 막지 않는다 (모달이 필요하면 ModalPortal)
export default function Drawer({
  label,
  title,
  onClose,
  children,
}: {
  label: string; // 스크린리더용 이름 (예: 회원 상세)
  title: string; // 상단 픽셀 라벨 (예: MEMBER DETAIL)
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <aside aria-label={label} className={s.drawer} onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className={s.head}>
        <span className={s.title}>{title}</span>
        <button type='button' autoFocus aria-label={`${label} 닫기`} title='닫기' className={s.close} onClick={onClose}>
          <Close aria-hidden />
        </button>
      </div>
      <div className={s.body}>{children}</div>
    </aside>
  );
}
