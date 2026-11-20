import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ToggleBtn from '@/shared/ui/ImgBtn/ToggleBtn';

const meta = {
  title: 'shared/ToggleBtn',
  component: ToggleBtn,
  args: { value: false, setValue: () => {}, label: '예약 판매' },
  // 눌러서 켜고 끌 수 있게 상태를 스토리 안에 둔다
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <ToggleBtn {...args} value={value} setValue={setValue} />;
  },
} satisfies Meta<typeof ToggleBtn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { value: true } };
