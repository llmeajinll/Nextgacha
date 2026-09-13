export interface QnaProps {
  qna_num: number;
  email: string;
  request: { writer: string; content: string }[];
  created_at: string;
  updated_at: string;
  question: string;
  private: boolean;
}
