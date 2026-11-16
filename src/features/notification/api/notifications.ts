export type SiteNotification = { message: string; link: string; read: boolean; createdAt: string };

export async function getNotifications(): Promise<{ list: SiteNotification[]; unread: number }> {
  const res = await fetch('/api/protected/getNotifications');
  const data = await res.json().catch(() => ({}));
  return res.ok && data.ok ? { list: data.list, unread: data.unread } : { list: [], unread: 0 };
}

export const readNotifications = () => fetch('/api/protected/postNotificationsRead', { method: 'POST' });
