import { Close } from 'pixelarticons/react';
import { discountOf, saleOf } from '../../lib/discount';
import type { DiscountEvent } from '../../model/useDiscountEvent';
import * as s from './discountPanel.css';

const PRESETS = [10, 20, 30, 50];

// 오른쪽: 할인율·기간을 정하고 고른 상품에 적용
export default function DiscountPanel({ ev }: { ev: DiscountEvent }) {
  return (
    <aside aria-label='할인 적용' className={s.side}>
      <div className={s.sideHead}>
        <span className={s.sideKind}>DISCOUNT</span>
        <span className={s.sideCount} aria-live='polite'>
          {ev.selected.length
            ? `${ev.selected.length}개 선택${ev.reserveCount ? ` · 예약 ${ev.reserveCount}` : ''}`
            : '선택 없음'}
        </span>
      </div>

      <div className={s.sideBody}>
        <div className={s.field}>
          <label htmlFor='ev-rate' className={s.label}>
            할인율 <span className={s.hint}>1~99%</span>
          </label>
          <div className={s.rateRow}>
            <input
              id='ev-rate'
              type='number'
              min={1}
              max={99}
              value={ev.rate}
              onChange={(e) => {
                ev.setRate(e.target.value);
                ev.setRateError(false);
                ev.setConfirming('');
              }}
              placeholder='0'
              aria-invalid={ev.rateError}
              className={ev.rateError ? `${s.rateInput} ${s.inputError}` : s.rateInput}
            />
            <span className={s.unit}>%</span>
          </div>
          <div role='group' aria-label='자주 쓰는 할인율' className={s.presets}>
            {PRESETS.map((r) => (
              <button
                key={r}
                type='button'
                aria-pressed={ev.rateNum === r}
                className={ev.rateNum === r ? `${s.preset} ${s.presetOn}` : s.preset}
                onClick={() => {
                  ev.setRate(String(r));
                  ev.setRateError(false);
                  ev.setConfirming('');
                }}
              >
                {r}%
              </button>
            ))}
          </div>
          {ev.rateError && (
            <span role='status' className={s.errorText}>
              할인율은 1에서 99 사이로 입력해 주세요.
            </span>
          )}
        </div>

        <div className={s.field}>
          <span className={s.label}>
            할인 기간 <span className={s.hint}>비우면 내릴 때까지, 종료일 당일까지 적용</span>
          </span>
          <div className={s.periodRow}>
            <input
              type='date'
              aria-label='할인 시작일'
              value={ev.start}
              onChange={(e) => {
                ev.setStart(e.target.value);
                ev.setConfirming('');
              }}
              className={ev.periodBad ? `${s.dateInput} ${s.inputError}` : s.dateInput}
            />
            ~
            <input
              type='date'
              aria-label='할인 종료일'
              value={ev.end}
              min={ev.start || undefined}
              onChange={(e) => {
                ev.setEnd(e.target.value);
                ev.setConfirming('');
              }}
              className={ev.periodBad ? `${s.dateInput} ${s.inputError}` : s.dateInput}
            />
          </div>
          {ev.periodBad && (
            <span role='status' className={s.errorText}>
              시작일과 종료일을 둘 다, 순서대로 골라 주세요.
            </span>
          )}
        </div>

        <div className={s.field}>
          <div className={s.selHead}>
            <span className={s.label}>고른 상품</span>
            {ev.selected.length > 0 && (
              <button type='button' className={s.linkBtn} onClick={() => ev.select(new Set())}>
                모두 빼기
              </button>
            )}
          </div>
          {ev.selected.length > 0 ? (
            <ul className={s.selList}>
              {ev.selected.map((p) => (
                <li key={p.num} className={s.selItem}>
                  <span className={s.num}>{p.num}</span>
                  <span className={s.selTitle}>{p.title}</span>
                  <span className={s.selPrice}>{saleOf(p.price, ev.rateOk ? ev.rateNum : 0)}원</span>
                  <button
                    type='button'
                    className={s.removeBtn}
                    onClick={() => ev.toggle(p.num)}
                    aria-label={`${p.title} 빼기`}
                    title={`${p.title} 빼기`}
                  >
                    <Close aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className={s.selEmpty}>왼쪽 목록에서 할인할 상품을 골라 주세요.</div>
          )}
          {ev.withDiscount.length > 0 && ev.rateOk && (
            <span className={s.overwrite}>
              이미 할인 중인 {ev.withDiscount.length}개는 {ev.rateNum}%로 바뀌어요. (
              {ev.withDiscount.map((p) => `${discountOf(p)}%`).join(', ')} → {ev.rateNum}%)
            </span>
          )}
        </div>

        {ev.confirming && (
          <div className={ev.confirming === 'clear' ? `${s.confirm} ${s.confirmDanger}` : s.confirm}>
            <span>
              {ev.confirming === 'apply'
                ? `고른 ${ev.selected.length}개 상품에 ${ev.rateNum}% 할인을 걸까요? ${
                    ev.start && ev.end ? `${ev.start} ~ ${ev.end} 동안 쇼핑몰에 보여요.` : '쇼핑몰에 바로 보여요.'
                  }`
                : `할인 중인 ${ev.withDiscount.length}개 상품의 할인을 내릴까요? 정가로 돌아가요.`}
            </span>
            <div className={s.confirmBtns}>
              <button type='button' className={s.ghostBtn} onClick={() => ev.setConfirming('')}>
                취소
              </button>
              <button
                type='button'
                disabled={ev.sending}
                className={ev.confirming === 'clear' ? `${s.runBtn} ${s.runDanger}` : s.runBtn}
                onClick={ev.run}
              >
                {ev.sending ? '반영하는 중…' : ev.confirming === 'clear' ? '할인 내리기' : '할인 걸기'}
              </button>
            </div>
          </div>
        )}

        {ev.error && (
          <p role='status' className={s.sideError}>
            {ev.error}
          </p>
        )}

        <div className={s.actions}>
          <button
            type='button'
            disabled={ev.selected.length === 0}
            className={s.applyBtn}
            onClick={() => {
              if (!ev.rateOk) {
                ev.setRateError(true);
                ev.setConfirming('');
                return;
              }
              if (ev.periodBad) return;
              ev.setConfirming('apply');
              ev.setToast('');
            }}
          >
            APPLY
          </button>
          <button
            type='button'
            disabled={ev.withDiscount.length === 0}
            className={s.clearBtn}
            onClick={() => {
              ev.setConfirming('clear');
              ev.setToast('');
            }}
          >
            고른 상품 할인 내리기
          </button>
        </div>
      </div>
    </aside>
  );
}
