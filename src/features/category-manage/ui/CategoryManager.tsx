'use client';

import { useState } from 'react';
import { Close, Trash } from 'pixelarticons/react';
import type { CategoryMenu } from '@/entities/product/model/types';
import { RESERVED_GROUP_NAMES } from '@/entities/product/lib/parseCategoryMenu';
import postCategoryMenu from '../api/postCategoryMenu';
import * as s from './categoryManager.css';

// number는 관리자가 추가한 대분류(menu.groups)의 인덱스
type GroupKey = 'character' | 'ani' | 'series' | number;

// '메인'(전체/인기/신규/예약)은 태그 필터라 편집 대상이 아님
const FIXED_GROUPS: { key: GroupKey; name: string }[] = [
  { key: 'character', name: '캐릭터' },
  { key: 'ani', name: '애니메이션' },
  { key: 'series', name: '시리즈' },
];

const MAX_LEN = 30;

export default function CategoryManager({ initial }: { initial: CategoryMenu }) {
  const [menu, setMenu] = useState(initial);
  const [sel, setSel] = useState<GroupKey>('character');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [dupFor, setDupFor] = useState('');
  const [newMaker, setNewMaker] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // 바꿀 때마다 메뉴 전체를 저장하고, 실패하면 화면을 이전 상태로 되돌림
  const save = async (next: CategoryMenu) => {
    const prev = menu;
    setMenu(next);
    setError('');
    setSaving(true);
    try {
      await postCategoryMenu(next);
    } catch {
      setMenu(prev);
      setError('저장하지 못했어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  };

  const groups = [...FIXED_GROUPS, ...menu.groups.map((g, i) => ({ key: i as GroupKey, name: g.name }))];
  // 저장 실패로 추가한 대분류가 되돌려지면 선택이 사라질 수 있음
  const cur: GroupKey = typeof sel === 'number' && !menu.groups[sel] ? 'character' : sel;

  const itemsOf = (key: GroupKey) =>
    typeof key === 'number' ? menu.groups[key].items : key === 'series' ? [] : menu[key];
  const total = (key: GroupKey) =>
    key === 'series' ? menu.series.reduce((a, m) => a + m.items.length, 0) : itemsOf(key).length;

  const isSeries = cur === 'series';
  const groupName = groups.find((g) => g.key === cur)!.name;
  // 시리즈는 제조사별 묶음, 나머지는 항목 묶음 하나
  const subs = isSeries
    ? menu.series.map((m) => ({ id: m.company, name: m.name, items: m.items }))
    : [{ id: String(cur), name: groupName, items: itemsOf(cur) }];

  const setItems = (id: string, items: string[]) =>
    save(
      isSeries
        ? { ...menu, series: menu.series.map((m) => (m.company === id ? { ...m, items } : m)) }
        : typeof cur === 'number'
          ? { ...menu, groups: menu.groups.map((g, i) => (i === cur ? { ...g, items } : g)) }
          : { ...menu, [cur]: items },
    );

  const addGroup = () => {
    const v = newGroup.trim();
    if (!v || RESERVED_GROUP_NAMES.includes(v) || menu.groups.some((g) => g.name === v)) return;
    setNewGroup('');
    setSel(menu.groups.length);
    save({ ...menu, groups: [...menu.groups, { name: v, items: [] }] });
  };

  const removeGroup = (index: number) => {
    setSel('character');
    save({ ...menu, groups: menu.groups.filter((_, i) => i !== index) });
  };

  const addItem = (id: string, items: string[]) => {
    const v = (drafts[id] ?? '').trim();
    if (!v) return;
    if (items.includes(v)) return setDupFor(id);
    setDrafts({ ...drafts, [id]: '' });
    setItems(id, [...items, v]);
  };

  const addMaker = () => {
    const v = newMaker.trim();
    if (!v || menu.series.some((m) => m.company === v || m.name === v)) return;
    setNewMaker('');
    // 새 제조사는 이름을 그대로 상품 문서의 company 값으로 씀
    save({ ...menu, series: [...menu.series, { company: v, name: v, items: [] }] });
  };

  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <span className={s.eyebrow}>CATEGORIES</span>
        <h1 className={s.title}>카테고리 관리</h1>
        <p className={s.subText}>
          쇼핑몰 헤더의 카테고리 메뉴를 관리해요. 대분류를 고른 뒤 오른쪽에서 항목을 추가하거나 지우세요.
        </p>
      </section>

      <div className={s.columns}>
        <section aria-label='대분류' className={s.groupPanel}>
          <div className={s.panelHead}>
            <h2 className={s.panelTitle}>대분류</h2>
            <span className={s.pixelCount}>{groups.length}</span>
          </div>
          <div className={s.groupList}>
            {groups.map((g) => (
              <button
                key={g.key}
                type='button'
                aria-pressed={g.key === cur}
                className={g.key === cur ? `${s.groupBtn} ${s.groupBtnActive}` : s.groupBtn}
                onClick={() => {
                  setSel(g.key);
                  setDupFor('');
                }}
              >
                <span className={s.groupName}>{g.name}</span>
                <span className={s.groupCount}>{total(g.key)}</span>
              </button>
            ))}
          </div>
          <form
            className={s.panelFoot}
            onSubmit={(e) => {
              e.preventDefault();
              addGroup();
            }}
          >
            <div className={s.addRow}>
              <input
                type='text'
                value={newGroup}
                maxLength={MAX_LEN}
                onChange={(e) => setNewGroup(e.target.value)}
                aria-label='새 대분류 이름'
                placeholder='새 대분류'
                className={s.input}
              />
              <button type='submit' className={s.addBtn} disabled={saving}>
                ADD
              </button>
            </div>
          </form>
        </section>

        <section aria-label={`${groupName} 항목`} className={s.itemPanel}>
          <div className={s.panelHead}>
            <h2 className={s.panelTitle}>{groupName}</h2>
            <div className={s.headRight}>
              <span aria-live='polite' className={saving ? s.muted : s.pixelCount}>
                {saving ? '저장 중…' : total(cur)}
              </span>
              {typeof cur === 'number' && (
                <button
                  type='button'
                  className={`${s.xBtn} ${s.trashBtn}`}
                  aria-label={`${groupName} 대분류 삭제`}
                  title='대분류 삭제'
                  disabled={saving}
                  onClick={() => removeGroup(cur)}
                >
                  <Trash aria-hidden />
                </button>
              )}
            </div>
          </div>

          {error && (
            <p role='alert' className={`${s.errorText} ${s.panelNotice}`}>
              {error}
            </p>
          )}

          {subs.map((sb) => (
            <div key={sb.id} className={s.sub}>
              <div className={s.subBody}>
                {isSeries && (
                  <div className={s.subHead}>
                    <div className={s.subTitleRow}>
                      <span className={s.makerBadge}>MAKER</span>
                      <h3 className={s.subTitle}>{sb.name}</h3>
                      <span className={s.muted}>{sb.items.length}개</span>
                    </div>
                    <button
                      type='button'
                      className={`${s.xBtn} ${s.trashBtn}`}
                      aria-label={`${sb.name} 제조사 삭제`}
                      title='제조사 삭제'
                      disabled={saving}
                      onClick={() => save({ ...menu, series: menu.series.filter((m) => m.company !== sb.id) })}
                    >
                      <Trash aria-hidden />
                    </button>
                  </div>
                )}

                <div className={s.chips}>
                  {sb.items.map((val) => (
                    <span key={val} className={s.chip}>
                      {val}
                      <button
                        type='button'
                        className={s.xBtn}
                        aria-label={`${val} 삭제`}
                        title='삭제'
                        disabled={saving}
                        onClick={() => setItems(sb.id, sb.items.filter((v) => v !== val))}
                      >
                        <Close aria-hidden />
                      </button>
                    </span>
                  ))}
                  {sb.items.length === 0 && <span className={s.empty}>아직 항목이 없어요.</span>}
                </div>
              </div>

              <form
                className={s.panelFoot}
                onSubmit={(e) => {
                  e.preventDefault();
                  addItem(sb.id, sb.items);
                }}
              >
                <div className={s.addRow}>
                  <input
                    type='text'
                    value={drafts[sb.id] ?? ''}
                    maxLength={MAX_LEN}
                    onChange={(e) => {
                      setDrafts({ ...drafts, [sb.id]: e.target.value });
                      setDupFor('');
                    }}
                    aria-label={`${sb.name}에 항목 추가`}
                    aria-invalid={dupFor === sb.id}
                    placeholder={`${sb.name}에 추가할 항목`}
                    className={dupFor === sb.id ? `${s.input} ${s.inputDup}` : s.input}
                  />
                  <button type='submit' className={s.addBtn} disabled={saving}>
                    ADD
                  </button>
                </div>
                {dupFor === sb.id && <span className={s.errorText}>이미 있는 항목이에요.</span>}
              </form>
            </div>
          ))}

          {isSeries && (
            <form
              className={s.panelFoot}
              onSubmit={(e) => {
                e.preventDefault();
                addMaker();
              }}
            >
              <label htmlFor='new-maker' className={s.makerLabel}>
                제조사 추가
              </label>
              <div className={s.addRow}>
                <input
                  id='new-maker'
                  type='text'
                  value={newMaker}
                  maxLength={MAX_LEN}
                  onChange={(e) => setNewMaker(e.target.value)}
                  placeholder='예: [제조사명]'
                  className={s.input}
                />
                <button type='submit' className={s.addBtn} disabled={saving}>
                  ADD MAKER
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
