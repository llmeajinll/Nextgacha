export interface QnaProps {
  qna_num: number;
  email: string; // 마스킹된 값 (abc***)
  isMine: boolean;
  request: { writer: string; content: string }[];
  created_at: string;
  updated_at: string;
  question: string;
  private: boolean;
}
