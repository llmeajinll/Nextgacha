'use client';

import React, { useEffect, useRef } from 'react';
import { Range } from '@/components/atoms';
import { ticketContainer } from './ticketcontainer.css';
import { ticketContainerVariant } from '@/styles/variants.css';

type StatusType = keyof typeof ticketContainerVariant;

export default function TicketContainer({
  children,
  status = 'none',
}: {
  children: React.ReactNode;
  status?: StatusType;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <Range
      preset='left'
      className={`${ticketContainerVariant[status]} ${ticketContainer}`}
      ref={scrollRef}
    >
      {children}
    </Range>
  );
}
