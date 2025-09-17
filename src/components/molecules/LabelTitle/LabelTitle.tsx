import React from 'react';
import { Range } from '@/components/atoms';
import { contentStyle } from './labeltitle.css';
import { labelVariant, contentVariant } from '@/styles/variants.css';

type Props = {
  label?: string;
  content?: string;
  status?: 'small' | 'large';
  align?: 'right';
};

export default function LabelTitle({
  label,
  content,
  status = 'small',
  align,
}: Props) {
  return (
    <Range width='full' justify={align === 'right' ? 'right' : undefined}>
      <Range align='center'>
        <div className={labelVariant[status]}>{label}</div>
        <div className={`${contentVariant[status]} ${contentStyle}`}>
          {content}
        </div>
      </Range>
    </Range>
  );
}
