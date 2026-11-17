import Image from 'next/image';
import { Upload } from 'pixelarticons/react';
import { ToggleBtn } from '@/shared/ui';
import { checkbox } from '@/styles/variants.css';
import { BANNER_STATUS_LABEL, type Banner, type BannerStatus } from '@/entities/banner/model/types';
import { TITLE_MAX } from '../lib/parseBannerForm';
import { deleteBanner } from '../api/bannerActions';
import * as s from './bannerManager.css';

export type Draft = Omit<Banner, 'order'> & { file: File | null };

// 오른쪽: 고른 배너(또는 새 배너) 수정 폼
export default function BannerEditor({
  draft,
  setDraft,
  today,
  isNew,
  edStatus,
  shownImage,
  imageBad,
  titleBad,
  linkBad,
  dateBad,
  sending,
  error,
  confirmDelete,
  setConfirmDelete,
  run,
  save,
}: {
  draft: Draft | null;
  setDraft: (d: Draft | null) => void;
  today: string;
  isNew: boolean;
  edStatus: BannerStatus | 'draft';
  shownImage: string | undefined;
  imageBad: boolean;
  titleBad: boolean;
  linkBad: boolean;
  dateBad: boolean;
  sending: boolean;
  error: string;
  confirmDelete: boolean;
  setConfirmDelete: (v: boolean) => void;
  run: (job: () => Promise<void>, message: string, close?: boolean) => void;
  save: () => void;
}) {
  return (
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
  );
}
