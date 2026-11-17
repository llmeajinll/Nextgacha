'use client';

import React, { useState } from 'react';
import { DropDown } from '@/shared/ui';
import { comma } from '@/shared/lib/comma';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import type { AdminOrder } from '../model/status';
import { exchangeDone, exchangeReject, refundOrder, toArrive, toSending } from '../api/orderActions';
import OrderDetail from './OrderDetail';
import ReasonField from './ReasonField';
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

      <OrderDetail order={order} />

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
              <ReasonField
                id={`or-reason-${order.orderId}`}
                label='거절 사유 (10자 이상)'
                value={reason}
                onChange={setReason}
                placeholder='예: 입고가 취소되어 보내드릴 수 없어요.'
                invalid={reasonError && reasonLen < 10}
              />
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

      {order.status === '교환 요청' && (
        <div className={s.foot}>
          <span>
            <span className={s.muted}>불량 내용</span> {order.exchangeReason}
          </span>
          <div className={s.refundBox}>
            <ReasonField
              id={`or-exreason-${order.orderId}`}
              label='반려 사유 (반려할 때만, 10자 이상)'
              value={reason}
              onChange={setReason}
              placeholder='예: 사진으로 불량을 확인할 수 없어요.'
              invalid={reasonError && reasonLen < 10}
            />
            <div className={s.refundFoot}>
              <span role='status' className={s.errorText}>
                {reasonError && reasonLen < 10 ? '반려 사유를 10자 이상 적어 주세요.' : ''}
              </span>
              <button
                type='button'
                className={s.rejectBtn}
                disabled={sending}
                onClick={() => {
                  if (reasonLen < 10) {
                    setReasonError(true);
                    return;
                  }
                  run(() => exchangeReject(order.orderId, reason.trim()), `주문 ${order.orderId}의 교환 요청을 반려했어요.`);
                }}
              >
                반려
              </button>
              <button
                type='button'
                className={s.primaryBtn}
                disabled={sending}
                onClick={() => run(() => exchangeDone(order.orderId), `주문 ${order.orderId}의 교환 상품을 보냈어요. 재고에서 뺐어요.`)}
              >
                교환 상품 보내기 (재고 차감)
              </button>
            </div>
          </div>
        </div>
      )}

      {order.status === '교환 완료' && (
        <div className={`${s.foot} ${s.footRow}`}>
          <span>
            <span className={s.muted}>불량 내용</span> {order.exchangeReason}
          </span>
          <span>
            <span className={s.muted}>교환 발송</span> {when(order.exchangedDate ?? '', 'YYYY.MM.DD')}
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
