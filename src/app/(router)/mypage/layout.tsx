import { DetailTab } from '@/widgets';
import { Profile } from '@/entities/user/ui';
import React from 'react';
import { Provider } from 'jotai';
import { wrapper } from './layout.css';

export default function mypageLayout({ menu }: { menu: React.ReactNode }) {
  return (
    <Provider>
      <div className={wrapper}>
        <Profile />
        <DetailTab status='mypage' />
        {menu}
      </div>
    </Provider>
  );
}
