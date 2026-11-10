import { errorColl } from '@/shared/api/mongodb';
import { ERROR_PAGE_SIZE, ERROR_STATUSES, type ErrorStatus, type ErrorTypeFilter } from '../model/types';
import { normalizeError, PAYMENT_MESSAGE, SYSTEM_PATH } from './normalizeError';

// status·type이 없는 옛 문서도 잡도록 null(필드 없음) 조건을 같이 건다 (normalizeError와 같은 기준)
const byStatus = (status: ErrorStatus) => (status === '접수' ? { status: { $in: ['접수', null] } } : { status });

const byType = (type: ErrorTypeFilter) =>
  type === 'all'
    ? {}
    : type === 'system'
      ? { $or: [{ type: 'system' }, { type: null, pathname: SYSTEM_PATH }] }
      : { $or: [{ type: 'report' }, { type: null, pathname: { $not: SYSTEM_PATH } }] };

// 관리자 오류 목록 (최근 순, 20개씩) + 상태 탭 건수 + 처리 안 한 결제 기록 수
export async function findErrors(status: ErrorStatus, type: ErrorTypeFilter, page = 1) {
  const query = { $and: [byStatus(status), byType(type)] };
  const [docs, total, counts, paymentOpen] = await Promise.all([
    errorColl
      .find(query)
      .sort({ _id: -1 })
      .skip((Math.max(page, 1) - 1) * ERROR_PAGE_SIZE)
      .limit(ERROR_PAGE_SIZE)
      .toArray(),
    errorColl.countDocuments(query),
    Promise.all(ERROR_STATUSES.map((s) => errorColl.countDocuments({ $and: [byStatus(s.status), byType(type)] }))),
    errorColl.countDocuments({ $and: [byStatus('접수'), byType('system'), { textareaValue: PAYMENT_MESSAGE }] }),
  ]);
  return {
    result: docs.map(normalizeError),
    total,
    counts: Object.fromEntries(ERROR_STATUSES.map((s, i) => [s.status, counts[i]])) as Record<ErrorStatus, number>,
    paymentOpen,
  };
}
