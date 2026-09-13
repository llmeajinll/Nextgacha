import dayjs from 'dayjs';
import React from 'react';
import Range from '../Range/Range';
import { writerRight } from './writer.css';

export default function Writer({
  writer,
  created_at,
}: {
  writer: string;
  created_at: string;
}) {
  const changeStar = (writer: string) => {
    if (!writer) return '';
    if (writer === 'anonymity') return 'anonymity';

    const [id] = writer.split('@');

    if (id.length <= 3) {
      return '*'.repeat(id.length);
    }

    const visible = id.slice(0, 3);
    const masked = '*'.repeat(id.length - 3);
    return visible + masked;
  };

  return (
    <Range className={writerRight}>
      written by {changeStar(writer)} at{' '}
      {dayjs(created_at).format('YYYY-MM-DD hh:mm:ss')}
    </Range>
  );
}
