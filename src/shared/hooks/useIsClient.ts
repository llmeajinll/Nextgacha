import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// 서버 렌더와 hydration 첫 렌더에서는 false, 그 뒤로 true.
// useEffect 안에서 setState로 마운트 여부를 기록하던 것을 대신한다 (렌더 한 번 덜 함)
export default function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
