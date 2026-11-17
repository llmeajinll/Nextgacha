import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DropDown from '@/shared/ui/DropDown/DropDown';

const options = [
  { value: 'low', label: '평균 별점 낮은 순' },
  { value: 'many', label: '리뷰 많은 순' },
  { value: 'recent', label: '최근 리뷰 순' },
];

const meta = {
  title: 'shared/DropDown',
  component: DropDown,
  args: { placeholder: '정렬', options, onSelect: () => {} },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return (
      <DropDown
        {...args}
        value={value}
        label={args.options.find((o) => o.value === value)?.label}
        onSelect={setValue}
      />
    );
  },
} satisfies Meta<typeof DropDown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { value: 'many' } };

// group이 바뀌는 자리에 그룹 이름 줄이 들어간다 (카테고리 고르기)
export const Grouped: Story = {
  args: {
    placeholder: '카테고리 추가',
    options: [
      { value: '포켓몬스터', label: '포켓몬스터', group: '캐릭터' },
      { value: '산리오', label: '산리오', group: '캐릭터' },
      { value: '하이큐', label: '하이큐', group: '애니메이션' },
      { value: '귀멸의 칼날', label: '귀멸의 칼날', group: '애니메이션' },
    ],
  },
};
