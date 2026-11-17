import { textareaBox, textareaCount } from '@/styles/ui.css';
import * as s from './order.css';

// 거절·반려 사유 입력 (최대 200자, 글자 수 표시)
export default function ReasonField({
  id,
  label,
  value,
  onChange,
  placeholder,
  invalid,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  invalid: boolean;
}) {
  return (
    <>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <div className={textareaBox}>
        <textarea
          id={id}
          rows={2}
          maxLength={200}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={invalid}
          className={invalid ? `${s.textarea} ${s.inputError}` : s.textarea}
        />
        <span className={textareaCount}>{value.length}/200</span>
      </div>
    </>
  );
}
