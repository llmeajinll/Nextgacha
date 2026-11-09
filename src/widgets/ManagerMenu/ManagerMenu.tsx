import Link from 'next/link';
import { ArrowRight, Box, Bug, ListBox, Truck } from 'pixelarticons/react';
import { MANAGER_MENUS as MENUS } from '@/shared/model/managerMenus';
import * as s from './managerMenu.css';

export type ManagerSummary = {
  todayOrders: number;
  pendingOrders: number;
  onSale: number;
  todayErrors: number;
};

// summary가 null이면(비관리자) 숫자 대신 '-'
export default function ManagerMenu({ summary }: { summary: ManagerSummary | null }) {
  const cards = [
    { label: '오늘 들어온 주문', value: summary?.todayOrders, icon: ListBox, tone: s.tileTone.order },
    { label: '배송 처리 대기', value: summary?.pendingOrders, icon: Truck, tone: s.tileTone.pending },
    { label: '판매 중인 상품', value: summary?.onSale, icon: Box, tone: s.tileTone.product },
    { label: '오늘 오류 신고', value: summary?.todayErrors, icon: Bug, tone: s.tileTone.error },
  ];

  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <span className={s.eyebrow}>DASHBOARD</span>
        <h1 className={s.title}>관리자 홈</h1>
        <p className={s.subText}>오늘 처리할 일을 확인하고 각 관리 메뉴로 이동하세요.</p>
      </section>

      <section aria-label='요약' className={s.summaryGrid}>
        {cards.map((c) => (
          <div key={c.label} className={s.summaryCard}>
            <div className={s.summaryHead}>
              <span className={s.summaryLabel}>{c.label}</span>
              <span className={`${s.iconTile} ${c.tone}`}>
                <c.icon aria-hidden />
              </span>
            </div>
            <span className={s.summaryValue}>{c.value ?? '-'}</span>
          </div>
        ))}
      </section>

      <section aria-labelledby='menu-title'>
        <div className={s.menuHead}>
          <h2 id='menu-title' className={s.menuTitle}>
            관리 메뉴
          </h2>
          <span className={s.pixelMuted}>{MENUS.length} MENUS</span>
        </div>
        <div className={s.cardGrid}>
          {MENUS.map((m, i) => (
            <Link key={m.href} href={m.href} className={s.card}>
              <div className={s.summaryHead}>
                <span className={s.cardIcon}>
                  <m.icon aria-hidden />
                </span>
                <span className={s.pixelMuted}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className={s.cardName}>
                <span className={s.cardEn}>{m.en}</span>
                <span className={s.cardKo}>{m.ko}</span>
              </div>
              <p className={s.cardDesc}>{m.desc}</p>
              <span className={s.cardGo}>
                GO <ArrowRight aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
