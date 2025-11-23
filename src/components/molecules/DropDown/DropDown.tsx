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
import { addToTempCartAtom } from '@/jotai/store';

import { useSetAtom } from 'jotai';
import { useDropDown } from '@/app/hooks/useDropDown';

import { CardProps } from '@/shared/type';
import useSplitRoute from '@/app/hooks/useSplitRoute';

type DropDownType = Pick<
  CardProps,
  'list' | 'group' | 'num' | 'price' | 'title'
>;

export default function DropDown({
  props,
  status,
}: {
  props: DropDownType;
  status?: boolean;
}) {
  console.log(props);
  const addToTempCart = useSetAtom(addToTempCartAtom);

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
              id={val.name + props.num}
              key={idx}
              className={listStyle}
              onClick={() => {
                if (val.count !== 0 || status) {
                  setSelected(`${idx + 1}. ${val.name}`);
                  addToTempCart({
                    code: val.name + props.num,
                    name: val.name,
                    title: props.title,
                    count: 1,
                    price: props.price,
                    num: props.num,
                    limit: val.count,
                  });
                } else {
                  setSelected('');
                }
                toggle;
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
