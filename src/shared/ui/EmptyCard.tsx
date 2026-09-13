import React from 'react';

export default function EmptyCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        width: '100%',
        height: '130px',
        padding: '20px',
        border: '1px solid lightgray',
        fontFamily: 'silkscreen',
        color: 'gray',
        fontSize: '30px',
        textAlign: 'center',
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        lineHeight: '24px',
        marginTop: '15px',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
