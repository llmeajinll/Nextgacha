'use client';

import React, { useState } from 'react';
import { ProductPurchasePanel } from '../organisms';
import { DetailTab } from '../molecules';

export default function DetailTemplate() {
  return (
    <div style={{ width: 'fit-content', margin: '50px auto 0 auto' }}>
      <ProductPurchasePanel />
      <DetailTab />
    </div>
  );
}
