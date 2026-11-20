import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import LabelTitle from '@/shared/ui/LabelTitle/LabelTitle';

const meta = {
  title: 'shared/LabelTitle',
  component: LabelTitle,
  args: { label: '배송비', content: '3,000원 (50,000원 이상 무료)' },
} satisfies Meta<typeof LabelTitle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {};
export const Large: Story = { args: { label: '판매가', content: '4,500원', status: 'large' } };
