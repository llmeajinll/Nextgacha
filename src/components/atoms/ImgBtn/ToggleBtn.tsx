import React from 'react';

export default function ToggleBtn({
  value,
  setValue,
  rotate = 'none',
}: {
  value: boolean;
  setValue: React.SetStateAction<any>;
  rotate?: 'none' | 'vertical';
}) {
  return (
    <div
      style={{
        cursor: 'pointer',

        width: rotate === 'none' ? '26px' : '48px',
        height: rotate === 'none' ? '48px' : '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <img
        src={value ? '/images/toggleOn.png' : '/images/toggleOff.png'}
        onClick={() => {
          setValue(!value);
        }}
        style={{
          transform: rotate === 'none' ? '' : 'rotate(90deg)',
          width: '26px',
          height: '48px',
        }}
      />
    </div>
  );
}
