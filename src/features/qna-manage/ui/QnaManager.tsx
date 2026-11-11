'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Lock, Search } from 'pixelarticons/react';
import postQnaAnswer from '../api/postQnaAnswer';
import { textareaBox, textareaCount, textareaCountError } from '@/styles/ui.css';
import { ANSWER_MAX, ANSWER_MIN, isWaiting, type AdminQna } from '../model/types';
import * as s from './qnaManager.css';

type Tab = 'wait' | 'done' | 'all';
const TABS: { key: Tab; label: string; test: (q: AdminQna) => boolean }[] = [
  { key: 'wait', label: '답변 대기', test: isWaiting },
  { key: 'done', label: '답변 완료', test: (q) => !isWaiting(q) },
  { key: 'all', label: '전체', test: () => true },
];

const TEMPLATES = [
  { label: '인사', text: '안녕하세요, NextGacha입니다. 문의 남겨 주셔서 감사해요.\n', head: true },
  { label: '재입고', text: '재입고 일정이 정해지면 상품 페이지에서 바로 알려 드릴게요.' },
  { label: '옵션 변경', text: '배송 전이라면 옵션(캐릭터)을 바꿔 드릴 수 있어요. 바꿀 캐릭터와 수량을 남겨 주시면 확인 후 처리해 드릴게요.' },
  { label: '배송', text: '주문하신 상품은 확인 후 2~3일 안에 출발해요. 송장이 등록되면 주문 내역에서 확인할 수 있어요.' },
];

// koreaTime()으로 저장된 'YYYY-MM-DD HH:mm:ss' (KST) 문자열
const day = (v: string) => (v ?? '').slice(0, 10).replace(/-/g, '.');
const daysSince = (v: string, now: number) => Math.floor((now - new Date(`${(v ?? '').replace(' ', 'T')}+09:00`).getTime()) / 86400000);
const firstLine = (v: string) => v.split('\n').find((l) => l.trim())?.trim() ?? '';
const keyOf = (q: AdminQna) => `${q.num}-${q.qna_num}`;

