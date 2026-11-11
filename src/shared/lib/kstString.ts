// MongoDB 집계 식: 날짜 필드를 koreaTime()과 같은 'YYYY-MM-DD HH:mm:ss'(KST) 문자열로.
// 예전 문서는 Date, 새 문서는 문자열로 저장돼 있어 둘 다 받는다. 없으면 ''
export const kstString = (field: string) => ({
  $cond: [
    { $eq: [{ $type: field }, 'date'] },
    { $dateToString: { date: field, format: '%Y-%m-%d %H:%M:%S', timezone: 'Asia/Seoul' } },
    { $ifNull: [{ $toString: field }, ''] },
  ],
});
