'use client';

import { Search } from 'pixelarticons/react';
import { DropDown, PageHeader } from '@/shared/ui';
import useDiscountEvent, { type EventFilter } from '../../model/useDiscountEvent';
import EventList from './EventList';
import DiscountPanel from './DiscountPanel';
import * as s from './eventBoard.css';

const TABS: { key: EventFilter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'on', label: '할인 중' },
  { key: 'off', label: '할인 없음' },
];

export default function EventBoard() {
  const ev = useDiscountEvent();

  return (
    <div className={s.container}>
      <PageHeader
        eyebrow='EVENTS'
        title='이벤트 관리'
        description='여러 상품에 할인을 한 번에 걸거나 내려요. 고른 상품은 다른 카테고리로 옮겨 가도 그대로 남아 있어요.'
      />

      <div className={s.toolbar}>
        <DropDown
          label={ev.group}
          value={ev.group}
          placeholder='전체 카테고리'
          options={ev.groupOptions}
          onSelect={(v) => {
            ev.setGroup(v);
            ev.setPage(1);
          }}
          className={s.groupDrop}
        />
        <label className={`${s.search} ${s.searchGrow}`}>
          <Search aria-hidden />
          <input
            type='search'
            value={ev.query}
            onChange={(e) => {
              ev.setQuery(e.target.value);
              ev.setPage(1);
            }}
            aria-label='상품명 검색'
            placeholder='상품명 검색'
            className={s.searchInput}
          />
        </label>
        <div role='group' aria-label='할인 상태로 거르기' className={s.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type='button'
              aria-pressed={ev.filter === t.key}
              className={ev.filter === t.key ? `${s.tab} ${s.tabOn}` : s.tab}
              onClick={() => {
                ev.setFilter(t.key);
                ev.setPage(1);
              }}
            >
              {t.label}
              <span className={s.tabCount}>{ev.counts[t.key]}</span>
            </button>
          ))}
        </div>
      </div>

      {ev.toast && (
        <div role='status' className={s.saved}>
          {ev.toast}
        </div>
      )}

      <div className={s.layout}>
        <EventList ev={ev} />
        <DiscountPanel ev={ev} />
      </div>
    </div>
  );
}
