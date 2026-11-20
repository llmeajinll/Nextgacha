import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import getCategoryMenu from '@/entities/product/api/getCategoryMenu';
import getOneProduct from '@/entities/product/api/getOneProduct';
import { categoryOptions } from '@/entities/product/lib/categoryOptions';
import type { CardProps } from '@/entities/product/model/types';
import { MAX_UPLOAD_BYTES, type Block } from '../lib/productForm';

// 관리자 상품 등록·수정 폼 상태. ?edit=번호(또는 ?num=)면 수정 모드
export default function useProductForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
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
    const countBad = isEdit ? !(Number.isInteger(n) && n >= 0 && o.count !== '') : !(Number.isInteger(n) && n > 0);
    if (nameBad && countBad) return '옵션 이름과 수량을 입력해 주세요.';
    if (nameBad) return '옵션 이름을 입력해 주세요.';
    if (countBad) return isEdit ? '수량을 0개 이상 입력해 주세요.' : '수량을 1개 이상 입력해 주세요.';
    if (names.indexOf(names[i]) !== i) return '같은 이름의 옵션이 있어요.';
    return '';
  });
  const resOrderBad = reserve && !!resStart && !!resEnd && resEnd < resStart;
  const blockErrors = blocks.map((b) =>
    b.type === 'text'
      ? b.text.trim()
        ? ''
        : '글을 입력하거나 블록을 지워 주세요.'
      : b.file || b.url
        ? ''
        : '이미지를 선택하거나 블록을 지워 주세요.',
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
    setBlocks([
      ...blocks,
      type === 'text' ? { id: nextId.current++, type, text: '' } : { id: nextId.current++, type, file: null },
    ]);

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
      setSendError(
        isEdit
          ? '수정하지 못했어요. 입력값을 확인하고 다시 시도해 주세요.'
          : '등록하지 못했어요. 입력값을 확인하고 다시 시도해 주세요.',
      );
      return;
    }
    // 목록 캐시(staleTime 1분)를 버려야 돌아갔을 때 새로 받아 옴
    queryClient.invalidateQueries({ queryKey: ['manageProducts'] });
    router.push('/manager/product_manage');
  };

  const groupOptions = categoryOptions(menu);

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

  return {
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
    list,
    setList,
    reserve,
    setReserve,
    resStart,
    setResStart,
    resEnd,
    setResEnd,
    resShip,
    setResShip,
    existingImages,
    setExistingImages,
    images,
    setImages,
    blocks,
    setBlocks,
    submitted,
    sending,
    sendError,
    allImageUrls,
    priceNum,
    disc,
    optionErrors,
    resOrderBad,
    blockErrors,
    invalid,
    nameError,
    groupError,
    priceError,
    resStartError,
    resEndError,
    resShipError,
    imageError,
    resDays,
    setOption,
    moveBlock,
    addBlock,
    removeImageAt,
    submit,
    groupOptions,
    previewProps,
  };
}

export type ProductFormState = ReturnType<typeof useProductForm>;
