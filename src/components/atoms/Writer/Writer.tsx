import dayjs from 'dayjs';
import React from 'react';
import Range from '../Range/Range';

export default function Writer({
  writer,
  created_at,
  preset = 'left',
  className,
  style,
}: {
  writer: string;
  created_at: string;
  preset?: string;
  className?: string;
  style?: React.CSSProperties;
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
    <Range
      style={{
        marginLeft: `${preset === 'right' ? '0px' : 'auto'}`,
        fontSize: '12px',
        lineHeight: '25px',
        color: 'gray',
        fontFamily: 'silkscreen',
        ...style,
      }}
      className={className}
    >
      written by {changeStar(writer)} at{' '}
      {dayjs(created_at).format('YYYY-MM-DD')}
    </Range>
  );
}
