'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { Plus } from 'pixelarticons/react';
import { Btn, ImgBtn, Tag } from '@/shared/ui';
import { CardProps } from '@/entities/product/model/types';
import { comma } from '@/shared/lib/comma';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import { vars } from '@/styles/theme.css';
import postEditProduct from '../api/postEditProduct';
import * as s from './productManageRow.css';

export type ProductStatus = 'sale' | 'reserve' | 'soldout';

const stockOf = (p: Pick<CardProps, 'list'>) => p.list.reduce((a, o) => a + o.count, 0);

export const statusOf = (p: CardProps): ProductStatus =>
  p.reserve ? 'reserve' : stockOf(p) === 0 ? 'soldout' : 'sale';

const STATUS: Record<ProductStatus, { label: string; color: string }> = {
  sale: { label: '판매 중', color: vars.ink[50] },
  reserve: { label: '예약', color: vars.status.reserve },
  soldout: { label: '품절', color: vars.status.soldout },
};

const pad = (n: number) => String(n).padStart(2, '0');

export function ProductManageHead() {
  return (
    <div className={`${s.rowGrid} ${s.head}`} aria-hidden>
      <span>NO</span>
      <span>PRODUCT</span>
      <span className={s.right}>PRICE</span>
      <span className={s.right}>SALE</span>
      <span className={s.right}>OPTION</span>
      <span className={s.right}>STOCK</span>
      <span className={s.center}>STATUS</span>
      <span />
    </div>
  );
}

type Draft = { price: string; discount: string; list: { name: string; count: string }[] };

export default function ProductManageRow({
  product,
  editing,
  onToggle,
  onSaved,
}: {
  product: CardProps;
  editing: boolean;
  onToggle: () => void;
  onSaved: (p: CardProps) => void;
}) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const status = statusOf(product);
  const zero = product.list.filter((o) => o.count === 0).length;

  const toggle = () => {
    setDraft(
      editing
        ? null
        : {
            price: String(product.price),
            discount: product.discount ? String(product.discount) : '',
            list: product.list.map((o) => ({ name: o.name, count: String(o.count) })),
          },
    );
    setSubmitted(false);
    setSendError('');
    onToggle();
  };

  return (
    <div className={editing ? `${s.row} ${s.rowEditing}` : s.row}>
      <div className={`${s.rowGrid} ${s.rowMain}`}>
        <span className={s.num}>{pad(product.num)}</span>
        <div className={s.product}>
          <Image
            src={product.image?.[0] || '/images/defaultImg.png'}
            alt=''
            width={52}
            height={52}
            className={s.thumb}
          />
          <div className={s.productText}>
            <span className={s.title}>{product.title}</span>
            <div className={s.tags}>
              {product.company && <Tag word={product.company} color={vars.slate[100]} />}
              {product.group?.map((g) => <Tag key={g} word={g} color={vars.slate[50]} />)}
              {product.reserve && (
                <Tag word={`${toKoreaTime(product.reserve).format('YYYY년 MM월')} 예약`} color={vars.status.reserve} />
              )}
            </div>
          </div>
        </div>
        <span className={s.right}>{comma(product.price)}원</span>
        <span className={product.discount ? `${s.right} ${s.disc}` : `${s.right} ${s.muted}`}>
          {product.discount ? `${product.discount}%` : '—'}
        </span>
        <span className={`${s.right} ${s.sub}`}>{product.list.length}종</span>
        <div className={s.stock}>
          <span>{comma(stockOf(product))}개</span>
          {status === 'sale' && zero > 0 && <span className={s.zero}>품절 옵션 {zero}</span>}
        </div>
        <span className={s.center}>
          <Tag word={STATUS[status].label} color={STATUS[status].color} />
        </span>
        <button
          type='button'
          aria-expanded={editing}
          aria-label={`${product.title} ${editing ? '수정 닫기' : '수정'}`}
          className={editing ? `${s.editBtn} ${s.editBtnOn}` : s.editBtn}
          onClick={toggle}
        >
          {editing ? '닫기' : '수정'}
        </button>
      </div>

      {editing && draft && (
        <Editor
          product={product}
          draft={draft}
          setDraft={setDraft}
          submitted={submitted}
          sending={sending}
          sendError={sendError}
          onCancel={toggle}
          onSave={async (edit) => {
            setSubmitted(true);
            if (!edit) return;
            setSending(true);
            setSendError('');
            try {
              await postEditProduct(edit);
              onSaved({ ...product, ...edit, isDiscount: edit.discount > 0 });
            } catch {
              setSendError('저장하지 못했어요. 다시 시도해 주세요.');
            } finally {
              setSending(false);
            }
          }}
        />
      )}
    </div>
  );
}

function Editor({
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
        <span className={s.editorKind}>EDIT</span>
        <span className={s.editorTitle}>{product.title}</span>
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

        <div className={s.actions}>
          {((submitted && invalid) || sendError) && (
            <span role='status' className={s.formError}>
              {sendError || '빨간 칸을 확인해 주세요.'}
            </span>
          )}
          <Btn color='reversePrimary' onClick={onCancel}>
            CANCEL
          </Btn>
          <Btn
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
