import { atomWithQuery } from 'jotai-tanstack-query';

export const userInfoAtom = atomWithQuery<{
  email: string;
  nickname: string;
  address: string;
  point: number;
  image: string;
}>(() => ({
  queryKey: ['userInfo'],
  queryFn: async () => {
    const res = await fetch('/api/getUser');

    if (!res.ok) throw new Error('유저 정보를 가져오지 못했습니다.');

    const data = await res.json();
    return data.result;
  },
  staleTime: 1000 * 60 * 10,
}));
