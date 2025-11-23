import { Profile, DetailTab } from '@/components/molecules';
import React from 'react';

export default function mypageLayout({ menu }: { menu: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid black', padding: '30px 20px 0px 20px' }}>
      <Profile />
      <DetailTab status='mypage' />
      {menu}
    </div>
  );
}
