'use client';

import React, { useState } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { useAtomValue } from 'jotai';
import { queryClientAtom } from 'jotai-tanstack-query';
import { Check, Search } from 'pixelarticons/react';
import { userInfoAtom } from '@/entities/user/model/store';
import { useModal } from '@/shared/hooks';
import * as s from './addressEditor.css';

const SCRIPT = 'https://t1.kakaocdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

type Draft = { zip: string; road: string; detail: string; noDetail: boolean };

// ponytail: 주소는 user.address 문자열 하나라 "[우편번호] 도로명, 상세" 모양일 때만 칸을 나눠 채운다. 칸별로 저장하게 되면 이 파싱을 지우기
function split(address = ''): Draft {
  const m = /^\[(\d{5})\] (.+?)(?:, ([^,()]+))?$/.exec(address);
  if (!m) return { zip: '', road: '', detail: '', noDetail: false };
  return { zip: m[1], road: m[2], detail: m[3] ?? '', noDetail: !m[3] };
}

// 배송지 보기 ↔ 그 자리에서 고치기 (디자인 캔버스 MyCart). children은 제목과 주소 사이 장식(트럭 길)
// 저장하면 루트에 data-run이 잠깐 붙는다 → 장식 쪽 css가 트럭을 달리게 할 수 있음
export default function AddressEditor({ children }: { children?: React.ReactNode }) {
  const queryClient = useAtomValue(queryClientAtom);
  const { data: user } = useAtomValue(userInfoAtom);
  const { openModal } = useModal();
  const openPostcode = useDaumPostcodePopup(SCRIPT);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [run, setRun] = useState(false);

  const patch = (p: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...p } : d));
  const detail = draft?.detail.trim() ?? '';
  const cantSave = !draft?.road || (!draft.noDetail && !detail) || saving;

  const search = () =>
    openPostcode({
      popupTitle: '배송지 주소 찾기',
      onComplete: (data: any) => {
        // 도로명이면 (법정동, 건물명)을 덧붙인다
        const extra = data.addressType === 'R' ? [data.bname, data.buildingName].filter(Boolean).join(', ') : '';
        patch({ zip: data.zonecode, road: extra ? `${data.address} (${extra})` : data.address });
      },
    });

  const save = async () => {
    if (!draft || cantSave) return;
    const address = `[${draft.zip}] ${draft.road}${draft.noDetail ? '' : `, ${detail}`}`;
    setSaving(true);
    const res = await fetch('/api/updateAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    }).catch(() => null);
    setSaving(false);
    if (!res?.ok) {
      openModal('배송지를 바꾸지 못했어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    setDraft(null);
    setSaved(true);
    setRun(true);
    setTimeout(() => setRun(false), 900);
  };

  return (
    <div className={s.root} data-run={run || undefined}>
      <div className={s.head}>
        <span className={s.title}>배송지</span>
        {!draft && (
          <button
            type='button'
            className={s.changeBtn}
            onClick={() => {
              setDraft(split(user?.address));
              setSaved(false);
            }}
          >
            변경
          </button>
        )}
      </div>

      {children}

      {!draft ? (
        <div className={s.view}>{user?.address || <span className={s.empty}>배송지를 입력해 주세요.</span>}</div>
      ) : (
        <div className={s.form}>
          <div className={s.field}>
            <span id='ship-addr-label' className={s.label}>
              주소
            </span>
            <div className={s.row}>
              <input readOnly aria-label='우편번호' value={draft.zip} placeholder='우편번호' className={`${s.input} ${s.zip}`} />
              <button type='button' className={s.searchBtn} onClick={search}>
                <Search width={16} height={16} aria-hidden />
                주소 검색
              </button>
            </div>
            <input
              readOnly
              aria-labelledby='ship-addr-label'
              value={draft.road}
              placeholder='주소 검색으로 골라 주세요'
              className={s.input}
            />
          </div>

          <div className={s.field}>
            <label htmlFor='ship-detail' className={s.label}>
              상세 주소
            </label>
            <input
              id='ship-detail'
              value={draft.noDetail ? '' : draft.detail}
              onChange={(e) => patch({ detail: e.target.value })}
              disabled={draft.noDetail}
              maxLength={50}
              placeholder={draft.noDetail ? '상세 주소 없이 보내요' : '동 · 호수 (예: 101동 1001호)'}
              className={`${s.input} ${s.editable}`}
            />
            <label className={s.check}>
              <button
                type='button'
                role='checkbox'
                aria-checked={draft.noDetail}
                className={s.box}
                onClick={() => patch({ noDetail: !draft.noDetail })}
              >
                {draft.noDetail && <Check width={14} height={14} aria-hidden />}
              </button>
              상세 주소 없음
            </label>
          </div>

          <div className={s.row}>
            <button type='button' className={s.cancelBtn} onClick={() => setDraft(null)}>
              취소
            </button>
            <button type='button' className={s.saveBtn} onClick={save} disabled={cantSave}>
              저장
            </button>
          </div>
        </div>
      )}

      {saved && !draft && (
        <span role='status' className={s.saved}>
          배송지를 바꿨어요.
        </span>
      )}
    </div>
  );
}
