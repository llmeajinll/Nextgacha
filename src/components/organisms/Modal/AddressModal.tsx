'use client';

import React, { useState, useEffect } from 'react';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import {
  addressInput,
  addressBtn,
  addressContainer,
  writeBtn,
} from './addressModal.css';
import { userInfoAtom } from '@/jotai/store';
import { useAtom } from 'jotai';
import { useModal } from '@/app/hooks';
import { Range } from '@/components/atoms';

export default function AddressModal() {
  const [show, setShow] = useState(false);
  const [editMainAddress, setEditMainAddress] = useState('');
  const [editDetailAddress, setEditDetailAddress] = useState('');

  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  const { openModal, closeModal } = useModal();

  const scriptUrl =
    'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  const open = useDaumPostcodePopup(scriptUrl);

  const handleComplete = (data: any) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '')
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    console.log(fullAddress); // 주소 결과 처리
    setEditMainAddress(fullAddress);
    // console.log(data.zonecode); // 우편번호
  };

  const handleClick = () => {
    open({
      onComplete: handleComplete,
      width: 500,
      height: 600,
      top: 300, // 화면 상단에서의 거리
      left: 500, // 화면 왼쪽에서의 거리
      popupTitle: '배송지 주소 찾기', // 팝업창 타이틀
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => setShow(!show)} className={writeBtn}>
        [주소 수정]
      </div>
      {show && (
        <Range preset='columnCenter' gap='8' className={addressContainer}>
          <Range preset='between'>
            <div>주소 수정</div>
            <button
              onClick={() => setShow(false)}
              style={{
                backgroundImage: "url('/images/closeBtn.png')",
                width: '25px',
                height: '25px',
                backgroundSize: '100%',
                border: 'none',
                marginLeft: 'auto',

                cursor: 'pointer',
              }}
            ></button>
          </Range>
          <div>
            <input
              onClick={handleClick}
              className={addressInput}
              placeholder='주요 주소 입력 ( ex. 제주 첨단로 242)'
              value={editMainAddress}
              onChange={(e) => setEditMainAddress(e.target.value)}
            />
          </div>
          <div>
            <input
              className={addressInput}
              placeholder='상세 주소 입력 ( ex. 102호 / 상세 주소가 없을 시 . 입력)'
              value={editDetailAddress}
              onChange={(e) => setEditDetailAddress(e.target.value)}
              maxLength={10}
            />
          </div>
          <button
            className={addressBtn}
            onClick={async () => {
              if (!editMainAddress || !editDetailAddress) {
                openModal('주소를 입력해주세요.');
                return;
              }
              const address = editMainAddress + ' ' + editDetailAddress;
              await fetch('/api/updateAddress', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                  address: address,
                }),
              }).then(async (res) => {
                console.log(res);
                if (res.ok === true) {
                  const data = await res.json();
                  setUserInfo((prev: any) => ({
                    ...prev,
                    address: data.address,
                  }));
                  console.log('after userInfo : ', userInfo);
                  setEditMainAddress('');
                  setEditDetailAddress('');
                  setShow(false);
                  openModal('주소가 수정되었습니다.');
                } else {
                  openModal('주소 수정에 실패했습니다.');
                }
              });
            }}
          >
            EDIT
          </button>
        </Range>
      )}
    </div>
  );
}
