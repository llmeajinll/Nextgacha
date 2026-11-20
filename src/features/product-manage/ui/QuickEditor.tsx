import { useRouter } from 'next/navigation';
import { Plus } from 'pixelarticons/react';
import { Btn, ImgBtn } from '@/shared/ui';
import type { CardProps } from '@/entities/product/model/types';
import { comma } from '@/shared/lib/comma';
import { pad } from '../lib/productForm';
import RestockControl from './RestockControl';
import * as s from './productManageRow.css';

export type Draft = { price: string; discount: string; list: { name: string; count: string }[] };

// 상품 관리 목록에서 펼치는 간편 수정 (가격·할인율·옵션 재고)
export default function QuickEditor({
  product,
  draft,
  setDraft,
  submitted,
  sending,
  sendError,
  onCancel,
  onSave,
}: {
  product: CardProps;
  draft: Draft;
  setDraft: (d: Draft) => void;
  submitted: boolean;
  sending: boolean;
  sendError: string;
  onCancel: () => void;
  onSave: (edit: { num: number; price: number; discount: number; list: { name: string; count: number }[] } | null) => void;
}) {
  const router = useRouter();
  const price = Number(draft.price);
  const disc = Math.min(Math.max(Number(draft.discount) || 0, 0), 99);
  const priceBad = !(Number.isInteger(price) && price > 0);
  const names = draft.list.map((o) => o.name.trim());
  const optionErrors = draft.list.map((o, i) => {
    const n = Number(o.count);
    const name = !names[i] ? '옵션 이름을 입력해 주세요.' : names.indexOf(names[i]) !== i ? '같은 이름의 옵션이 있어요.' : '';
    const qty = o.count === '' || !Number.isInteger(n) || n < 0 ? '재고를 0개 이상 입력해 주세요.' : '';
    return { name, qty };
  });
  const invalid = priceBad || optionErrors.some((e) => e.name || e.qty);
  const total = draft.list.reduce((a, o) => a + (Number(o.count) || 0), 0);
  // 예약 상품은 재고 0이어도 주문을 받으므로 품절로 세지 않음
  const zero = product.reserve ? 0 : draft.list.filter((o) => o.count !== '' && Number(o.count) === 0).length;

  const setOption = (i: number, key: 'name' | 'count', v: string) =>
    setDraft({ ...draft, list: draft.list.map((o, j) => (j === i ? { ...o, [key]: v } : o)) });

  return (
    <div className={s.editor}>
      <div className={s.editorHead}>
        <div className={s.editorHeadLeft}>
          <span className={s.editorKind}>EDIT</span>
          <span className={s.editorTitle}>{product.title}</span>
        </div>
        <button
          type='button'
          className={s.editorFullBtn}
          onClick={() => router.push(`/manager/product_add?edit=${product.num}`)}
        >
          제목·전체 정보 수정 ↗
        </button>
      </div>
      <div className={s.editorBody}>
        <div className={s.priceGrid}>
          <div className={s.field}>
            <label htmlFor={`pm-price-${product.num}`} className={s.label}>
              정가 <span className={s.required}>*</span>
            </label>
            <div className={s.unitRow}>
              <input
                id={`pm-price-${product.num}`}
                type='number'
                min={1}
                inputMode='numeric'
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                aria-invalid={submitted && priceBad}
                className={submitted && priceBad ? `${s.input} ${s.inputError}` : s.input}
              />
              <span className={s.unit}>원</span>
            </div>
          </div>
          <div className={s.field}>
            <label htmlFor={`pm-disc-${product.num}`} className={s.label}>
              할인율
            </label>
            <div className={s.unitRow}>
              <input
                id={`pm-disc-${product.num}`}
                type='number'
                min={0}
                max={99}
                inputMode='numeric'
                value={draft.discount}
                placeholder='0'
                onChange={(e) => setDraft({ ...draft, discount: e.target.value })}
                className={s.input}
              />
              <span className={s.unit}>%</span>
            </div>
          </div>
          <div className={s.field}>
            <span className={s.label}>
              판매가 <span className={s.hint}>자동 계산</span>
            </span>
            <div className={s.salePrice} aria-live='polite'>
              <span>{priceBad ? '—' : comma(price * (1 - disc / 100))}</span>
              <span className={s.saleUnit}>원</span>
            </div>
          </div>
        </div>

        <div className={s.options}>
          <div className={s.optionsHead}>
            <span className={s.label}>
              옵션 재고 <span className={s.required}>*</span>
            </span>
            <span className={s.hint} aria-live='polite'>
              {draft.list.length}종 · 합계 {comma(total)}개{zero > 0 && ` · 품절 옵션 ${zero}개`}
            </span>
          </div>
          {draft.list.map((o, i) => {
            const err = submitted ? optionErrors[i] : { name: '', qty: '' };
            return (
              <div key={i} className={s.field}>
                <div className={s.optionRow}>
                  <span className={s.optionNo}>{pad(i + 1)}</span>
                  <input
                    value={o.name}
                    maxLength={50}
                    onChange={(e) => setOption(i, 'name', e.target.value)}
                    aria-label={`${i + 1}번 옵션 이름`}
                    placeholder='옵션 이름'
                    className={err.name ? `${s.input} ${s.inputError}` : s.input}
                  />
                  <div className={`${s.unitRow} ${s.optionQty}`}>
                    <input
                      type='number'
                      min={0}
                      inputMode='numeric'
                      value={o.count}
                      onChange={(e) => setOption(i, 'count', e.target.value)}
                      aria-label={`${i + 1}번 옵션 재고`}
                      className={`${s.input} ${!product.reserve && o.count !== '' && Number(o.count) === 0 ? s.zeroInput : ''} ${err.qty ? s.inputError : ''}`}
                    />
                    <span className={s.unit}>개</span>
                  </div>
                  <ImgBtn
                    img='trash'
                    size={24}
                    title={`${i + 1}번 옵션 삭제`}
                    className={s.iconBtn}
                    disabled={draft.list.length <= 1}
                    onClick={() => setDraft({ ...draft, list: draft.list.filter((_, j) => j !== i) })}
                  />
                </div>
                {(err.name || err.qty) && <span className={`${s.errorText} ${s.optionError}`}>{err.name || err.qty}</span>}
              </div>
            );
          })}
          <button
            type='button'
            className={s.slotBtn}
            onClick={() => setDraft({ ...draft, list: [...draft.list, { name: '', count: '' }] })}
          >
            <Plus aria-hidden />
            옵션 추가
          </button>
        </div>

        <RestockControl product={product} />

        <div className={s.actions}>
          {((submitted && invalid) || sendError) && (
            <span role='status' className={s.formError}>
              {sendError || '빨간 칸을 확인해 주세요.'}
            </span>
          )}
          <Btn kind='neutral' px onClick={onCancel}>
            CANCEL
          </Btn>
          <Btn
            kind='primary'
            px
            disabled={sending}
            onClick={() =>
              onSave(
                invalid
                  ? null
                  : {
                      num: product.num,
                      price,
                      discount: disc,
                      list: draft.list.map((o) => ({ name: o.name.trim(), count: Number(o.count) })),
                    },
              )
            }
          >
            {sending ? 'SAVING…' : 'SAVE'}
          </Btn>
        </div>
      </div>
    </div>
  );
}
