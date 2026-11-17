import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Tag from '@/shared/ui/Tag/Tag';
import { vars } from '@/styles/theme.css';

// 상품 카드의 상태 태그. 색은 vars.status 토큰을 넘긴다
const meta = {
  title: 'shared/Tag',
  component: Tag,
  args: { word: 'NEW', color: vars.status.new },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const New: Story = {};
export const Hot: Story = { args: { word: 'HOT', color: vars.status.hot } };
export const Reserve: Story = { args: { word: 'RESERVE', color: vars.status.reserve } };
export const SoldOut: Story = { args: { word: 'SOLD OUT', color: vars.status.soldout } };
