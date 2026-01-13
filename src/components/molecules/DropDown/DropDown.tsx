'use client';

import React from 'react';
import {
  dropdownContainer,
  dropdownTitle,
  listContainer,
  listStyle,
} from './dropdown.css';
// import Image from 'next/image';
import { ImgBtn } from '@/components/atoms';

import { useSetAtom } from 'jotai';
import { useDropDown } from '@/app/hooks/useDropDown';

import { CardProps } from '@/shared/type';
import useSplitRoute from '@/app/hooks/useSplitRoute';
import { useTempCart } from '@/app/hooks';

type DropDownType = Pick<CardProps, 'list' | 'num'>;

export default function DropDown({
  props,
  status,
}: {
  props: DropDownType;
  status?: boolean;
}) {
  console.log(props);
  const { increase } = useTempCart(props.num);

  const { isOpen, selected, toggle, setSelected, dropdownRef } =
    useDropDown('');

  // console.log('status: ', isOpen);
  const { secondRoute } = useSplitRoute();
  // const status = true;
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
          {props?.list?.map((val, idx) => (
            <div
              className={listStyle}
              id={val.name + props.num}
              key={idx}
              onClick={() => {
                if (val.count !== 0 || status) {
                  setSelected(`${idx + 1}. ${val.name}`);
                  increase({ name: val.name });
                } else {
                  setSelected('');
                }
                toggle();
              }}
            >
              {idx + 1}. {val.name}{' '}
              {val.count !== 0
                ? `[${val.count}개]`
                : status
                ? '[예약]'
                : '[품절]'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
