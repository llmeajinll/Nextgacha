import { Plus } from 'pixelarticons/react';
import { ImgBtn } from '@/shared/ui';
import { pad } from '../../lib/productForm';
import type { ProductFormState } from '../../model/useProductForm';
import FormPanel from './FormPanel';
import * as s from './optionFields.css';

// 03 상품 옵션: 이름·수량 목록
export default function OptionFields({ f }: { f: ProductFormState }) {
  const { isEdit, list, setList, submitted, optionErrors, setOption } = f;
  return (
    <FormPanel
      no='03'
      title='상품 옵션'
      required
      aside={
        <span className={s.count} aria-live='polite'>
          {list.length}종
        </span>
      }
    >
      <div className={s.panelBody}>
        <p className={s.hint}>캡슐에 들어갈 종류를 하나씩 추가하세요. 옵션마다 이름과 수량(재고)을 꼭 입력해야 해요.</p>
        <div className={s.optionHead} aria-hidden>
          <span className={s.optionHeadNo}>NO</span>
          <span className={s.optionName}>NAME</span>
          <span className={s.optionQty}>QTY</span>
          <span className={s.optionHeadTool} />
        </div>
        {list.map((o, i) => (
          <div key={i} className={s.field}>
            <div className={s.optionRow}>
              <span className={s.optionNo}>{pad(i + 1)}</span>
              <input
                value={o.name}
                maxLength={50}
                onChange={(e) => setOption(i, 'name', e.target.value)}
                aria-label={`${i + 1}번 옵션 이름`}
                placeholder='옵션 이름 (예: [캐릭터명])'
                className={`${s.input} ${s.optionName}`}
              />
              <div className={`${s.unitRow} ${s.optionQty}`}>
                <input
                  type='number'
                  min={isEdit ? 0 : 1}
                  inputMode='numeric'
                  value={o.count}
                  onChange={(e) => setOption(i, 'count', e.target.value)}
                  aria-label={`${i + 1}번 옵션 수량`}
                  placeholder='0'
                  className={s.input}
                />
                <span className={s.unit}>개</span>
              </div>
              <ImgBtn
                img='trash'
                size={24}
                title={`${i + 1}번 옵션 삭제`}
                className={`${s.iconBtn} ${s.iconBtnBox}`}
                disabled={list.length <= 1}
                onClick={() => setList(list.filter((_, j) => j !== i))}
              />
            </div>
            {submitted && optionErrors[i] && (
              <span className={`${s.errorText} ${s.optionError}`}>{optionErrors[i]}</span>
            )}
          </div>
        ))}
        <button
          type='button'
          className={`${s.slotBtn} ${s.slotBtnText}`}
          onClick={() => setList([...list, { name: '', count: '' }])}
        >
          <Plus aria-hidden />
          옵션 추가
        </button>
      </div>
    </FormPanel>
  );
}
