import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import Pagination from '@/shared/ui/Pagination/Pagination';

const meta = {
  title: 'shared/Pagination',
  component: Pagination,
  args: { current: 1, total: 100, pageSize: 20, onChange: fn() },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const First: Story = {};
export const Middle: Story = { args: { current: 3 } };
// 페이지가 많으면 ··· 로 접힘
export const Many: Story = { args: { current: 12, total: 1000 } };
// 한 페이지면 그리지 않음
export const SinglePage: Story = { args: { total: 10 } };
