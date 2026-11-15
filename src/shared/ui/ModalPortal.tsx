'use client';
import { createPortal } from 'react-dom';
import { useIsClient } from '@/shared/hooks';

export default function ModalPortal({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useIsClient();

  if (!mounted) return null;

  return createPortal(
    children,
    document.getElementById('modal-root') as HTMLElement
  );
}
