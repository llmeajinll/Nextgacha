import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EmptyCard from '@/shared/ui/EmptyCard';

const meta = {
  title: 'shared/EmptyCard',
  component: EmptyCard,
  args: { children: 'CART IS EMPTY' },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EmptyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loading: Story = { args: { children: 'LIKE LOADING...' } };
export const NoSpacing: Story = { args: { noSpacing: true } };
