import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Chip from '@/shared/ui/Chip/Chip';

const meta = {
  title: 'shared/Chip',
  component: Chip,
  args: {
    label: '우마무스메',
    onRemove: () => {},
    removeTitle: '우마무스메 카테고리 빼기',
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Removable: Story = {};

export const WithGrip: Story = {
  args: {
    label: '산리오',
    draggable: true,
    grip: {
      ariaLabel: '순서 옮기기',
      title: '끌거나 ←/→ 키로 순서 바꾸기',
    },
  },
};

export const Dragging: Story = {
  args: {
    label: '반다이',
    dragging: true,
    grip: {
      ariaLabel: '순서 옮기기',
    },
  },
};
