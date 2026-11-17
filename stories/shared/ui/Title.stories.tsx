import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Title from '@/shared/ui/Title/Title';

const meta = {
  title: 'shared/Title',
  component: Title,
  args: { text: 'NEW ARRIVALS' },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
