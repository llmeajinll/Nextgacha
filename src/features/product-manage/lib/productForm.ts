export const MAX_IMAGES = 5;
// Vercel 함수 요청 본문 한도(4.5MB)보다 조금 작게
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

// 상세 설명 블록 (글 / 이미지). url은 이미 올라간 이미지, file은 새로 고른 파일
export type Block = { id: number; type: 'text'; text: string } | { id: number; type: 'image'; file: File | null; url?: string };

export const pad = (n: number) => String(n).padStart(2, '0');
export const ymd = (d: Date) => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
