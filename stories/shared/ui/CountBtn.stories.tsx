import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CountBtn from '@/shared/ui/Btn/CountBtn';

const meta = {
  title: 'shared/CountBtn',
  component: CountBtn,
  args: { type: 'plus' },
} satisfies Meta<typeof CountBtn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plus: Story = {};
export const Minus: Story = { args: { type: 'minus' } };
export const Disabled: Story = { args: { type: 'minus', disabled: true } };
