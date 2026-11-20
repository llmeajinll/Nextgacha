import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ModalPortal from '@/shared/ui/ModalPortal';
import EmptyCard from '@/shared/ui/EmptyCard';

// children을 #modal-root(루트 layout의 서버 HTML에 이미 있음)로 옮겨 그린다.
// 스토리에는 그 자리가 없으므로, 렌더 전에 decorator가 body에 직접 만들어 둔다 (JSX로 같이 그리면 첫 렌더 때 아직 DOM에 없음)
const meta = {
  title: 'shared/ModalPortal',
  component: ModalPortal,
  args: { children: <EmptyCard noSpacing>#modal-root 안에 그려진 내용</EmptyCard> },
  decorators: [
    (Story) => {
      if (!document.getElementById('modal-root')) {
        const root = document.createElement('div');
        root.id = 'modal-root';
        document.body.appendChild(root);
      }
      return <Story />;
    },
  ],
} satisfies Meta<typeof ModalPortal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
