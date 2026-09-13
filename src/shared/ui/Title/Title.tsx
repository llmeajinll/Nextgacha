'use client';

import { title } from './title.css';
import React from 'react';

export default function Title(props: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`${title}${props.className ?? ''}`}
      style={{ ...props.style }}
    >
      {props.text}
    </div>
  );
}
