import React from 'react';
import { tag, tagL, tagTone } from '@/styles/ui.css';
import { NOTICE_CATEGORIES, type NoticeCategory } from '../model/types';
import { noticeTag } from './notice.css';

// 분류 태그: 분류마다 상태색(tone)이 정해져 있다
export default function NoticeTag({ category }: { category: NoticeCategory }) {
  const c = NOTICE_CATEGORIES.find((v) => v.key === category) ?? NOTICE_CATEGORIES[0];
  return <span className={`${tag} ${tagL} ${tagTone[c.tone]} ${noticeTag}`}>{c.label}</span>;
}
