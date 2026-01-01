'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { auth } from '@/auth';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { Range } from '@/components/atoms';
import {
  profileImage,
  email,
  point,
  address,
  addressInput,
  addressBtn,
} from './profile.css';
import { comma } from '@/shared/comma';
import { userInfoAtom } from '@/jotai/store';
import { useAtom } from 'jotai';

export default function Profile() {
  const router = useRouter();
  // const [user, setUser] = useState({
  //   email: '',
  //   nickname: '',
  //   point: 0,
  //   address: '',
  //   image: '',
  // });
  const [userInfo, setUserInfo] = useAtom(userInfoAtom);
  // const [, setUserInfo] = useAtom(setUserInfoAtom);
  const [show, setShow] = useState(false);
  const [editMainAddress, setEditMainAddress] = useState('');
  const [editDetailAddress, setEditDetailAddress] = useState('');
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

  useEffect(() => {
    const fetchUserData = async () => {
      await fetch(`/api/protected/getUser`, { cache: 'no-store' })
        .then(async (res) => {
          const data = await res.json();
          console.log('client user : ', data);

          if (data.ok === true) {
            setUserInfo(data.result);
          }

          return res;
        })
        .catch((err) => console.log(err));
    };

    fetchUserData();
    console.log('userInfo : ', userInfo);
  }, []);

  // console.log(user);

  return (
    <Range gap='15' style={{ marginBottom: '20px' }}>
      <Image
        src={userInfo?.image || '/images/defaultImg.png'}
        alt='image'
        width={100}
        height={100}
        className={profileImage}
      />
      <Range preset='column' gap='4'>
        <div style={{ fontSize: '20px' }}>{userInfo?.nickname}</div>
        <div className={email}>{userInfo?.email}</div>
        <Range className={address}>
          <div style={{ marginRight: '4px' }}>
            {userInfo?.address === ''
              ? '주소를 입력해주세요.'
              : userInfo?.address}
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ cursor: 'pointer' }} onClick={() => setShow(!show)}>
              [수정]
            </div>
            {show && (
              <Range
                preset='columnCenter'
                gap='8'
                style={{
                  position: 'absolute',
                  width: 'fit-content',
                  background: 'white',
                  border: '1px solid lightgray',
                  alignItems: 'center',
                  padding: '8px 10px',
                  bottom: '-45px',
                  left: '50px',
                }}
              >
                <div>
                  <input
                    onClick={handleClick}
                    placeholder='주소 검색'
                    value={editMainAddress}
                    onChange={(e) => setEditMainAddress(e.target.value)}
                    className={addressInput}
                  />
                </div>
                <div>
                  <input
                    placeholder='상세 주소 입력 ( ex. 102호 / 상세 주소가 없을 시 . 입력)'
                    value={editDetailAddress}
                    onChange={(e) => setEditDetailAddress(e.target.value)}
                    className={addressInput}
                  />
                </div>
                <button
                  className={addressBtn}
                  onClick={async () => {
                    if (!editMainAddress || !editDetailAddress) {
                      alert('주소를 입력해주세요.');
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
                        alert('주소가 수정되었습니다.');
                      } else {
                        alert('주소 수정에 실패했습니다.');
                      }
                    });
                  }}
                >
                  EDIT
                </button>
              </Range>
            )}
          </div>
        </Range>

        <Range gap='5'>
          <Image src='/images/point.png' width={22} height={22} alt='point' />
          <div className={point}>{comma(userInfo?.point || 0)}P</div>
        </Range>
      </Range>
    </Range>
  );
}
