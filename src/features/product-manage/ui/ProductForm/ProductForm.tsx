'use client';

import { Suspense } from 'react';
import { Card } from '@/entities/product/ui';
import { Btn, Chip, DropDown, PageHeader } from '@/shared/ui';
import { comma } from '@/shared/lib/comma';
import useProductForm from '../../model/useProductForm';
import FormPanel from './FormPanel';
import OptionFields from './OptionFields';
import ReserveFields from './ReserveFields';
import ImageFields from './ImageFields';
import DetailBlocks from './DetailBlocks';
import * as s from './productForm.css';

function ProductAddForm() {
  const f = useProductForm();
  const {
    router,
    isEdit,
    editNum,
    menu,
    loadingInitial,
    title,
    setTitle,
    company,
    setCompany,
    group,
    setGroup,
    price,
    setPrice,
    discount,
    setDiscount,
    submitted,
    sending,
    sendError,
    priceNum,
    disc,
    invalid,
    nameError,
    groupError,
    priceError,
    submit,
    groupOptions,
    previewProps,
  } = f;

  if (loadingInitial) {
    return (
      <div className={s.container}>
        <PageHeader eyebrow='EDIT PRODUCT' title='상품 정보 불러오는 중…' />
      </div>
    );
  }

  return (
    <div className={s.container}>
      <PageHeader
        eyebrow={isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
        title={isEdit ? `상품 수정 · #${editNum}` : '상품 추가'}
        description={
          isEdit
            ? '상품의 모든 정보(제목, 이미지, 카테고리, 옵션 등)를 수정합니다. * 표시는 필수 항목이에요.'
            : '새 캡슐토이 상품을 등록합니다. * 표시는 필수 항목이에요.'
        }
      />

      <div className={s.columns}>
        <form aria-label={isEdit ? '상품 수정' : '상품 등록'} className={s.form} onSubmit={submit} noValidate>
          <FormPanel no='01' title='기본 정보'>
            <div className={`${s.panelBody} ${s.grid}`}>
              <div className={`${s.field} ${s.fieldFull}`}>
                <label htmlFor='pa-name' className={s.label}>
                  상품명 <span className={s.required}>*</span>
                </label>
                <input
                  id='pa-name'
                  value={title}
                  maxLength={100}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder='예: [시리즈명] 캡슐토이 1탄'
                  aria-invalid={nameError}
                  className={nameError ? `${s.input} ${s.inputError}` : s.input}
                />
                {nameError && <span className={s.errorText}>상품명을 입력해 주세요.</span>}
              </div>
              <div className={s.field}>
                <label htmlFor='pa-group' className={s.label}>
                  카테고리 <span className={s.required}>*</span>
                </label>
                <DropDown
                  id='pa-group'
                  placeholder='카테고리 추가'
                  options={groupOptions}
                  onSelect={(v) => !group.includes(v) && setGroup([...group, v])}
                />
                {groupError && <span className={s.errorText}>카테고리를 하나 이상 골라 주세요.</span>}
              </div>
              <div className={s.field}>
                <label htmlFor='pa-company' className={s.label}>
                  제조사
                </label>
                <DropDown
                  id='pa-company'
                  label={menu?.series.find((m) => m.company === company)?.name}
                  value={company}
                  placeholder='제조사 선택'
                  options={[
                    { value: '', label: '선택 안 함' },
                    ...(menu?.series.map((m) => ({ value: m.company, label: m.name })) ?? []),
                  ]}
                  onSelect={setCompany}
                />
              </div>
              {group.length > 0 && (
                <div className={`${s.chips} ${s.fieldFull}`}>
                  {group.map((v) => (
                    <Chip
                      key={v}
                      label={v}
                      removeTitle={`${v} 카테고리 빼기`}
                      onRemove={() => setGroup(group.filter((g) => g !== v))}
                    />
                  ))}
                </div>
              )}
            </div>
          </FormPanel>

          <FormPanel no='02' title='가격'>
            <div className={`${s.panelBody} ${s.grid}`}>
              <div className={s.field}>
                <label htmlFor='pa-price' className={s.label}>
                  정가 <span className={s.required}>*</span>
                </label>
                <div className={s.unitRow}>
                  <input
                    id='pa-price'
                    type='number'
                    min={1}
                    inputMode='numeric'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder='0'
                    aria-invalid={priceError}
                    className={priceError ? `${s.input} ${s.inputError}` : s.input}
                  />
                  <span className={s.unit}>원</span>
                </div>
                {priceError && <span className={s.errorText}>정가를 입력해 주세요.</span>}
              </div>
              <div className={s.field}>
                <label htmlFor='pa-disc' className={s.label}>
                  할인율
                </label>
                <div className={s.unitRow}>
                  <input
                    id='pa-disc'
                    type='number'
                    min={0}
                    max={99}
                    inputMode='numeric'
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder='0'
                    className={s.input}
                  />
                  <span className={s.unit}>%</span>
                </div>
              </div>
              <div className={s.field}>
                <span className={s.label}>
                  판매가 <span className={s.hint}>자동 계산</span>
                </span>
                <div className={s.salePrice} aria-live='polite'>
                  <span>{priceNum ? comma(priceNum * (1 - disc / 100)) : '—'}</span>
                  <span className={s.saleUnit}>원</span>
                </div>
              </div>
            </div>
          </FormPanel>

          <OptionFields f={f} />

          <ReserveFields f={f} />

          <ImageFields f={f} />

          <DetailBlocks f={f} />

          <div className={s.actions}>
            {((submitted && invalid) || sendError) && (
              <span role='status' className={s.formError}>
                {sendError || '필수 항목을 확인해 주세요.'}
              </span>
            )}
            <Btn
              kind='neutral'
              scale='l'
              px
              onClick={(e) => {
                // Btn은 type을 못 받아서 폼 안에서는 submit 버튼이 됨
                e.preventDefault();
                router.push('/manager/product_manage');
              }}
            >
              CANCEL
            </Btn>
            <Btn kind='primary' scale='l' px disabled={sending}>
              {sending ? 'SAVING…' : isEdit ? '수정 완료' : 'REGISTER'}
            </Btn>
          </div>
        </form>

        <aside aria-label='상품 카드 미리보기' className={s.preview}>
          <div className={s.previewHead}>
            <span>카드 미리보기</span>
            <span className={s.panelNo}>PREVIEW</span>
          </div>
          <div className={s.previewBox}>
            <Card preview props={previewProps} />
          </div>
          <p className={s.hint}>입력한 내용이 쇼핑몰 상품 카드에 이렇게 보여요.</p>
        </aside>
      </div>
    </div>
  );
}

// 관리자 상품 등록·수정 화면 (/manager/product_add, ?edit=번호면 수정)
export default function ProductForm() {
  return (
    <Suspense
      fallback={
        <div className={s.container}>
          <PageHeader eyebrow='PRODUCT' title='불러오는 중…' />
        </div>
      }
    >
      <ProductAddForm />
    </Suspense>
  );
}
