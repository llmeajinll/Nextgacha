'use client';

import React from 'react';
import { tag, tagColor } from './tag.css';
import { vars } from '@/styles/theme.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';

export default function Tag(status: { word: string; color: string }) {
  //   let color = '';
  let word = '';
  let color = null;

  return (
    <div className={tag} style={assignInlineVars({ [tagColor]: status.color })}>
      {status.word}
    </div>
  );
}
