'use client';

import React from 'react';
import { ChevronDown, ChevronUp } from 'pixelarticons/react';
import { useDropDown } from '@/shared/hooks/useDropDown';
import {
  dropdownWrapper,
  dropdownContainer,
  dropdownTitle,
  arrow,
  listContainer,
  listStyle,
  groupLabel,
} from './dropDown.css';

// group이 바뀌는 자리에 그룹 이름을 한 줄 넣는다
export type DropDownOption = { value: string; label: string; group?: string };

// label: 닫혀 있을 때 보일 글자(부모가 정함). 비어 있으면 placeholder
export default function DropDown({
  id,
  label,
  placeholder,
  options,
  onSelect,
  className,
}: {
  id?: string;
  label?: string;
  placeholder: string;
  options: DropDownOption[];
  onSelect: (value: string) => void;
  className?: string;
}) {
  const { isOpen, setIsOpen, toggle, dropdownRef } = useDropDown('');
  const Arrow = isOpen ? ChevronUp : ChevronDown;

  return (
    <div
      className={`${dropdownWrapper} ${className ?? ''}`}
      ref={dropdownRef}
      onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
    >
      <button type='button' id={id} aria-expanded={isOpen} className={dropdownContainer} onClick={toggle}>
        <span className={dropdownTitle}>{label || placeholder}</span>
        <Arrow width={24} height={24} className={arrow} aria-hidden />
      </button>

      {isOpen && (
        <ul className={listContainer}>
          {options.map((o, i) => (
            <React.Fragment key={`${o.group ?? ''}-${o.value}-${i}`}>
              {o.group && o.group !== options[i - 1]?.group && <li className={groupLabel}>{o.group}</li>}
              <li>
                <button
                  type='button'
                  className={listStyle}
                  onClick={() => {
                    onSelect(o.value);
                    setIsOpen(false);
                  }}
                >
                  {o.label}
                </button>
              </li>
            </React.Fragment>
          ))}
        </ul>
      )}
    </div>
  );
}
