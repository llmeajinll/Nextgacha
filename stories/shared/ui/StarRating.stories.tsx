import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import StarRating from '@/shared/ui/StarRating/StarRating';

// 눌러서 별점을 고르는 입력용. disabled면 표시만 한다
const meta = {
  title: 'shared/StarRating',
  component: StarRating,
  args: { value: 3, setValue: () => {} },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return args.disabled ? (
      <StarRating disabled value={args.value} size={args.size} />
    ) : (
      <StarRating value={value} setValue={setValue} size={args.size} />
    );
  },
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Input: Story = {};
export const Big: Story = { args: { size: 'big' } };
export const ReadOnly: Story = { args: { disabled: true, value: 4, setValue: undefined } };
