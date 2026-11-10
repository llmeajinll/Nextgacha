import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CountTab from '@/shared/ui/CountTab/CountTab';

const meta = {
  title: 'shared/CountTab',
  component: CountTab,
  args: { href: '#', label: '접수', count: 12, active: false },
} satisfies Meta<typeof CountTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Active: Story = { args: { active: true } };
export const Zero: Story = { args: { label: '무시', count: 0 } };
