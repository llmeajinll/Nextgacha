'use client';

import React, { useState } from 'react';
import { DropDown as BaseDropDown } from '@/shared/ui';
import { CardProps } from '@/entities/product/model/types';
import { useTempCart } from '@/features/cart/model';
import { dropdown } from './dropdown.css';

type DropDownType = Pick<CardProps, 'list' | 'num'>;

export default function DropDown({
  props,
  status,
}: {
  props: DropDownType;
  status?: boolean;
}) {
  const { increase } = useTempCart(props.num);
  const [selected, setSelected] = useState('');

  const options = (props?.list ?? []).map((val, idx) => ({
    value: String(idx),
    label: `${idx + 1}. ${val.name} ${
      val.count !== 0 ? `[${val.count}개]` : status ? '[예약]' : '[품절]'
    }`,
  }));

  return (
    <BaseDropDown
      className={dropdown}
      label={selected}
      placeholder='[필수] 제품을 선택해 주세요.'
      options={options}
      onSelect={(v) => {
        const idx = Number(v);
        const val = props.list[idx];
        if (val.count !== 0 || status) {
          setSelected(`${idx + 1}. ${val.name}`);
          increase({ name: val.name });
        } else {
          setSelected('');
        }
      }}
    />
  );
}
