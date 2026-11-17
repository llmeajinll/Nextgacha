import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EmptyState from '@/shared/ui/EmptyState/EmptyState';

const meta = {
  title: 'shared/EmptyState',
  component: EmptyState,
  args: { children: '아직 알림이 없어요.' },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
