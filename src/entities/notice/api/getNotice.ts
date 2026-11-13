import type { Notice, NoticeLink } from '../model/types';

export async function getNotices(): Promise<Notice[]> {
  const res = await fetch('/api/getNotice');
  if (!res.ok) throw new Error('공지 조회 실패');
  return (await res.json()).notices;
}

export async function getNotice(num: number): Promise<{ notice: Notice; prev?: NoticeLink; next?: NoticeLink } | null> {
  const res = await fetch(`/api/getNotice?num=${num}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('공지 조회 실패');
  const { notice, prev, next } = await res.json();
  return { notice, prev, next };
}
