'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { CardProps } from '@/entities/product/model/types';
import { comma } from '@/shared/lib/comma';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import postEditProduct from '../api/postEditProduct';
import { pad } from '../lib/productForm';
import QuickEditor, { type Draft } from './QuickEditor';
import * as s from './productManageRow.css';

export type ProductStatus = 'sale' | 'reserve' | 'soldout';

const stockOf = (p: Pick<CardProps, 'list'>) => p.list.reduce((a, o) => a + o.count, 0);

export const statusOf = (p: CardProps): ProductStatus =>
  p.reserve ? 'reserve' : stockOf(p) === 0 ? 'soldout' : 'sale';

const STATUS: Record<ProductStatus, string> = { sale: '판매 중', reserve: '예약', soldout: '품절' };

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
  const router = useRouter();
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
              {product.company && <span className={s.companyTag}>{product.company}</span>}
              {product.group?.map((g) => (
                <span key={g} className={s.groupTag}>
                  {g}
                </span>
              ))}
              {product.reserve && (
                <span className={s.reserveTag}>{`${toKoreaTime(product.reserve).format('YYYY년 MM월')} 예약`}</span>
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
          <span className={s.statusTag[status]}>{STATUS[status]}</span>
        </span>
        <div className={s.btnGroup}>
          <button
            type='button'
            aria-label={`${product.title} 수정 (상품 추가/수정 페이지)`}
            className={s.fullEditBtn}
            onClick={() => router.push(`/manager/product_add?edit=${product.num}`)}
          >
            수정
          </button>
          <button
            type='button'
            aria-expanded={editing}
            aria-label={`${product.title} ${editing ? '간편 수정 닫기' : '간편 수정 열기'}`}
            className={editing ? s.quickBtnOn : s.quickBtn}
            onClick={toggle}
          >
            {editing ? '닫기' : '간편수정'}
          </button>
        </div>
      </div>

      {editing && draft && (
        <QuickEditor
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
