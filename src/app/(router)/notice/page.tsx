import React from 'react';
import { NoticeTemplate } from '@/widgets';
import { findLiveNotices } from '@/entities/notice/lib/findNotices';

// 예약 공지가 시각이 되면 바로 보이게 매 요청 조회
export const dynamic = 'force-dynamic';

export default async function Page() {
  return <NoticeTemplate notices={await findLiveNotices()} />;
}