export default function QnaManager({ items }: { items: AdminQna[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('wait');
  const [query, setQuery] = useState('');
  const [pick, setPick] = useState('');
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const [draftError, setDraftError] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const [toast, setToast] = useState('');
  // 렌더마다 시각이 바뀌지 않게 첫 렌더 기준
  const [now] = useState(() => Date.now());

  const q = query.trim().toLowerCase();
  const test = TABS.find((t) => t.key === tab)!.test;
  const shown = items
    .filter(test)
    .filter((x) => !q || `${x.product} ${x.question} ${x.writer}`.toLowerCase().includes(q));
  const cur = items.find((x) => keyOf(x) === pick);
  const waiting = cur ? isWaiting(cur) : false;
  const lastAnswer = cur && !waiting ? cur.request.at(-1) : undefined;
  const draft = cur ? (drafts[keyOf(cur)] ?? '') : '';
  const len = draft.trim().length;

  const setDraft = (v: string) => {
    if (!cur) return;
    setDrafts({ ...drafts, [keyOf(cur)]: v });
    setDraftError(false);
  };

  const choose = (x: AdminQna) => {
    setPick(keyOf(x));
    setEditing(false);
    setDraftError(false);
    setSendError('');
    setToast('');
  };

  const submit = async () => {
    if (!cur) return;
    if (len < ANSWER_MIN) {
      setDraftError(true);
      return;
    }
    setSending(true);
    setSendError('');
    try {
      await postQnaAnswer({ num: cur.num, qna_num: cur.qna_num, content: draft.trim(), edit: editing });
      setDrafts({ ...drafts, [keyOf(cur)]: '' });
      setToast(`${editing ? '답변을 수정했어요.' : '답변을 등록했어요.'} 상품 상세 Q&A에 바로 보여요.`);
      setEditing(false);
      router.refresh();
    } catch (e) {
      setSendError(e instanceof Error ? e.message : '답변을 저장하지 못했어요.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={s.container}>
      <div className={s.toolbar}>
        <div role='group' aria-label='답변 상태' className={s.tabs}>
          {TABS.map((t) => (
            <button key={t.key} type='button' aria-pressed={tab === t.key} className={s.tab} onClick={() => setTab(t.key)}>
              {t.label}
              <span className={s.tabCount}>{items.filter(t.test).length}</span>
            </button>
          ))}
        </div>
        <label className={s.search}>
          <Search aria-hidden />
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label='문의 검색'
            placeholder='상품명, 내용, 작성자'
            className={s.searchInput}
          />
        </label>
      </div>

      {toast && (
        <div role='status' className={s.toast}>
          {toast}
        </div>
      )}

      <div className={s.layout}>
        <section aria-label='문의 목록' className={s.list}>
          {shown.map((x) => {
            const wait = isWaiting(x);
            const since = daysSince(x.request.at(-1)?.created_at ?? x.created_at, now);
            return (
              <button
                key={keyOf(x)}
                type='button'
                aria-pressed={keyOf(x) === pick}
                className={s.row}
                onClick={() => choose(x)}
              >
                <span className={s.rowTop}>
                  <span className={wait ? s.waitTag : s.doneTag}>{wait ? '답변 대기' : '답변 완료'}</span>
                  {x.secret && <Lock aria-label='비밀글' className={s.lock} />}
                  {wait && since >= 2 && <span className={s.late}>{since}일째 대기</span>}
                  <span className={s.rowDate}>{day(x.created_at)}</span>
                </span>
                <span className={s.rowTitle}>{firstLine(x.question)}</span>
                <span className={s.rowSub}>
                  <span className={s.rowWriter}>{x.writer}</span>
                  <span aria-hidden>·</span>
                  <span className={s.ellipsis}>{x.product}</span>
                </span>
              </button>
            );
          })}
          {shown.length === 0 && (
            <div className={s.empty}>
              <span className={s.emptyPixel}>NO Q&amp;A</span>
              <span className={s.muted}>
                {tab === 'wait' && !q ? '답변을 기다리는 문의가 없어요.' : '조건에 맞는 문의가 없어요.'}
              </span>
            </div>
          )}
        </section>

        <section aria-label='문의 상세' className={s.detail}>
          {!cur ? (
            <div className={s.noPick}>왼쪽에서 문의를 고르면 여기서 답변할 수 있어요.</div>
          ) : (
            <>
              <div className={s.card}>
                <div className={s.productHead}>
                  <span className={s.productIcon}>
                    <Box aria-hidden />
                  </span>
                  <span className={s.productText}>
                    <span className={s.pixelLabel}>PRODUCT · {cur.num}</span>
                    <span className={s.productName}>{cur.product}</span>
                  </span>
                </div>
                <div className={s.message}>
                  <div className={s.messageHead}>
                    <span className={s.qMark}>Q</span>
                    <h2 className={s.messageTitle}>{firstLine(cur.question)}</h2>
                  </div>
                  <p className={s.messageBody}>{cur.question}</p>
                  <span className={s.messageMeta}>
                    {cur.writer} · {day(cur.created_at)}
                    {cur.secret && ' · 비밀글 (작성자와 관리자만 볼 수 있어요)'}
                  </span>
                </div>
              </div>

              {cur.request.map((m, i) =>
                m.writer === 'master' ? (
                  <div key={i} className={s.answerCard}>
                    <div className={s.messageHead}>
                      <span className={s.aMark}>A</span>
                      <span className={s.answerTitle}>NextGacha 답변</span>
                      <span className={s.rowDate}>{day(m.created_at)}</span>
                    </div>
                    <p className={s.messageBody}>{m.content}</p>
                    {m === lastAnswer && !editing && (
                      <div className={s.answerFoot}>
                        <button
                          type='button'
                          className={s.smallBtn}
                          onClick={() => {
                            setDrafts({ ...drafts, [keyOf(cur)]: m.content });
                            setEditing(true);
                            setDraftError(false);
                          }}
                        >
                          답변 수정
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div key={i} className={s.card}>
                    <div className={s.message}>
                      <div className={s.messageHead}>
                        <span className={s.qMark}>Q</span>
                        <span className={s.answerTitle}>추가 질문</span>
                        <span className={s.rowDate}>{day(m.created_at)}</span>
                      </div>
                      <p className={s.messageBody}>{m.content}</p>
                    </div>
                  </div>
                ),
              )}

              {(waiting || editing) && (
                <div className={s.form}>
                  <div className={s.formHead}>
                    <label htmlFor='qa-answer' className={s.formTitle}>
                      {editing ? '답변 수정' : '답변 쓰기'}
                    </label>
                  </div>
                  <div className={s.templates}>
                    <span className={s.hint}>자주 쓰는 답변 · 누르면 입력칸에 들어가요</span>
                    <div className={s.templateBtns}>
                      {TEMPLATES.map((t) => (
                        <button
                          key={t.label}
                          type='button'
                          className={s.smallBtn}
                          onClick={() => setDraft(t.head ? t.text + draft : (draft ? draft.replace(/\s*$/, '') + '\n' : '') + t.text)}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={textareaBox}>
                    <textarea
                      id='qa-answer'
                      rows={6}
                      maxLength={ANSWER_MAX}
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      aria-invalid={draftError}
                      placeholder='고객에게 보일 답변을 적어 주세요.'
                      className={draftError ? `${s.textarea} ${s.inputError}` : s.textarea}
                    />
                    <span className={draftError ? `${textareaCount} ${textareaCountError}` : textareaCount}>
                      {draft.length}/{ANSWER_MAX}
                    </span>
                  </div>
                  {draftError && (
                    <span role='status' className={s.errorText}>
                      답변을 {ANSWER_MIN}자 이상 적어 주세요.
                    </span>
                  )}
                  {sendError && (
                    <span role='status' className={s.errorText}>
                      {sendError}
                    </span>
                  )}
                  <div className={s.formFoot}>
                    {editing && (
                      <button type='button' className={s.cancelBtn} onClick={() => setEditing(false)}>
                        CANCEL
                      </button>
                    )}
                    <button type='button' className={s.answerBtn} disabled={sending} onClick={submit}>
                      {sending ? 'SAVING…' : 'ANSWER'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
