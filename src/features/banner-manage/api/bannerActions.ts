// 관리자 배너 저장·삭제·순서. 실패하면 서버 메시지로 throw
async function send(url: string, body: BodyInit, json = true) {
  const res = await fetch(url, {
    method: 'POST',
    ...(json && { headers: { 'Content-Type': 'application/json' } }),
    body,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.message || '반영하지 못했어요.');
}

export const saveBanner = (form: FormData) => send('/api/postBanner', form, false);

export const deleteBanner = (id: string) => send('/api/postBannerDelete', JSON.stringify({ id }));

export const orderBanners = (ids: string[]) => send('/api/postBannerOrder', JSON.stringify({ ids }));
