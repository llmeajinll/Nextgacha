'use client';

import React, { useRef, useState } from 'react';
import { Image as ImageIcon } from 'pixelarticons/react';
import { ToggleBtn } from '@/shared/ui';
import { textareaBox, textareaCount } from '@/styles/ui.css';
import { imageLine, NOTICE_CATEGORIES, nowKst, type Notice, type NoticeCategory } from '@/entities/notice/model/types';
import { CONTENT_MAX, hasText, PIN_MAX, TITLE_MAX } from '../lib/parseNoticeForm';
import { deleteNotice, saveNotice, uploadNoticeImage } from '../api/noticeActions';
import * as s from './noticeEditor.css';

type Props = {
  initial?: Notice; // 없으면 새 공지
  pinCount: number; // 이 공지를 뺀, 게시된 고정 공지 수
  onDone: (message: string, num: number | null) => void; // 저장·삭제 후 (삭제면 num null)
  onCancel?: () => void;
};

// 공지 쓰기 폼. 목록 오른쪽 수정 패널과 공지 추가 페이지가 같이 쓴다
export default function NoticeEditor({ initial, pinCount, onDone, onCancel }: Props) {
  const [now] = useState(() => nowKst());
  const isNew = !initial;
  const scheduled = !!initial && initial.state === 'published' && initial.publish_at > now;
  const [category, setCategory] = useState<NoticeCategory>(initial?.category ?? 'notice');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [content, setContent] = useState(initial?.content ?? '');
  const [pinned, setPinned] = useState(initial?.pinned ?? false);
  const [when, setWhen] = useState<'now' | 'later'>(scheduled ? 'later' : 'now');
  const [date, setDate] = useState(scheduled ? initial!.publish_at.slice(0, 10) : now.slice(0, 10));
  const [time, setTime] = useState(scheduled ? initial!.publish_at.slice(11) : '10:00');
  const [tried, setTried] = useState<'draft' | 'publish' | ''>('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');
  const area = useRef<HTMLTextAreaElement>(null);

  const at = `${date} ${time}`;
  const pinFull = !initial?.pinned && pinCount >= PIN_MAX;
  const titleBad = !!tried && !title.trim();
  const bodyBad = tried === 'publish' && !hasText(content);
  const dateBad = tried === 'publish' && when === 'later' && at <= now;
  const live = !!initial && initial.state === 'published' && !scheduled;
  const publishLabel = when === 'later' ? 'SCHEDULE' : live ? 'SAVE' : 'PUBLISH';

  // 커서 자리에 이미지 줄 넣기
  const insertImage = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const url = await uploadNoticeImage(file);
      const el = area.current;
      const pos = el?.selectionStart ?? content.length;
      const before = content.slice(0, pos);
      const after = content.slice(pos);
      const line = `${before && !before.endsWith('\n') ? '\n' : ''}${imageLine(url)}\n`;
      setContent((before + line + after).slice(0, CONTENT_MAX));
    } catch (e) {
      setError(e instanceof Error ? e.message : '이미지를 올리지 못했어요.');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (state: 'draft' | 'published') => {
    setTried(state === 'draft' ? 'draft' : 'publish');
    if (!title.trim()) return;
    if (state === 'published' && (!hasText(content) || (when === 'later' && at <= now))) return;
    setSending(true);
    setError('');
    try {
      const num = await saveNotice({
        ...(initial && { num: initial.num }),
        category,
        title,
        content,
        pinned: state === 'draft' ? false : pinned,
        state,
        publish_at: state === 'published' && when === 'later' ? at : '',
      });
      onDone(
        state === 'draft'
          ? '임시 저장했어요. 쇼핑몰에는 아직 보이지 않아요.'
          : when === 'later'
            ? `${at.replace(/-/g, '.')}에 올라가도록 예약했어요.`
            : '공지를 올렸어요. 쇼핑몰 공지사항에 바로 보여요.',
        num,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : '저장하지 못했어요.');
    } finally {
      setSending(false);
    }
  };

  const remove = async () => {
    if (!initial) return;
    setSending(true);
    setError('');
    try {
      await deleteNotice(initial.num);
      onDone(`“${initial.title}” 공지를 지웠어요.`, null);
    } catch (e) {
      setError(e instanceof Error ? e.message : '지우지 못했어요.');
      setSending(false);
    }
  };

  return (
    <div className={s.form}>
      <div className={s.field}>
        <span className={s.label}>
          분류 <span className={s.required}>*</span>
        </span>
        <div role='group' aria-label='공지 분류' className={s.chips}>
          {NOTICE_CATEGORIES.map((c) => (
            <button key={c.key} type='button' aria-pressed={category === c.key} className={s.chip} onClick={() => setCategory(c.key)}>
              {c.label}
            </button>
          ))}
        </div>
        <span className={s.hint}>{NOTICE_CATEGORIES.find((c) => c.key === category)?.hint}</span>
      </div>

      <div className={s.field}>
        <label htmlFor={`nt-title-${initial?.num ?? 'new'}`} className={s.labelRow}>
          <span>
            제목 <span className={s.required}>*</span>
          </span>
          <span className={s.count}>
            {title.length}/{TITLE_MAX}
          </span>
        </label>
        <input
          id={`nt-title-${initial?.num ?? 'new'}`}
          type='text'
          value={title}
          maxLength={TITLE_MAX}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='예: 설 연휴 배송 안내'
          aria-invalid={titleBad}
          className={titleBad ? `${s.input} ${s.inputError}` : s.input}
        />
        {titleBad && (
          <span role='status' className={s.errorText}>
            제목을 입력해 주세요.
          </span>
        )}
      </div>

      <div className={s.field}>
        <div className={s.labelRow}>
          <label htmlFor={`nt-body-${initial?.num ?? 'new'}`}>
            내용 <span className={s.required}>*</span>
          </label>
          <label className={uploading ? `${s.imageBtn} ${s.imageBtnBusy}` : s.imageBtn}>
            <ImageIcon aria-hidden />
            {uploading ? '올리는 중…' : '이미지 넣기'}
            <input
              type='file'
              accept='image/*'
              disabled={uploading}
              aria-label='커서 자리에 이미지 넣기'
              className={s.fileInput}
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = '';
                if (f) insertImage(f);
              }}
            />
          </label>
        </div>
        <div className={textareaBox}>
          <textarea
            ref={area}
            id={`nt-body-${initial?.num ?? 'new'}`}
            rows={10}
            value={content}
            maxLength={CONTENT_MAX}
            onChange={(e) => setContent(e.target.value)}
            placeholder='고객에게 보여줄 내용을 써 주세요.'
            aria-invalid={bodyBad}
            className={bodyBad ? `${s.textarea} ${s.inputError}` : s.textarea}
          />
          <span className={textareaCount}>
            {content.length}/{CONTENT_MAX}
          </span>
        </div>
        <span className={bodyBad ? s.errorText : s.hint}>
          {bodyBad
            ? '내용을 한 줄 이상 써 주세요.'
            : '글 사이 원하는 자리에 커서를 두고 이미지를 넣어요. 이미지는 글 안에 ![이미지](주소) 한 줄로 들어가요.'}
        </span>
      </div>

      <div className={s.switchRow}>
        <span className={s.switchText}>
          <span className={s.label}>목록 맨 위에 고정</span>
          <span className={pinFull ? s.errorText : s.hint}>
            {pinFull
              ? `이미 ${PIN_MAX}개가 고정돼 있어요. 다른 공지의 고정을 먼저 풀어 주세요.`
              : `고정은 ${PIN_MAX}개까지 · 지금 ${pinCount + (pinned ? 1 : 0)}개`}
          </span>
        </span>
        <ToggleBtn value={pinned} setValue={(v) => !(v && pinFull) && setPinned(v)} label='목록 맨 위에 고정' />
      </div>

      <div className={s.field}>
        <span className={s.label}>올리는 시점</span>
        <div role='group' aria-label='올리는 시점' className={s.whens}>
          {(
            [
              ['now', live ? '바로 반영' : '지금 올리기'],
              ['later', '예약하기'],
            ] as const
          ).map(([k, label]) => (
            <button key={k} type='button' aria-pressed={when === k} className={s.whenChip} onClick={() => setWhen(k)}>
              {label}
            </button>
          ))}
        </div>
        {when === 'later' && (
          <>
            <div className={s.dates}>
              <input
                type='date'
                value={date}
                min={now.slice(0, 10)}
                onChange={(e) => setDate(e.target.value || now.slice(0, 10))}
                aria-label='예약 날짜'
                className={dateBad ? `${s.input} ${s.inputError}` : s.input}
              />
              <input
                type='time'
                value={time}
                onChange={(e) => setTime(e.target.value || '10:00')}
                aria-label='예약 시각'
                className={dateBad ? `${s.input} ${s.timeInput} ${s.inputError}` : `${s.input} ${s.timeInput}`}
              />
            </div>
            {dateBad && (
              <span role='status' className={s.errorText}>
                예약은 지금 이후 시각으로 골라 주세요.
              </span>
            )}
          </>
        )}
      </div>

      {error && (
        <p role='status' className={s.formError}>
          {error}
        </p>
      )}

      {confirmDelete ? (
        <div className={s.confirm}>
          <span>“{initial?.title}” 공지를 지울까요? 되돌릴 수 없어요.</span>
          <div className={s.actionsRow}>
            <button type='button' className={s.neutralBtn} onClick={() => setConfirmDelete(false)}>
              취소
            </button>
            <button type='button' className={s.dangerBtn} disabled={sending} onClick={remove}>
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
          {onCancel && (
            <button type='button' className={s.cancelBtn} onClick={onCancel}>
              CANCEL
            </button>
          )}
          {!live && (
            <button type='button' className={s.neutralBtn} disabled={sending} onClick={() => submit('draft')}>
              임시 저장
            </button>
          )}
          <button type='button' className={s.publishBtn} disabled={sending || uploading} onClick={() => submit('published')}>
            {sending ? 'SAVING…' : publishLabel}
          </button>
        </div>
      )}
    </div>
  );
}
