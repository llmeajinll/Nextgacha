'use client';

import React, { useState } from 'react';
import { DropDown } from '@/shared/ui';
import { comma } from '@/shared/lib/comma';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import type { AdminOrder } from '../model/status';
import { refundOrder, toArrive, toSending } from '../api/orderActions';
import { textareaBox, textareaCount } from '@/styles/ui.css';
import * as s from './order.css';

export const COURIERS = ['CJ대한통운', '우체국택배', '한진택배', '롯데택배', '로젠택배'];

const when = (v: string, f: string) => (v ? toKoreaTime(v).format(f) : '');

export type Ship = { courier: string; invoice: string };

export default function Order({
  order,
  checked,
  onCheck,
  ship,
  onShip,
  onDone,
}: {
  order: AdminOrder;
  // 일괄 처리가 있는 탭(상품 확인중·배송중)에서만 넘김
  checked?: boolean;
  onCheck?: () => void;
  // 상품 확인중: 입력 중인 송장 (일괄 처리 바도 같은 값을 씀)
  ship: Ship;
  onShip: (ship: Ship) => void;
  onDone: (message: string) => void;
}) {
  const [shipError, setShipError] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const run = async (action: () => Promise<unknown>, message: string) => {
    setSending(true);
    setError('');
    try {
      await action();
      onDone(message);
    } catch (e) {
      setError(e instanceof Error ? e.message : '반영하지 못했어요.');
    } finally {
      setSending(false);
    }
  };

  const reasonLen = reason.trim().length;
  const isCheck = order.status === '상품 확인중';

  return (
    <article className={checked ? `${s.card} ${s.cardChecked}` : s.card}>
      <div className={s.head}>
        {onCheck && (
          <label className={s.checkBox}>
            <input type='checkbox' checked={!!checked} onChange={onCheck} aria-label={`${order.orderId} 선택`} className={s.checkInput} />
          </label>
        )}
        <span className={s.orderId}>{order.orderId}</span>
        <span className={s.muted}>{when(order.created_at, 'YYYY.MM.DD HH:mm')} 주문</span>
        <span className={`${s.status} ${s.statusTone[order.status]}`}>{order.status}</span>
        <span className={s.total}>
          {comma(order.totalPrice)}
          <span className={s.totalUnit}>원</span>
        </span>
      </div>

      <div className={s.body}>
        <div className={s.items}>
          <span className={s.pixelLabel}>ITEMS · {order.list.length}</span>
          {order.list.map((item) => (
            <div key={item.num} className={s.item}>
              <div className={s.itemTitle}>
                <span className={s.itemNum}>{item.num}</span>
                <span>{item.title || `${item.num}번 상품`}</span>
              </div>
              <div className={s.options}>
                {item.product.map((p) => (
                  <span key={p.name} className={s.option}>
                    {p.name}
                    <b className={s.optionCount}>×{p.count}</b>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <dl className={s.info}>
          <dt>고객</dt>
          <dd>{order.customer}</dd>
          <dt>이메일</dt>
          <dd className={s.wrap}>{order.email}</dd>
          <dt>배송지</dt>
          <dd>{order.address}</dd>
          <dt>결제</dt>
          <dd>
            {comma(order.totalPrice)}원{' '}
            <span className={s.muted}>
              · 포인트 사용 {comma(order.usedPoint ?? 0)}P · 적립 {comma(order.addPoint ?? 0)}P
            </span>
          </dd>
          {!!order.suspects?.length && (
            <>
              <dt className={s.suspectLabel}>중복 의심</dt>
              <dd className={s.suspect}>
                같은 상품을 산 다른 계정이 있어요. 보내기 전에 확인해 주세요.
                {order.suspects.map((x) => (
                  <span key={x.orderId} className={s.wrap}>
                    {x.email} <span className={s.muted}>· 주문 {x.orderId} · {x.by.join(', ')}</span>
                  </span>
                ))}
              </dd>
            </>
          )}
        </dl>
      </div>

      {isCheck && (
        <div className={s.foot}>
          <div className={s.shipRow}>
            <div className={`${s.field} ${s.courierField}`}>
              <label htmlFor={`or-courier-${order.orderId}`} className={s.label}>
                택배사
              </label>
              <DropDown
                id={`or-courier-${order.orderId}`}
                label={ship.courier}
                value={ship.courier}
                placeholder='택배사 선택'
                options={COURIERS.map((c) => ({ value: c, label: c }))}
                onSelect={(courier) => onShip({ ...ship, courier })}
                className={shipError && !ship.courier ? s.dropError : undefined}
              />
            </div>
            <div className={`${s.field} ${s.invoiceField}`}>
              <label htmlFor={`or-invoice-${order.orderId}`} className={s.label}>
                송장번호
              </label>
              <input
                id={`or-invoice-${order.orderId}`}
                inputMode='numeric'
                maxLength={30}
                value={ship.invoice}
                onChange={(e) => onShip({ ...ship, invoice: e.target.value })}
                placeholder='숫자만 입력'
                aria-invalid={shipError && !ship.invoice.trim()}
                className={shipError && !ship.invoice.trim() ? `${s.input} ${s.inputError}` : s.input}
              />
            </div>
            <button
              type='button'
              className={s.primaryBtn}
              disabled={sending}
              onClick={() => {
                if (!ship.courier || !ship.invoice.trim()) {
                  setShipError(true);
                  return;
                }
                run(
                  () => toSending([{ orderId: order.orderId, courier: ship.courier, invoice: ship.invoice.trim() }]),
                  `주문 ${order.orderId}을 배송중으로 바꿨어요.`,
                );
              }}
            >
              배송중으로
            </button>
            <button
              type='button'
              aria-expanded={refundOpen}
              className={s.rejectBtn}
              onClick={() => {
                setRefundOpen(!refundOpen);
                setReasonError(false);
              }}
            >
              배송 거절
            </button>
          </div>
          {shipError && (!ship.courier || !ship.invoice.trim()) && (
            <span role='status' className={s.errorText}>
              택배사와 송장번호를 입력해 주세요.
            </span>
          )}
          {refundOpen && (
            <div className={s.refundBox}>
              <label htmlFor={`or-reason-${order.orderId}`} className={s.label}>
                거절 사유 (10자 이상)
              </label>
              <div className={textareaBox}>
                <textarea
                  id={`or-reason-${order.orderId}`}
                  rows={2}
                  maxLength={200}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder='예: 입고가 취소되어 보내드릴 수 없어요.'
                  aria-invalid={reasonError && reasonLen < 10}
                  className={reasonError && reasonLen < 10 ? `${s.textarea} ${s.inputError}` : s.textarea}
                />
                <span className={textareaCount}>{reason.length}/200</span>
              </div>
              <div className={s.refundFoot}>
                <span role='status' className={s.errorText}>
                  {reasonError && reasonLen < 10 ? '거절 사유를 10자 이상 적어 주세요.' : ''}
                </span>
                <button
                  type='button'
                  className={s.dangerBtn}
                  disabled={sending}
                  onClick={() => {
                    if (reasonLen < 10) {
                      setReasonError(true);
                      return;
                    }
                    run(() => refundOrder(order.orderId, reason.trim()), `주문 ${order.orderId}을 환불했어요.`);
                  }}
                >
                  거절하고 환불
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {order.status === '배송중' && (
        <div className={`${s.foot} ${s.footRow}`}>
          <span>
            <span className={s.muted}>송장</span> {order.courier} · {order.invoice}
          </span>
          <button
            type='button'
            className={s.primaryBtn}
            disabled={sending}
            onClick={() => run(() => toArrive([order.orderId]), `주문 ${order.orderId}을 배송 완료로 바꿨어요.`)}
          >
            배송 완료로
          </button>
        </div>
      )}

      {order.status === '배송 완료' && (
        <div className={`${s.foot} ${s.footRow}`}>
          <span>
            <span className={s.muted}>송장</span> {order.courier} · {order.invoice}
          </span>
          <span>
            <span className={s.muted}>도착</span> {when(order.arrivedDate, 'YYYY.MM.DD')}
          </span>
        </div>
      )}

      {order.status === '환불' && (
        <div className={`${s.foot} ${s.footRefund}`}>
          <b className={s.refundLabel}>환불 사유</b> {order.reason || '없음'}
        </div>
      )}

      {error && (
        <p role='status' className={s.cardError}>
          {error}
        </p>
      )}
    </article>
  );
}
