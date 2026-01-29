'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ManageUserPage() {
  const router = useRouter();

  return (
    <div>
      <h4 onClick={() => router.push('/manager')}>HOME</h4>
      <>manage user</>
    </div>
  );
}
