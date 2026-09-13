import { DetailTab } from '@/widgets';
import { Profile } from '@/entities/user/ui';
import React from 'react';
import { Provider } from 'jotai';

export default function mypageLayout({ menu }: { menu: React.ReactNode }) {
  return (
    <Provider>
      <div
        style={{
          // border: '1px solid black',
          padding: '30px 20px 0px 20px',
        }}
      >
        <Profile />
        <DetailTab status='mypage' />
        {menu}
      </div>
    </Provider>
  );
}
