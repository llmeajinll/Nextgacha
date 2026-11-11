'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Plus, Search, Upload } from 'pixelarticons/react';
import { Pagination, ToggleBtn } from '@/shared/ui';
import { checkbox } from '@/styles/variants.css';
import { BANNER_STATUS_LABEL, statusOf, todayKst, type Banner, type BannerStatus } from '@/entities/banner/model/types';
import { isSafeLink, TITLE_MAX } from '../lib/parseBannerForm';
import { deleteBanner, orderBanners, saveBanner } from '../api/bannerActions';
import * as s from './bannerManager.css';

const PAGE = 6;
type Tab = BannerStatus | 'all';
const TABS: { key: Tab; label: string }[] = [
  { key: 'live', label: '게시 중' },
  { key: 'soon', label: '예약' },
  { key: 'hidden', label: '숨김' },
  { key: 'ended', label: '종료' },
  { key: 'all', label: '전체' },
];

type Draft = Omit<Banner, 'order'> & { file: File | null };

const dot = (v: string) => v.replace(/-/g, '.');
const periodOf = (b: Pick<Banner, 'start' | 'end'>) => `${dot(b.start)} ~ ${b.end ? dot(b.end) : '계속'}`;
const blank = (today: string): Draft => ({ id: '', title: '', link: '', image: '', start: today, end: '', visible: true, file: null });

