'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell } from 'pixelarticons/react';
import { toKoreaTime } from '@/shared/lib/koreaTime';
import { getNotifications, readNotifications } from '../api/notifications';
import * as s from './notificationBell.css';

// 사이트 안 알림 (재입고 예정, 자동 환불 안내). 로그인한 사용자에게만 보인다
export default function NotificationBell() {
  const { status } = useSession();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    enabled: status === 'authenticated',
    // ponytail: 1분마다 다시 물어봄. 실시간이 필요해지면 SSE/웹소켓
    refetchInterval: 60_000,
  });
  if (status !== 'authenticated') return null;

  const unread = data?.unread ?? 0;
  const toggle = async () => {
    setOpen(!open);
    if (!open && unread > 0) {
      await readNotifications();
      // 목록의 '새 알림' 표시는 닫을 때까지 남기고 배지만 지운다
      queryClient.setQueryData(['notifications'], { list: data?.list ?? [], unread: 0 });
    }
  };

  return (
    <div
      className={s.wrap}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type='button'
        className={s.bell}
        aria-expanded={open}
        aria-label={unread ? `알림, 새 알림 ${unread}개` : '알림'}
        onClick={toggle}
      >
        <Bell width={22} height={22} aria-hidden />
        {unread > 0 && <span className={s.badge}>{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div role='dialog' aria-label='알림' className={s.panel}>
          {data?.list.length ? (
            data.list.map((n, i) => (
              <Link key={i} href={n.link} className={n.read ? s.item : `${s.item} ${s.itemNew}`} onClick={() => setOpen(false)}>
                <span>{n.message}</span>
                <span className={s.date}>{toKoreaTime(n.createdAt).format('MM.DD HH:mm')}</span>
              </Link>
            ))
          ) : (
            <p className={s.empty}>새 알림이 없습니다.</p>
          )}
        </div>
      )}
    </div>
  );
}
