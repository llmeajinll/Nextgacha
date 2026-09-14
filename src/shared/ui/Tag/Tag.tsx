'use client';

import React from 'react';
import { tag, tagColor } from './tag.css';
import { vars } from '@/styles/theme.css';
import { assignInlineVars } from '@vanilla-extract/dynamic';

type Props = { word: string; color: string };

export default function Tag(status: Props) {
  return (
    <div className={tag} style={assignInlineVars({ [tagColor]: status.color })}>
      {status.word}
    </div>
  );
}
