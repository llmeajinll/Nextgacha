import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Drawer from '@/shared/ui/Drawer/Drawer';

const meta = {
  title: 'shared/Drawer',
  component: Drawer,
  args: {
    label: '회원 상세',
    title: 'MEMBER DETAIL',
    onClose: () => {},
    children: <div style={{ padding: 20, background: 'white', border: '1px solid #D3DCE4' }}>[상세 내용]</div>,
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
