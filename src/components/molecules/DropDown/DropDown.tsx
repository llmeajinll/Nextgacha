'use client';

import React, { useState } from 'react';
import {
  dropdownContainer,
  dropdownTitle,
  listContainer,
  listStyle,
} from './dropdown.css';
import Image from 'next/image';
import { ImgBtn, Range } from '@/components/atoms';
import { addToTempCartAtom } from '@/jotai/store';

import { useSetAtom } from 'jotai';
import { useDropDown } from '@/app/hooks/useDropDown';

import { CardProps } from '@/shared/type';
import useSplitRoute from '@/app/hooks/useSplitRoute';

type DropDownType = Pick<
  CardProps,
  'list' | 'group' | 'num' | 'price' | 'title'
>;

export default function DropDown({ props }: { props: DropDownType }) {
  const addToTempCart = useSetAtom(addToTempCartAtom);

  const { isOpen, selected, toggle, setSelected, dropdownRef } =
    useDropDown('');

  console.log('status: ', isOpen);
  const { secondRoute } = useSplitRoute();
  const status = true;
  //   const [select, setSelect] = useState('');
  return (
    <div style={{ position: 'relative', zIndex: 10 }} ref={dropdownRef}>
      <div className={dropdownContainer} onClick={toggle}>
        <ImgBtn
          img='dropdown'
          size={45}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
        <div className={dropdownTitle}>
          {selected || '[필수] 제품을 선택해 주세요.'}
        </div>
      </div>

      {isOpen && (
        <div className={listContainer}>
          {props?.list?.map((key, idx) => (
            <div
              id={key.name + secondRoute}
              key={key.name + secondRoute}
              className={listStyle}
              onClick={() => {
                if (key.count !== 0) {
                  setSelected(`${idx + 1}. ${key.name}`);
                  addToTempCart({
                    code: key.name + secondRoute,
                    name: key.name,
                    title: props.title,
                    count: 1,
                    price: props.price,
                  });
                } else {
                  setSelected('');
                }
                toggle;
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
