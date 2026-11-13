'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, ChevronRight, Fire, Folder, Grid3x3, Home, Library, Sparkles, Sunglasses, Video } from 'pixelarticons/react';
import type { CategoryMenu } from '@/entities/product/model/types';
import * as s from './megaMenu.css';

type Section = { key: string; label: string; en: string; Icon: typeof Home; count: number };

const MAIN_CARDS = [
  { tag: '전체 상품', sub: '모든 가챠 한눈에 보기', Icon: Grid3x3, tone: 'all', badge: '' },
  { tag: '인기 상품', sub: '요즘 가장 많이 담는 가챠', Icon: Fire, tone: 'hot', badge: 'HOT' },
  { tag: '신규 상품', sub: '새로 들어온 가챠', Icon: Sparkles, tone: 'new', badge: 'NEW' },
  { tag: '예약 판매', sub: '입고 전에 미리 담기', Icon: Calendar, tone: 'reserve', badge: 'RESERVE' },
] as const;

const enc = encodeURIComponent;

// 가챠 캡슐 모양 도트. 위쪽 색만 tint에 따라 바뀜
const Capsule = ({ i }: { i: number }) => (
  <svg width={16} height={16} viewBox='0 0 8 8' shapeRendering='crispEdges' aria-hidden className={s.tint[i % s.tint.length]}>
    <path d='M2 0h4v1H2zM1 1h6v1H1zM0 2h8v2H0z' fill='currentColor' />
    <path d='M0 4h8v1H0z' className={s.capMid} />
    <path d='M0 5h8v1H0zM1 6h6v1H1zM2 7h4v1H2z' className={s.capLow} />
  </svg>
);

// 카테고리 메가 메뉴: 왼쪽에서 큰 분류를 고르면 오른쪽에 그 분류의 메뉴가 나온다 (hover·포커스·클릭)
export default function MegaMenu({ menu, onClose }: { menu: CategoryMenu; onClose: () => void }) {
  const [current, setCurrent] = useState('main');

  const sections: Section[] = [
    { key: 'main', label: '메인', en: 'MAIN', Icon: Home, count: MAIN_CARDS.length },
    { key: 'character', label: '캐릭터', en: 'CHARACTER', Icon: Sunglasses, count: menu.character.length },
    { key: 'ani', label: '애니메이션', en: 'ANIMATION', Icon: Video, count: menu.ani.length },
    {
      key: 'series',
      label: '시리즈',
      en: 'SERIES',
      Icon: Library,
      count: menu.series.reduce((n, m) => n + m.items.length, 0),
    },
    ...menu.groups.map((g) => ({ key: `group:${g.name}`, label: g.name, en: 'GROUP', Icon: Folder, count: g.items.length })),
  ];
  const sec = sections.find((v) => v.key === current) ?? sections[0];
  const group = menu.groups.find((g) => `group:${g.name}` === sec.key);

  const grid: { label: string; href: string }[] =
    sec.key === 'character'
      ? menu.character.map((v) => ({ label: v, href: `/search?type=character&detail=${enc(v)}&page=1&filter=전체` }))
      : sec.key === 'ani'
        ? menu.ani.map((v) => ({ label: v, href: `/search?type=ani&detail=${enc(v)}&page=1&filter=전체` }))
        : group
          ? group.items.map((v) => ({ label: v, href: `/search?type=custom&group=${enc(group.name)}&detail=${enc(v)}&page=1&filter=전체` }))
          : [];

  return (
    <div className={s.anchor}>
      <div role='menu' aria-label='카테고리' className={s.menu}>
        <div className={s.inner}>
          <nav aria-label='분류' className={s.sections}>
            {sections.map(({ key, label, Icon, count }) => (
              <button
                key={key}
                type='button'
                className={s.section}
                aria-pressed={key === sec.key}
                onMouseEnter={() => setCurrent(key)}
                onFocus={() => setCurrent(key)}
                onClick={() => setCurrent(key)}
              >
                <Icon width={20} height={20} className={s.sectionIcon} aria-hidden />
                <span className={s.sectionLabel}>{label}</span>
                <span className={s.sectionCount}>{count}</span>
              </button>
            ))}
          </nav>

          <div className={s.panel}>
            <div className={s.panelHead}>
              <span className={s.panelTitle}>
                <span className={s.en}>{sec.en}</span>
                <span className={s.titleText}>{sec.label}</span>
              </span>
              {/* 메인 말고는 "분류 전체"를 보여주는 검색 화면이 없다 */}
              {sec.key === 'main' && (
                <Link href='/search?type=main&tag=전체 상품&page=1' className={s.allLink} onClick={onClose}>
                  {sec.label} 전체 보기
                  <ArrowRight width={14} height={14} aria-hidden />
                </Link>
              )}
            </div>

            {sec.key === 'main' && (
              <div className={s.cards}>
                {MAIN_CARDS.map(({ tag, sub, Icon, tone, badge }) => (
                  <Link key={tag} href={`/search?type=main&tag=${tag}&page=1`} className={s.card} onClick={onClose}>
                    <span className={`${s.cardIcon} ${s.cardTone[tone]}`}>
                      <Icon width={22} height={22} aria-hidden />
                    </span>
                    <span className={s.cardBody}>
                      <span className={s.cardName}>
                        <span className={s.cardTitle}>{tag}</span>
                        {badge && <span className={`${s.badge} ${s.cardTone[tone]}`}>{badge}</span>}
                      </span>
                      <span className={s.cardSub}>{sub}</span>
                    </span>
                    <ChevronRight width={18} height={18} className={s.cardGo} aria-hidden />
                  </Link>
                ))}
              </div>
            )}

            {sec.key !== 'main' && sec.key !== 'series' && (
              <div className={s.items}>
                {grid.map((v, i) => (
                  <Link key={v.label} href={v.href} className={s.item} onClick={onClose}>
                    <Capsule i={i} />
                    <span className={s.itemText}>{v.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {sec.key === 'series' && (
              <div className={s.makers}>
                {menu.series.map((m, i) => (
                  <div key={m.company} className={s.maker}>
                    <span className={`${s.makerHead} ${s.makerTone[i % s.makerTone.length]}`}>
                      <span className={s.makerName}>{m.name}</span>
                      <span className={s.sectionCount}>{m.items.length}</span>
                    </span>
                    {m.items.map((v) => (
                      <Link
                        key={v}
                        href={`/search?type=series&company=${enc(m.company.toLowerCase())}&detail=${enc(v)}&page=1&filter=전체`}
                        className={`${s.item} ${s.seriesItem}`}
                        onClick={onClose}
                      >
                        {v}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
