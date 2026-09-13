'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { CartTemplate } from '@/widgets';
import { Cart } from '@/features/cart/ui';
import { AddressTruck } from '@/entities/order/ui';
import { EmptyCard } from '@/shared/ui';

export default function page() {
  return (
    <>
      <Suspense fallback={<EmptyCard>CART LOADING...</EmptyCard>}>
        <CartTemplate />
      </Suspense>
    </>
  );
}
