import Image from 'next/image';
import { Close, Image as ImageIcon, Upload } from 'pixelarticons/react';
import { MAX_IMAGES } from '../../lib/productForm';
import type { ProductFormState } from '../../model/useProductForm';
import FormPanel from './FormPanel';
import * as s from './imageFields.css';

// 05 상품 이미지: 대표 이미지 최대 5장
export default function ImageFields({ f }: { f: ProductFormState }) {
  const { existingImages, setImages, allImageUrls, imageError, removeImageAt } = f;
  return (
    <FormPanel
      no='05'
      title='상품 이미지'
      required
      aside={
        <span className={s.pixelCount}>
          {allImageUrls.length} / {MAX_IMAGES}
        </span>
      }
    >
      <div className={s.panelBody}>
        <label className={imageError ? `${s.dropzone} ${s.dropzoneError}` : s.dropzone}>
          <span className={s.dropIcon}>
            <Upload aria-hidden />
          </span>
          <span className={s.dropTitle}>
            이미지를 끌어다 놓거나 <span className={s.link}>파일 선택</span>
          </span>
          <span className={s.hint}>
            정사각형 이미지 권장 · 첫 번째 이미지가 대표 이미지가 돼요 (최대 {MAX_IMAGES}장)
          </span>
          <input
            type='file'
            accept='image/*'
            multiple
            aria-label='상품 이미지 선택'
            className={s.fileInput}
            disabled={allImageUrls.length >= MAX_IMAGES}
            onChange={(e) => {
              const remain = MAX_IMAGES - existingImages.length;
              const selected = Array.from(e.target.files ?? []).slice(0, Math.max(remain, 0));
              setImages(selected);
            }}
          />
        </label>
        {imageError && <span className={s.errorText}>이미지를 한 장 이상 올려 주세요.</span>}
        <div className={s.thumbs}>
          {Array.from({ length: MAX_IMAGES }, (_, i) => {
            const url = allImageUrls[i];
            return (
              <div key={i} className={i === 0 ? `${s.thumb} ${s.thumbMain}` : s.thumb}>
                {url ? (
                  <>
                    <Image src={url} alt={`상품 이미지 ${i + 1}`} width={160} height={160} className={s.thumbImg} />
                    <button
                      type='button'
                      title={`${i + 1}번 이미지 삭제`}
                      className={s.thumbDelete}
                      onClick={() => removeImageAt(i)}
                    >
                      <Close aria-hidden />
                    </button>
                  </>
                ) : (
                  i === 0 && <ImageIcon aria-hidden />
                )}
                {i === 0 && <span className={s.mainBadge}>MAIN</span>}
              </div>
            );
          })}
        </div>
      </div>
    </FormPanel>
  );
}
