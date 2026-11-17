import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'pixelarticons/react';
import { ToggleBtn } from '@/shared/ui';
import { ymd } from '../../lib/productForm';
import type { ProductFormState } from '../../model/useProductForm';
import FormPanel from './FormPanel';
import * as s from './productForm.css';

// 04 예약 판매: 사전예약 기간·발송 예정일
export default function ReserveFields({ f }: { f: ProductFormState }) {
  const {
    reserve,
    setReserve,
    resStart,
    setResStart,
    resEnd,
    setResEnd,
    resShip,
    setResShip,
    resOrderBad,
    resStartError,
    resEndError,
    resShipError,
    resDays,
  } = f;
  return (
    <FormPanel
      no='04'
      title='예약 판매'
      aside={
        <div className={reserve ? `${s.toggleRow} ${s.toggleOn}` : s.toggleRow}>
          <span aria-hidden>{reserve ? 'ON' : 'OFF'}</span>
          <ToggleBtn value={reserve} setValue={setReserve} label='예약 판매' />
        </div>
      }
    >
      {reserve ? (
        <div className={s.panelBody}>
          <div className={s.grid}>
            <div className={s.field}>
              <label htmlFor='pa-res-start' className={s.label}>
                사전예약 시작일 <span className={s.required}>*</span>
              </label>
              <DatePicker
                id='pa-res-start'
                selected={resStart}
                onChange={setResStart}
                dateFormat='yyyy-MM-dd'
                placeholderText='YYYY-MM-DD'
                className={resStartError ? `${s.input} ${s.inputError}` : s.input}
              />
              {resStartError && <span className={s.errorText}>시작일을 선택해 주세요.</span>}
            </div>
            <div className={s.field}>
              <label htmlFor='pa-res-end' className={s.label}>
                사전예약 종료일 <span className={s.required}>*</span>
              </label>
              <DatePicker
                id='pa-res-end'
                selected={resEnd}
                onChange={setResEnd}
                minDate={resStart ?? undefined}
                dateFormat='yyyy-MM-dd'
                placeholderText='YYYY-MM-DD'
                className={resEndError ? `${s.input} ${s.inputError}` : s.input}
              />
              {resEndError && (
                <span className={s.errorText}>
                  {resOrderBad ? '종료일은 시작일 이후여야 해요.' : '종료일을 선택해 주세요.'}
                </span>
              )}
            </div>
            <div className={s.field}>
              <label htmlFor='pa-res-ship' className={s.label}>
                발송 예정일 <span className={s.required}>*</span>
              </label>
              <DatePicker
                id='pa-res-ship'
                selected={resShip}
                onChange={setResShip}
                dateFormat='yyyy-MM-dd'
                placeholderText='YYYY-MM-DD'
                className={resShipError ? `${s.input} ${s.inputError}` : s.input}
              />
              {resShipError && <span className={s.errorText}>발송 예정일을 선택해 주세요.</span>}
            </div>
          </div>
          {resDays > 0 && (
            <div className={s.summary} aria-live='polite'>
              <Calendar aria-hidden />
              <span>
                {ymd(resStart!)} ~ {ymd(resEnd!)} · {resDays}일 동안 사전예약을 받아요
              </span>
            </div>
          )}
        </div>
      ) : (
        <p className={`${s.hint} ${s.panelBody}`}>
          켜면 사전예약 기간과 발송 예정일을 정할 수 있어요. 발송 예정일은 상품 카드에 &lsquo;예약&rsquo; 태그로 보여요.
        </p>
      )}
    </FormPanel>
  );
}
