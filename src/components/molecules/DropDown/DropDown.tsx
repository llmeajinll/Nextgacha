'use client';

import React, { useState } from 'react';
import {
  dropdownContainer,
  dropdownTitle,
  listContainer,
  list,
} from './dropdown.css';
import Image from 'next/image';
import { ImgBtn, Range } from '@/components/atoms';
import { vars } from '@/styles/theme.css';

export default function DropDown({
  select,
  setSelect,
}: {
  select: string;
  setSelect: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [state, setState] = useState(false);
  const [lists, setLists] = useState([
    { name: '치이카와', code: 'ban3_1', count: 1, price: 4000 },
    { name: '하치와레', code: 'ban3_2', count: 0, price: 4000 },
    { name: '우사기', code: 'ban3_3', count: 1, price: 4000 },
    { name: '밤만쥬', code: 'ban3_4', count: 1, price: 4000 },
    { name: '모몬가', code: 'ban3_5', count: 1, price: 4000 },
  ]);
  //   const [select, setSelect] = useState('');
  return (
    <div style={{ position: 'relative' }}>
      <div
        className={dropdownContainer}
        onClick={() => {
          console.log(state);
          setState(!state);
        }}
      >
        <ImgBtn
          img='dropdown'
          size={45}
          style={{
            transform: state ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
        <div className={dropdownTitle}>
          {select || '[필수] 제품을 선택해 주세요.'}
        </div>
      </div>
      <>{state}</>

      {state && (
        <div className={listContainer}>
          {lists.map((key, idx) => (
            <div
              id={key.code}
              key={key.code}
              className={list}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (key.count !== 0) {
                  setSelect(`${idx + 1}. ${key.name}`);
                } else {
                  setSelect('');
                }
                setState(!state);
              }}
            >
              {idx + 1}. {key.name}{' '}
              {key.count !== 0 ? `[${key.count}개]` : '[품절]'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