export default function BannerManager({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  // 렌더마다 날짜가 바뀌지 않게 첫 렌더 기준
  const [today] = useState(() => todayKst());
  const [tab, setTab] = useState<Tab>('live');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [tried, setTried] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // 고른 파일 미리보기 (바뀌거나 사라지면 URL 해제)
  const file = draft?.file;
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file]);
  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const q = query.trim().toLowerCase();
  const inTab = (b: Banner, k: Tab) => k === 'all' || statusOf(b, today) === k;
  const shown = banners.filter((b) => inTab(b, tab)).filter((b) => !q || b.title.toLowerCase().includes(q));
  const last = Math.max(Math.ceil(shown.length / PAGE), 1);
  const cur = Math.min(page, last);
  // 순서는 종료되지 않은 배너끼리만 바꾼다. 검색 중이거나 종료 탭에서는 끔
  const canOrder = !q && tab !== 'ended';
  const live = banners.filter((b) => statusOf(b, today) !== 'ended');

  const isNew = !!draft && !draft.id;
  const titleBad = tried && !draft?.title.trim();
  const linkBad = tried && !!draft && !isSafeLink(draft.link.trim());
  const dateBad = !!draft && !!draft.end && draft.end < draft.start;
  const imageBad = tried && isNew && !draft?.file;
  const edStatus: BannerStatus | 'draft' = !draft ? 'draft' : isNew ? 'draft' : statusOf(draft, today);

  const open = (b: Banner) => {
    setDraft({ ...b, file: null });
    setTried(false);
    setConfirmDelete(false);
    setError('');
    setToast('');
  };

  const run = async (job: () => Promise<void>, message: string, close = true) => {
    setSending(true);
    setError('');
    try {
      await job();
      setToast(message);
      if (close) setDraft(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : '반영하지 못했어요.');
    } finally {
      setSending(false);
    }
  };

  const save = () => {
    if (!draft) return;
    setTried(true);
    if (!draft.title.trim() || !isSafeLink(draft.link.trim()) || dateBad || (isNew && !draft.file)) return;
    const fd = new FormData();
    if (draft.id) fd.set('id', draft.id);
    fd.set('title', draft.title);
    fd.set('link', draft.link);
    fd.set('start', draft.start);
    fd.set('end', draft.end);
    fd.set('visible', String(draft.visible));
    if (draft.file) fd.set('image', draft.file);
    run(() => saveBanner(fd), isNew ? `“${draft.title.trim()}” 배너를 만들었어요.` : '저장했어요. 쇼핑몰에 바로 반영돼요.');
  };

  // 종료되지 않은 배너 사이에서 한 칸 옮기고, 전체 순서를 다시 보냄
  const move = (b: Banner, dir: -1 | 1) => {
    const i = live.findIndex((x) => x.id === b.id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= live.length) return;
    const next = [...live];
    [next[i], next[j]] = [next[j], next[i]];
    const ids = [...next, ...banners.filter((x) => statusOf(x, today) === 'ended')].map((x) => x.id);
    run(() => orderBanners(ids), '노출 순서를 바꿨어요.', false);
  };

  const shownImage = preview || draft?.image;

  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <div className={s.titleText}>
          <span className={s.eyebrow}>BANNERS</span>
          <h1 className={s.title}>배너 관리</h1>
          <p className={s.subText}>쇼핑몰 메인 상단에 돌아가는 배너예요. 목록에서 고른 뒤 오른쪽에서 이미지·링크·게시 기간을 바꿔요.</p>
        </div>
        <button
          type='button'
          className={s.addBtn}
          onClick={() => {
            setDraft(blank(today));
            setTried(false);
            setConfirmDelete(false);
            setError('');
            setToast('');
          }}
        >
          <Plus aria-hidden />
          ADD BANNER
        </button>
      </section>

      {toast && (
        <div role='status' className={s.toast}>
          {toast}
        </div>
      )}

      <div className={s.toolbar}>
        <div role='group' aria-label='배너 상태' className={s.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type='button'
              aria-pressed={tab === t.key}
              className={s.tab}
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
            >
              {t.label}
              <span className={s.tabCount}>{banners.filter((b) => inTab(b, t.key)).length}</span>
            </button>
          ))}
        </div>
        <label className={s.search}>
          <Search aria-hidden />
          <input
            type='search'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            aria-label='배너 이름 검색'
            placeholder='배너 이름 검색'
            className={s.searchInput}
          />
        </label>
      </div>

      <div className={s.layout}>
        <section aria-label='배너 목록' className={s.listCol}>
          <div className={s.panel}>
            <div className={s.panelHead}>
              <span className={s.muted}>
                {shown.length
                  ? `전체 ${shown.length}개 중 ${(cur - 1) * PAGE + 1}–${Math.min(cur * PAGE, shown.length)}`
                  : '배너 0개'}
              </span>
              {canOrder && shown.length > 1 && <span className={s.hint}>위·아래 버튼으로 쇼핑몰 노출 순서를 바꿔요</span>}
            </div>
            {shown.slice((cur - 1) * PAGE, cur * PAGE).map((b) => {
              const k = statusOf(b, today);
              const i = live.findIndex((x) => x.id === b.id);
              return (
                <div key={b.id} className={draft?.id === b.id ? `${s.row} ${s.rowOn}` : s.row}>
                  <span className={s.no}>{i >= 0 ? String(i + 1).padStart(2, '0') : '—'}</span>
                  <button
                    type='button'
                    aria-pressed={draft?.id === b.id}
                    aria-label={`${b.title} 수정`}
                    className={s.pick}
                    onClick={() => open(b)}
                  >
                    <Image
                      src={b.image || '/images/defaultImg.png'}
                      alt=''
                      width={112}
                      height={37}
                      className={k === 'ended' || k === 'hidden' ? `${s.thumb} ${s.dim}` : s.thumb}
                    />
                    <span className={s.rowText}>
                      <span className={s.rowTitleLine}>
                        <span className={s.rowTitle}>{b.title}</span>
                        <span className={s.statusTag[k]}>{BANNER_STATUS_LABEL[k]}</span>
                      </span>
                      <span className={s.muted}>{periodOf(b)}</span>
                      <span className={s.rowLink}>{b.link || '링크 없음'}</span>
                    </span>
                  </button>
                  {canOrder && k !== 'ended' && (
                    <span className={s.orderBtns}>
                      <button
                        type='button'
                        aria-label={`${b.title} 위로 이동`}
                        title='위로 이동'
                        disabled={sending || i <= 0}
                        className={s.iconBtn}
                        onClick={() => move(b, -1)}
                      >
                        <ArrowUp aria-hidden />
                      </button>
                      <button
                        type='button'
                        aria-label={`${b.title} 아래로 이동`}
                        title='아래로 이동'
                        disabled={sending || i >= live.length - 1}
                        className={s.iconBtn}
                        onClick={() => move(b, 1)}
                      >
                        <ArrowDown aria-hidden />
                      </button>
                    </span>
                  )}
                </div>
              );
            })}
            {shown.length === 0 && (
              <div className={s.empty}>
                {q ? '검색어에 맞는 배너가 없어요.' : `${TABS.find((t) => t.key === tab)!.label} 배너가 없어요.`}
              </div>
            )}
          </div>
          <Pagination current={cur} total={shown.length} pageSize={PAGE} onChange={setPage} />
        </section>

        <section aria-label='배너 수정' className={s.editor}>
          {!draft ? (
            <div className={s.noPick}>왼쪽에서 배너를 고르거나 ADD BANNER로 새로 만들어요.</div>
          ) : (
            <>
              <div className={s.editorHead}>
                <h2 className={s.editorTitle}>{isNew ? '새 배너 만들기' : '배너 수정'}</h2>
                <span className={edStatus === 'draft' ? s.draftTag : s.statusTag[edStatus]}>
                  {edStatus === 'draft' ? '작성 중' : BANNER_STATUS_LABEL[edStatus]}
                </span>
              </div>
              <div className={s.editorBody}>
                <div className={s.preview}>
                  {shownImage ? (
                    // 쇼핑몰 메인과 같은 비율(1312 × 439)
                    <Image src={shownImage} alt='배너 미리보기' fill sizes='520px' unoptimized={!!draft.file} className={s.previewImg} />
                  ) : (
                    <span className={s.previewEmpty}>{draft.title || '배너 미리보기'}</span>
                  )}
                  <span className={s.sizeText}>1312 × 439</span>
                </div>

                <label className={imageBad ? `${s.slot} ${s.slotError}` : s.slot}>
                  <span className={s.slotKind}>
                    <Upload aria-hidden />
                    {draft.file || draft.image ? '이미지 바꾸기' : '이미지 올리기'}
                  </span>
                  <span className={s.slotFile}>{draft.file?.name ?? (draft.image ? '지금 이미지 사용 중' : '이미지를 올려 주세요')}</span>
                  <span className={s.hint}>1312 × 439 권장 · JPG, PNG · 4MB 이하</span>
                  <input
                    type='file'
                    accept='image/*'
                    aria-label='배너 이미지 선택'
                    className={s.fileInput}
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setDraft({ ...draft, file: f });
                    }}
                  />
                </label>
                {imageBad && (
                  <span role='status' className={s.errorText}>
                    배너 이미지를 올려 주세요.
                  </span>
                )}

                <label className={s.field}>
                  <span className={s.label}>
                    관리용 이름 <span className={s.required}>*</span>
                  </span>
                  <input
                    type='text'
                    value={draft.title}
                    maxLength={TITLE_MAX}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    placeholder='예: 11월 신규 입고'
                    aria-invalid={titleBad}
                    className={titleBad ? `${s.input} ${s.inputError}` : s.input}
                  />
                  {titleBad && (
                    <span role='status' className={s.errorText}>
                      이름을 입력해 주세요.
                    </span>
                  )}
                </label>

                <label className={s.field}>
                  <span className={s.label}>눌렀을 때 이동할 링크</span>
                  <input
                    type='text'
                    value={draft.link}
                    onChange={(e) => setDraft({ ...draft, link: e.target.value })}
                    placeholder='/36/info 또는 /search?type=series'
                    aria-invalid={linkBad}
                    className={linkBad ? `${s.input} ${s.inputError}` : s.input}
                  />
                  <span className={linkBad ? s.errorText : s.hint}>
                    {linkBad ? '쇼핑몰 안 주소만 쓸 수 있어요. /로 시작하게 적어 주세요.' : '비워 두면 눌러도 이동하지 않아요.'}
                  </span>
                </label>

                <div className={s.field}>
                  <span className={s.label}>게시 기간</span>
                  <div className={s.dates}>
                    <input
                      type='date'
                      value={draft.start}
                      onChange={(e) => setDraft({ ...draft, start: e.target.value || today })}
                      aria-label='게시 시작일'
                      className={s.input}
                    />
                    <span className={s.muted}>~</span>
                    <input
                      type='date'
                      value={draft.end}
                      min={draft.start}
                      disabled={!draft.end}
                      onChange={(e) => setDraft({ ...draft, end: e.target.value })}
                      aria-label='게시 종료일'
                      className={dateBad ? `${s.input} ${s.inputError}` : s.input}
                    />
                  </div>
                  <label className={s.checkLabel}>
                    <input
                      type='checkbox'
                      checked={!draft.end}
                      onChange={(e) => setDraft({ ...draft, end: e.target.checked ? '' : draft.start })}
                      className={checkbox}
                    />
                    종료일 없이 계속 게시
                  </label>
                  {dateBad && (
                    <span role='status' className={s.errorText}>
                      종료일이 시작일보다 빨라요.
                    </span>
                  )}
                </div>

                <div className={s.visibleRow}>
                  <span className={s.visibleText}>
                    <span className={s.label}>쇼핑몰에 보이기</span>
                    <span className={s.hint}>끄면 기간 안이어도 숨겨져요.</span>
                  </span>
                  <ToggleBtn value={draft.visible} setValue={(v) => setDraft({ ...draft, visible: v })} label='쇼핑몰에 보이기' />
                </div>

                {error && (
                  <p role='status' className={s.formError}>
                    {error}
                  </p>
                )}

                {confirmDelete ? (
                  <div className={s.confirm}>
                    <span>“{draft.title}” 배너를 지울까요? 되돌릴 수 없어요.</span>
                    <div className={s.actionsRow}>
                      <button type='button' className={s.neutralBtn} onClick={() => setConfirmDelete(false)}>
                        취소
                      </button>
                      <button
                        type='button'
                        className={s.dangerBtn}
                        disabled={sending}
                        onClick={() => run(() => deleteBanner(draft.id), `“${draft.title}” 배너를 지웠어요.`)}
                      >
                        지우기
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={s.actions}>
                    {!isNew && (
                      <button type='button' className={s.deleteBtn} onClick={() => setConfirmDelete(true)}>
                        삭제
                      </button>
                    )}
                    <span className={s.spacer} />
                    <button type='button' className={s.cancelBtn} onClick={() => setDraft(null)}>
                      CANCEL
                    </button>
                    <button type='button' className={s.saveBtn} disabled={sending} onClick={save}>
                      {sending ? 'SAVING…' : 'SAVE'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
