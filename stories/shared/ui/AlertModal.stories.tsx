import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { createStore, Provider } from 'jotai';
import AlertModal from '@/shared/ui/AlertModal';
import { useModal } from '@/shared/hooks';

// 앱에서처럼 useModal().openModal(message, options)로 연다.
// AlertModal은 마운트될 때(=페이지 이동) 열린 알림을 닫으므로, 자식 effect가 끝난 뒤 부모 effect에서 연다
function Opener({ message, confirm }: { message: string; confirm?: boolean }) {
  const { openModal } = useModal();
  useEffect(() => {
    openModal(message, confirm ? { onClickCheck: () => {}, onClickCancel: () => {} } : undefined);
  }, []);
  return <AlertModal />;
}

const meta = {
  title: 'shared/AlertModal',
  component: AlertModal,
  parameters: { layout: 'fullscreen' },
  // 스토리마다 새 store라 다른 스토리의 알림 상태가 섞이지 않는다
  decorators: [
    (Story) => (
      <Provider store={createStore()}>
        <Story />
      </Provider>
    ),
  ],
} satisfies Meta<typeof AlertModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// OK 버튼 하나
export const Alert: Story = { render: () => <Opener message='장바구니에 담았어요.' /> };

// onClickCancel이 있으면 YES / NO
export const Confirm: Story = { render: () => <Opener message='주문을 취소할까요?' confirm /> };
