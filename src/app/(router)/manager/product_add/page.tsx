'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Close, Image as ImageIcon, Plus, Upload } from 'pixelarticons/react';
import getCategoryMenu from '@/entities/product/api/getCategoryMenu';
import getOneProduct from '@/entities/product/api/getOneProduct';
import { Card } from '@/entities/product/ui';
import type { CardProps } from '@/entities/product/model/types';
import { Btn, Chip, DropDown, ImgBtn, ToggleBtn } from '@/shared/ui';
import { comma } from '@/shared/lib/comma';
import { textareaBox, textareaCount } from '@/styles/ui.css';
import * as s from './page.css';

const MAX_IMAGES = 5;
// Vercel 함수 요청 본문 한도(4.5MB)보다 조금 작게
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

type Block = { id: number; type: 'text'; text: string } | { id: number; type: 'image'; file: File | null; url?: string };

const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date) => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;

function ProductAddForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editParam = searchParams.get('edit') || searchParams.get('num');
  const editNum = editParam && Number.isInteger(Number(editParam)) ? Number(editParam) : null;
  const isEdit = editNum !== null;

  const { data: menu } = useQuery({ queryKey: ['categoryMenu'], queryFn: getCategoryMenu });

  const [loadingInitial, setLoadingInitial] = useState(isEdit);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [group, setGroup] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [list, setList] = useState([
    { name: '', count: '' },
    { name: '', count: '' },
  ]);
  const [reserve, setReserve] = useState(false);
  const [resStart, setResStart] = useState<Date | null>(null);
  const [resEnd, setResEnd] = useState<Date | null>(null);
  const [resShip, setResShip] = useState<Date | null>(null);

  // 대표 이미지: 기존 URL과 새로 선택한 파일들
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const nextId = useRef(3);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: 1, type: 'text', text: '' },
    { id: 2, type: 'image', file: null },
  ]);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  // 수정 모드일 때 기존 데이터 불러오기
  useEffect(() => {
    if (!editNum) return;
    let ignore = false;
    getOneProduct(editNum)
      .then((data) => {
        if (ignore || !data) return;
        setTitle(data.title || '');
        setCompany(data.company || '');
        setGroup(data.group || []);
        setPrice(String(data.price || ''));
        setDiscount(data.discount ? String(data.discount) : '');
        if (data.list && data.list.length > 0) {
          setList(data.list.map((o) => ({ name: o.name, count: String(o.count) })));
        }
        if (data.reserve) {
          setReserve(true);
          setResShip(new Date(data.reserve));
          if (data.reserveStart) setResStart(new Date(data.reserveStart));
          if (data.reserveEnd) setResEnd(new Date(data.reserveEnd));
        }
        if (data.image && data.image.length > 0) {
          setExistingImages(data.image);
        }
        if (data.detail && data.detail.length > 0) {
          setBlocks(
            data.detail.map((b, i) =>
              b.type === 'text'
                ? { id: i + 1, type: 'text', text: b.text }
                : { id: i + 1, type: 'image', file: null, url: b.url },
            ),
          );
          nextId.current = data.detail.length + 1;
        }
      })
      .finally(() => {
        if (!ignore) setLoadingInitial(false);
      });

    return () => {
      ignore = true;
    };
  }, [editNum]);

  const newImageUrls = useMemo(() => images.map((f) => URL.createObjectURL(f)), [images]);
  useEffect(() => () => newImageUrls.forEach((u) => URL.revokeObjectURL(u)), [newImageUrls]);

  const allImageUrls = useMemo(() => [...existingImages, ...newImageUrls], [existingImages, newImageUrls]);

  const priceNum = Number(price) || 0;
  const disc = Math.min(Math.max(Number(discount) || 0, 0), 99);

  // 오류는 항상 계산하고, 화면에는 제출을 한 번 누른 뒤부터 보여줌
  const names = list.map((o) => o.name.trim());
  const optionErrors = list.map((o, i) => {
    const nameBad = !names[i];
    const n = Number(o.count);
    const countBad = isEdit
      ? !(Number.isInteger(n) && n >= 0 && o.count !== '')
      : !(Number.isInteger(n) && n > 0);
    if (nameBad && countBad) return '옵션 이름과 수량을 입력해 주세요.';
    if (nameBad) return '옵션 이름을 입력해 주세요.';
    if (countBad) return isEdit ? '수량을 0개 이상 입력해 주세요.' : '수량을 1개 이상 입력해 주세요.';
    if (names.indexOf(names[i]) !== i) return '같은 이름의 옵션이 있어요.';
    return '';
  });
  const resOrderBad = reserve && !!resStart && !!resEnd && resEnd < resStart;
  const blockErrors = blocks.map((b) =>
    b.type === 'text'
      ? b.text.trim() ? '' : '글을 입력하거나 블록을 지워 주세요.'
      : b.file || b.url ? '' : '이미지를 선택하거나 블록을 지워 주세요.',
  );
  const errors = {
    name: !title.trim(),
    group: group.length === 0,
    price: !(Number.isInteger(priceNum) && priceNum > 0),
    option: optionErrors.some(Boolean),
    resStart: reserve && !resStart,
    resEnd: reserve && (!resEnd || resOrderBad),
    resShip: reserve && !resShip,
    image: allImageUrls.length === 0,
    block: blockErrors.some(Boolean),
  };
  const invalid = Object.values(errors).some(Boolean);
  const show = (bad: boolean) => submitted && bad;
  const nameError = show(errors.name);
  const groupError = show(errors.group);
  const priceError = show(errors.price);
  const resStartError = show(errors.resStart);
  const resEndError = resOrderBad || show(errors.resEnd);
  const resShipError = show(errors.resShip);
  const imageError = show(errors.image);

  const resDays = resStart && resEnd && !resOrderBad ? Math.round((+resEnd - +resStart) / 86400000) + 1 : 0;

  const setOption = (i: number, key: 'name' | 'count', v: string) =>
    setList(list.map((o, j) => (j === i ? { ...o, [key]: v } : o)));

  const moveBlock = (i: number, d: number) => {
    const next = [...blocks];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    setBlocks(next);
  };

  const addBlock = (type: Block['type']) =>
    setBlocks([...blocks, type === 'text' ? { id: nextId.current++, type, text: '' } : { id: nextId.current++, type, file: null }]);

  const removeImageAt = (index: number) => {
    if (index < existingImages.length) {
      setExistingImages(existingImages.filter((_, i) => i !== index));
    } else {
      const newIdx = index - existingImages.length;
      setImages(images.filter((_, i) => i !== newIdx));
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSendError('');
    if (invalid) return;

    const files = [...images, ...blocks.flatMap((b) => (b.type === 'image' && b.file ? [b.file] : []))];
    if (files.reduce((a, f) => a + f.size, 0) > MAX_UPLOAD_BYTES) {
      setSendError('이미지 용량이 합쳐서 4MB를 넘어요. 줄여서 다시 올려 주세요.');
      return;
    }

    const fd = new FormData();
    if (isEdit && editNum) {
      fd.append('num', String(editNum));
      fd.append('keepImages', JSON.stringify(existingImages));
    }
    fd.append('title', title);
    fd.append('company', company);
    fd.append('group', JSON.stringify(group));
    fd.append('price', String(priceNum));
    fd.append('discount', String(disc));
    fd.append('list', JSON.stringify(list.map((o) => ({ name: o.name.trim(), count: Number(o.count) }))));
    if (reserve && resStart && resEnd && resShip) {
      fd.append('reserveStart', resStart.toISOString());
      fd.append('reserveEnd', resEnd.toISOString());
      fd.append('reserveShip', resShip.toISOString());
    }
    images.forEach((f) => fd.append('image', f));

    // 상세 블록: 새 파일이 있으면 { type: 'image' }로 슬롯 비우고 detailImage append,
    // 기존 이미지가 그대로면 { type: 'image', url: b.url } 전송
    const detailPayload = blocks.map((b) => {
      if (b.type === 'text') return { type: 'text', text: b.text };
      if (b.file) return { type: 'image' };
      return { type: 'image', url: b.url };
    });
    fd.append('detail', JSON.stringify(detailPayload));
    blocks.forEach((b) => b.type === 'image' && b.file && fd.append('detailImage', b.file));

    setSending(true);
    const res = await fetch('/api/postProduct', { method: 'POST', body: fd }).catch(() => null);
    setSending(false);
    if (!res?.ok) {
      setSendError(isEdit ? '수정하지 못했어요. 입력값을 확인하고 다시 시도해 주세요.' : '등록하지 못했어요. 입력값을 확인하고 다시 시도해 주세요.');
      return;
    }
    router.push('/manager/product_manage');
  };

  const groupOptions = menu
    ? [
        ...menu.character.map((v) => ({ value: v, label: v, group: '캐릭터' })),
        ...menu.ani.map((v) => ({ value: v, label: v, group: '애니메이션' })),
        ...menu.series.flatMap((m) => m.items.map((v) => ({ value: v, label: v, group: `시리즈 · ${m.name}` }))),
        ...menu.groups.flatMap((m) => m.items.map((v) => ({ value: v, label: v, group: m.name }))),
      ]
    : [];

  const previewProps = {
    title: title.trim() || '[상품명]',
    price: priceNum,
    discount: disc,
    isDiscount: disc > 0,
    image: allImageUrls,
    create: reserve ? '' : 'new',
    reserve: reserve && resShip ? resShip.toISOString() : '',
    like: false,
    num: editNum || 0,
  } as CardProps;

  if (loadingInitial) {
    return (
      <div className={s.container}>
        <section className={s.titleSection}>
          <span className={s.eyebrow}>EDIT PRODUCT</span>
          <h1 className={s.title}>상품 정보 불러오는 중…</h1>
        </section>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <section className={s.titleSection}>
        <span className={s.eyebrow}>{isEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}</span>
        <h1 className={s.title}>{isEdit ? `상품 수정 · #${editNum}` : '상품 추가'}</h1>
        <p className={s.subText}>
          {isEdit
            ? '상품의 모든 정보(제목, 이미지, 카테고리, 옵션 등)를 수정합니다. * 표시는 필수 항목이에요.'
            : '새 캡슐토이 상품을 등록합니다. * 표시는 필수 항목이에요.'}
        </p>
      </section>

      <div className={s.columns}>
        <form aria-label={isEdit ? '상품 수정' : '상품 등록'} className={s.form} onSubmit={submit} noValidate>
          {/* 01 기본 정보 */}
          <section className={s.panel}>
            <div className={s.panelHead}>
              <div className={s.panelTitleRow}>
                <span className={s.panelNo}>01</span>
                <h2 className={s.panelTitle}>기본 정보</h2>
              </div>
            </div>
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
          </section>

          {/* 02 가격 */}
          <section className={s.panel}>
            <div className={s.panelHead}>
              <div className={s.panelTitleRow}>
                <span className={s.panelNo}>02</span>
                <h2 className={s.panelTitle}>가격</h2>
              </div>
            </div>
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
          </section>

          {/* 03 상품 옵션 */}
          <section className={s.panel}>
            <div className={s.panelHead}>
              <div className={s.panelTitleRow}>
                <span className={s.panelNo}>03</span>
                <h2 className={s.panelTitle}>
                  상품 옵션 <span className={s.required}>*</span>
                </h2>
              </div>
              <span className={s.count} aria-live='polite'>
                {list.length}종
              </span>
            </div>
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
                  {submitted && optionErrors[i] && <span className={`${s.errorText} ${s.optionError}`}>{optionErrors[i]}</span>}
                </div>
              ))}
              <button type='button' className={`${s.slotBtn} ${s.slotBtnText}`} onClick={() => setList([...list, { name: '', count: '' }])}>
                <Plus aria-hidden />
                옵션 추가
              </button>
            </div>
          </section>

          {/* 04 예약 판매 */}
          <section className={s.panel}>
            <div className={s.panelHead}>
              <div className={s.panelTitleRow}>
                <span className={s.panelNo}>04</span>
                <h2 className={s.panelTitle}>예약 판매</h2>
              </div>
              <div className={reserve ? `${s.toggleRow} ${s.toggleOn}` : s.toggleRow}>
                <span aria-hidden>{reserve ? 'ON' : 'OFF'}</span>
                <ToggleBtn value={reserve} setValue={setReserve} label='예약 판매' />
              </div>
            </div>
            {reserve ? (
              <div className={s.panelBody}>
                <div className={s.grid}>
                  <div className={s.field}>
                    <label htmlFor='pa-res-start' className={s.label}>
                      사전예약 시작일 <span className={s.required}>*</span>
                    </label>
                    <DatePicker
                      id='pa-res-start'
                      selected={resStart}
                      onChange={setResStart}
                      dateFormat='yyyy-MM-dd'
                      placeholderText='YYYY-MM-DD'
                      className={resStartError ? `${s.input} ${s.inputError}` : s.input}
                    />
                    {resStartError && <span className={s.errorText}>시작일을 선택해 주세요.</span>}
                  </div>
                  <div className={s.field}>
                    <label htmlFor='pa-res-end' className={s.label}>
                      사전예약 종료일 <span className={s.required}>*</span>
                    </label>
                    <DatePicker
                      id='pa-res-end'
                      selected={resEnd}
                      onChange={setResEnd}
                      minDate={resStart ?? undefined}
                      dateFormat='yyyy-MM-dd'
                      placeholderText='YYYY-MM-DD'
                      className={resEndError ? `${s.input} ${s.inputError}` : s.input}
                    />
                    {resEndError && (
                      <span className={s.errorText}>{resOrderBad ? '종료일은 시작일 이후여야 해요.' : '종료일을 선택해 주세요.'}</span>
                    )}
                  </div>
                  <div className={s.field}>
                    <label htmlFor='pa-res-ship' className={s.label}>
                      발송 예정일 <span className={s.required}>*</span>
                    </label>
                    <DatePicker
                      id='pa-res-ship'
                      selected={resShip}
                      onChange={setResShip}
                      dateFormat='yyyy-MM-dd'
                      placeholderText='YYYY-MM-DD'
                      className={resShipError ? `${s.input} ${s.inputError}` : s.input}
                    />
                    {resShipError && <span className={s.errorText}>발송 예정일을 선택해 주세요.</span>}
                  </div>
                </div>
                {resDays > 0 && (
                  <div className={s.summary} aria-live='polite'>
                    <Calendar aria-hidden />
                    <span>
                      {ymd(resStart!)} ~ {ymd(resEnd!)} · {resDays}일 동안 사전예약을 받아요
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className={`${s.hint} ${s.panelBody}`}>
                켜면 사전예약 기간과 발송 예정일을 정할 수 있어요. 발송 예정일은 상품 카드에 &lsquo;예약&rsquo; 태그로 보여요.
              </p>
            )}
          </section>

          {/* 05 상품 이미지 */}
          <section className={s.panel}>
            <div className={s.panelHead}>
              <div className={s.panelTitleRow}>
                <span className={s.panelNo}>05</span>
                <h2 className={s.panelTitle}>
                  상품 이미지 <span className={s.required}>*</span>
                </h2>
              </div>
              <span className={s.pixelCount}>
                {allImageUrls.length} / {MAX_IMAGES}
              </span>
            </div>
            <div className={s.panelBody}>
              <label className={imageError ? `${s.dropzone} ${s.dropzoneError}` : s.dropzone}>
                <span className={s.dropIcon}>
                  <Upload aria-hidden />
                </span>
                <span className={s.dropTitle}>
                  이미지를 끌어다 놓거나 <span className={s.link}>파일 선택</span>
                </span>
                <span className={s.hint}>정사각형 이미지 권장 · 첫 번째 이미지가 대표 이미지가 돼요 (최대 {MAX_IMAGES}장)</span>
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
          </section>

          {/* 06 상세 설명 */}
          <section className={s.panel}>
            <div className={s.panelHead}>
              <div className={s.panelTitleRow}>
                <span className={s.panelNo}>06</span>
                <h2 className={s.panelTitle}>상세 설명</h2>
              </div>
            </div>
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
                        <ImgBtn img='up' size={24} title='위로 이동' className={s.iconBtn} disabled={i === 0} onClick={() => moveBlock(i, -1)} />
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
                            <Image src={b.url} alt={`상세 이미지 ${i + 1}`} width={400} height={300} className={s.blockPreviewImg} />
                          </div>
                        )}
                        <label className={s.blockDrop}>
                          <span className={`${s.dropIcon} ${s.blockDropIcon}`}>
                            <ImageIcon aria-hidden />
                          </span>
                          <span className={s.blockDropTitle}>
                            {b.file ? b.file.name : b.url ? '기존 이미지 유지 중' : '상세 이미지'} <span className={s.link}>{b.file || b.url ? '바꾸기' : '파일 선택'}</span>
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
          </section>

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

export default function ProductAddPage() {
  return (
    <Suspense
      fallback={
        <div className={s.container}>
          <section className={s.titleSection}>
            <span className={s.eyebrow}>PRODUCT</span>
            <h1 className={s.title}>불러오는 중…</h1>
          </section>
        </div>
      }
    >
      <ProductAddForm />
    </Suspense>
  );
}
