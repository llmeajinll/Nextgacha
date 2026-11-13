import React from 'react';
import { notFound } from 'next/navigation';
import { NoticeDetailPage } from '@/views';
import { findLiveNotice } from '@/entities/notice/lib/findNotices';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ num: string }> }) {
  const num = Number((await params).num);
  const found = Number.isInteger(num) && num > 0 ? await findLiveNotice(num) : null;
  if (!found) notFound();
  return <NoticeDetailPage {...found} />;
}
