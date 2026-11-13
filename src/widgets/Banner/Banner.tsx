'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'pixelarticons/react';
import { vars } from '@/styles/theme.css';
import * as s from './banner.css';

// 관리자 배너가 하나도 없을 때 보이는 기본 배너
const FALLBACK = ['/images/event/event1.png', '/images/event/event2.png', '/images/event/event3.png', '/images/event/event4.png'];
// 점(캡슐) 윗부분 색: 순서대로 돌아가며 칠한다
const TINT = [vars.status.new, vars.status.hot, vars.status.reserve, vars.status.event, vars.color.blue1];

// 디자인 캔버스 ShopHome / ShopHomeMobile: 가로 스크롤 + scroll-snap 한 줄. 웹은 점·화살표로, 모바일은 밀어서 넘긴다
// banners: 관리자 배너 관리에서 게시 중인 배너 (노출 순서대로)
export default function Banner({ banners }: { banners: { image: string; link: string }[] }) {
  const items = banners.length ? banners : FALLBACK.map((image) => ({ image, link: '' }));
  const n = items.length;
  const track = useRef<HTMLDivElement>(null);
  const [cur, setCur] = useState(0);

  const go = (k: number) => {
    const el = track.current;
    if (!el) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollTo({ left: ((k + n) % n) * el.clientWidth, behavior: still ? 'auto' : 'smooth' });
  };
  const onScroll = () => {
    const el = track.current;
    if (el) setCur(Math.round(el.scrollLeft / (el.clientWidth || 1)));
  };
  const pad = (v: number) => String(v).padStart(2, '0');

  return (
    <section aria-roledescription='carousel' aria-label='배너' className={s.wrap}>
      <div ref={track} className={s.track} onScroll={onScroll}>
        {items.map((b, i) => {
          const img = (
            <Image src={b.image} alt='' fill sizes='(max-width: 1023px) 100vw, 1072px' priority={i === 0} className={s.img} />
          );
          const label = `배너 ${i + 1} / ${n}`;
          return b.link ? (
            <Link key={i} href={b.link} aria-label={label} className={s.slide}>
              {img}
            </Link>
          ) : (
            <div key={i} role='group' aria-roledescription='slide' aria-label={label} className={s.slide}>
              {img}
            </div>
          );
        })}
      </div>

      <div className={s.controls}>
        <div role='group' aria-label='배너 선택' className={s.dots}>
          {items.map((_, i) => (
            <button
              key={i}
              type='button'
              className={s.dot}
              onClick={() => go(i)}
              aria-label={`배너 ${i + 1} 보기`}
              aria-current={i === cur}
            >
              <svg viewBox='0 0 8 8' shapeRendering='crispEdges' aria-hidden className={s.capsule}>
                <path d='M2 0h4v1H2zM1 1h6v1H1zM0 2h8v2H0z' fill={TINT[i % TINT.length]} />
                <path d='M0 4h8v2H0zM1 6h6v1H1zM2 7h4v1H2z' fill={vars.slate[100]} />
              </svg>
            </button>
          ))}
        </div>
        <div className={s.arrows}>
          <span aria-live='polite' className={s.counter}>
            {pad(cur + 1)} / {pad(n)}
          </span>
          <button type='button' className={s.arrow} onClick={() => go(cur - 1)} aria-label='이전 배너'>
            <ChevronLeft width={20} height={20} aria-hidden />
          </button>
          <button type='button' className={s.arrow} onClick={() => go(cur + 1)} aria-label='다음 배너'>
            <ChevronRight width={20} height={20} aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
