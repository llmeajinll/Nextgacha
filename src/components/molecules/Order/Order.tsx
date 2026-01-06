'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Range } from '@/components/atoms';
import { inputStyle, sendingBtn, checkBox } from './order.css';
import useSplitRoute from '@/app/hooks/useSplitRoute';
import { useModal } from '@/app/hooks';

export default function Order({
  props,
  onUpdate,
}: {
  props: any;
  onUpdate?: (orderId: string, newData: any) => void;
}) {
  const router = useRouter();
  const { route } = useSplitRoute();
  const status = route[2];

  const [reason, setReason] = useState('');
  const { openModal } = useModal();

  const OrderBtn = () => {
    if (status === 'check') {
      return (
        <button
          className={sendingBtn}
          onClick={async () => {
            if (props.courier === '' || props.invoice === '') {
              openModal('택배사와 송장번호를 입력해주세요.');
              return;
            }
            if (props.check === false) {
              openModal('선택되지 않았습니다.');
              return;
            }
            await fetch('/api/postCheckToSending', {
              method: 'POST',
              body: JSON.stringify({
                send: 'one',
                orderId: props.orderId,
                courier: props.courier,
                invoice: props.invoice,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((res) => {
                console.log('res : ', res);

                alert('반영되었습니다');
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
                openModal('오류가 발생되었습니다.');
              });
          }}
        >
          배송중으로 변경
        </button>
      );
    } else if (status === 'sending') {
      return (
        <button
          className={sendingBtn}
          onClick={async () => {
            if (props.courier === '' || props.invoice === '') {
              openModal('택배사와 송장번호를 입력해주세요.');
              return;
            }
            // if (props.check === false) {
            //   openModal('선택되지 않았습니다.');
            //   return;
            // }
            await fetch('/api/postSendingToFinish', {
              method: 'POST',
              body: JSON.stringify({
                send: 'one',
                orderId: props.orderId,
                addPoint: props.addPoint,
                email: props.email,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
            })
              .then((res) => {
                console.log('res : ', res);

                alert('반영되었습니다');
                window.location.reload();
              })
              .catch((err) => {
                console.log(err);
                openModal('오류가 발생되었습니다.');
              });
          }}
        >
          배송 완료로 변경
        </button>
      );
    }
    return;
  };

  // console.log(props);

  useEffect(() => {
    if (status === 'check') {
      const isComplete = props.courier !== '' && props.invoice !== '';
      if (props.check !== isComplete) {
        onUpdate?.(props.orderId, { check: isComplete });
      }
    }
  }, [props.courier, props.invoice]);

  return (
    <Range key={props.orderId} gap='5'>
      {!['arrive', 'refund'].includes(route[2]) && (
        <div>
          <input
            type='checkbox'
            checked={props.check}
            onChange={() => onUpdate?.(props.orderId, { check: !props.check })}
            className={checkBox}
          />
        </div>
      )}
      <div style={{ width: '580px' }}>
        <Range preset='between'>
          <h3>{props.orderId}</h3>
          <h4>{props.status}</h4>
        </Range>
        {route[2] !== 'check' && (
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
            <span style={{ marginRight: '10px' }}>
              {route[2] === 'refund' ? '환불 사유' : props.courier}
            </span>
            <span>
              {route[2] === 'refund' ? props.reason || '없음' : props.invoice}
            </span>
            {route[2] === 'arrive' && (
              <span style={{ marginLeft: '20px' }}>
                {props.arrivedDate} 도착
              </span>
            )}
          </div>
        )}
        <div>
          주문일<span style={{ marginLeft: '20px' }}>{props.created_at}</span>
        </div>
        <div>{props.address}</div>
        <div>
          {props.customer}
          <span style={{ marginLeft: '20px' }}>{props.email}</span>
        </div>
        <Range>
          <div style={{ marginRight: '20px' }}>{props.totalPrice} 원</div>
          <div>{props.addPoint} P</div>
        </Range>

        <div>
          {props.list.map((item: any, idx: number) => (
            <div key={item.num + item.title}>
              <div>
                <span style={{ marginRight: '20px' }}>{item.num}번</span>
                {item.title || ''}
              </div>
              <Range key={props.orderId + idx} gap='15'>
                {item.product.map((val: any) => (
                  <div key={val.name + item.num}>
                    {val.name} : {val.count}개
                  </div>
                ))}
              </Range>
            </div>
          ))}
        </div>
        {status === 'check' && (
          <Range gap='10' style={{ marginTop: '10px' }}>
            <input
              value={props.courier}
              onChange={(e) => {
                onUpdate?.(props.orderId, { courier: e.target.value });
              }}
              placeholder='택배사'
              className={inputStyle}
            />

            <input
              value={props.invoice}
              onChange={(e) => {
                //   setCourier(e.target.value);
                onUpdate?.(props.orderId, { invoice: e.target.value });
              }}
              placeholder='송장번호'
              className={inputStyle}
              style={{ width: '250px' }}
            />
          </Range>
        )}
        <Range preset='between' style={{ marginTop: '10px' }}>
          <OrderBtn />
          {status === 'check' && (
            <Range>
              <input
                className={inputStyle}
                style={{ width: '250px' }}
                placeholder='배송 거절 사유 (10자 이상)'
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <button
                className={sendingBtn}
                style={{ backgroundColor: 'gray', marginLeft: '10px' }}
                onClick={async () => {
                  if (reason.length < 10) {
                    alert('10자 이상으로 적어주세요.');
                    return;
                  }
                  try {
                    await fetch('/api/postCheckToSending', {
                      method: 'POST',
                      body: JSON.stringify({
                        send: 'refund',
                        orderId: props.orderId,
                        reason,
                      }),
                      headers: {
                        'Content-Type': 'application/json',
                      },
                    });
                    alert('환불 되었습니다.');
                    window.location.reload();
                  } catch (err) {
                    console.log(err);
                    alert('오류가 발생하였습니다.');
                    window.location.reload();
                  }
                }}
              >
                배송 거절
              </button>
            </Range>
          )}
        </Range>
      </div>
    </Range>
  );
}
