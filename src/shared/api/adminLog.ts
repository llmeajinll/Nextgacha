import { adminLogColl } from './mongodb';
import type { AdminLogDoc } from './docs';

type Entry = Omit<AdminLogDoc, 'admin' | 'createdAt'>;

// 관리자 작업 기록 (docs/policies/admin.md "관리자 작업 기록"). admin은 라우트가 auth()로 읽어 넘긴다.
// 작업은 이미 끝났으므로 실패해도 throw하지 않는다
export async function logAdmin(admin: string | null | undefined, entries: Entry | Entry[]) {
  const list = Array.isArray(entries) ? entries : [entries];
  if (list.length === 0) return;
  const createdAt = new Date();
  await adminLogColl
    // 로컬 dev는 관리자 가드를 꺼서 세션이 없을 수 있다
    .insertMany(list.map((e) => ({ ...e, admin: admin ?? 'unknown', createdAt })))
    .catch((err) => console.error('관리자 작업 기록 실패:', err instanceof Error ? err.message : err));
}
