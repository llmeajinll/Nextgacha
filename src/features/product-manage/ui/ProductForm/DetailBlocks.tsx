import Image from 'next/image';
import { Image as ImageIcon, Plus } from 'pixelarticons/react';
import { ImgBtn } from '@/shared/ui';
import { textareaBox, textareaCount } from '@/styles/ui.css';
import { pad } from '../../lib/productForm';
import type { ProductFormState } from '../../model/useProductForm';
import FormPanel from './FormPanel';
import * as s from './imageFields.css';

// 06 상세 설명: 글·이미지 블록을 순서대로 쌓음
export default function DetailBlocks({ f }: { f: ProductFormState }) {
  const { blocks, setBlocks, submitted, blockErrors, moveBlock, addBlock } = f;
  return (
    <FormPanel no='06' title='상세 설명'>
      <div className={s.panelBody}>
        <p className={s.hint}>글과 이미지를 원하는 순서로 쌓아 상세 페이지를 만들어요. 위에서부터 차례로 보여요.</p>
        {blocks.map((b, i) => (
          <div key={b.id} className={s.field}>
            <div className={s.block}>
              <div className={s.blockHead}>
                <span className={s.blockKind}>
                  {pad(i + 1)} · {b.type === 'text' ? 'TEXT' : 'IMAGE'}
                </span>
                <div className={s.blockTools}>
                  <ImgBtn
                    img='up'
                    size={24}
                    title='위로 이동'
                    className={s.iconBtn}
                    disabled={i === 0}
                    onClick={() => moveBlock(i, -1)}
                  />
                  <ImgBtn
                    img='down'
                    size={24}
                    title='아래로 이동'
                    className={s.iconBtn}
                    disabled={i === blocks.length - 1}
                    onClick={() => moveBlock(i, 1)}
                  />
                  <ImgBtn
                    img='trash'
                    size={24}
                    title='블록 삭제'
                    className={s.iconBtn}
                    onClick={() => setBlocks(blocks.filter((x) => x.id !== b.id))}
                  />
                </div>
              </div>
              {b.type === 'text' ? (
                <div className={textareaBox}>
                  <textarea
                    rows={4}
                    maxLength={2000}
                    value={b.text}
                    onChange={(e) => setBlocks(blocks.map((x) => (x.id === b.id ? { ...b, text: e.target.value } : x)))}
                    aria-label={`${i + 1}번 설명 글`}
                    placeholder='구성품, 크기, 주의사항 등을 적어 주세요.'
                    className={s.textarea}
                  />
                  <span className={textareaCount}>{b.text.length}/2000</span>
                </div>
              ) : (
                <>
                  {b.url && !b.file && (
                    <div className={s.blockPreview}>
                      <Image
                        src={b.url}
                        alt={`상세 이미지 ${i + 1}`}
                        width={400}
                        height={300}
                        className={s.blockPreviewImg}
                      />
                    </div>
                  )}
                  <label className={s.blockDrop}>
                    <span className={`${s.dropIcon} ${s.blockDropIcon}`}>
                      <ImageIcon aria-hidden />
                    </span>
                    <span className={s.blockDropTitle}>
                      {b.file ? b.file.name : b.url ? '기존 이미지 유지 중' : '상세 이미지'}{' '}
                      <span className={s.link}>{b.file || b.url ? '바꾸기' : '파일 선택'}</span>
                    </span>
                    <span className={s.blockDropHint}>가로 960px 권장 · 세로로 긴 이미지도 괜찮아요</span>
                    <input
                      type='file'
                      accept='image/*'
                      aria-label={`${i + 1}번 상세 이미지 선택`}
                      className={s.fileInput}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        setBlocks(blocks.map((x) => (x.id === b.id ? { ...b, file } : x)));
                      }}
                    />
                  </label>
                </>
              )}
            </div>
            {submitted && blockErrors[i] && <span className={s.errorText}>{blockErrors[i]}</span>}
          </div>
        ))}
        <div className={s.slotGrid}>
          <button type='button' className={s.slotBtn} onClick={() => addBlock('text')}>
            <Plus aria-hidden />
            ADD TEXT
          </button>
          <button type='button' className={s.slotBtn} onClick={() => addBlock('image')}>
            <Plus aria-hidden />
            ADD IMAGE
          </button>
        </div>
      </div>
    </FormPanel>
  );
}
