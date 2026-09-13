'use client';

import { title } from './title.css';
import React from 'react';

export default function Title(props: { text: string; className?: string }) {
  return (
    <div className={`${title} ${props.className ?? ''}`}>{props.text}</div>
  );
}
