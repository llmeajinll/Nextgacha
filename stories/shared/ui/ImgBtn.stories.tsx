import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import ImgBtn from '@/shared/ui/ImgBtn/ImgBtn';

const meta = {
  title: 'shared/ImgBtn',
  component: ImgBtn,
  args: { size: 32, onClick: fn() },
  argTypes: {
    img: {
      control: 'select',
      options: ['share', 'dropdown', 'close', 'post', 'report', 'heart', 'star'],
    },
    active: { control: 'boolean' },
  },
} satisfies Meta<typeof ImgBtn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { img: 'share', title: '공유' } };

// 좋아요·별점처럼 켜짐/꺼짐이 있는 버튼
export const HeartOn: Story = { args: { img: 'heart', title: '좋아요', active: true } };
export const HeartOff: Story = { args: { img: 'heart', title: '좋아요', active: false } };
