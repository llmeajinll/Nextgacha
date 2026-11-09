import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Btn from '@/shared/ui/Btn/Btn';

const meta = {
  title: 'shared/Btn',
  component: Btn,
  args: { children: 'BUY' },
} satisfies Meta<typeof Btn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const More: Story = { args: { type: 'more', href: 'search' } };
