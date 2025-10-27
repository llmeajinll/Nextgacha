import React from 'react';
import { Range } from '@/components/atoms';
import { contentStyle } from './labeltitle.css';
import { labelVariant, contentVariant } from '@/styles/variants.css';

type Props = {
  label: string;
  content: string;
  status?: keyof typeof labelVariant;
};

export default function LabelTitle({ label, content, status }: Props) {
  return (
    <Range>
      <div className={labelVariant[status ?? 'small']}>{label}</div>
      <div className={`${contentVariant[status ?? 'small']} ${contentStyle}`}>
        {content}
      </div>
    </Range>
  );
}
