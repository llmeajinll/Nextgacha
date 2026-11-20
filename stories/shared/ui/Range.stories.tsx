import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Range from '@/shared/ui/Range/Range';
import Btn from '@/shared/ui/Btn/Btn';

const meta = {
  title: 'shared/Range',
  component: Range,
  args: {
    gap: '8',
    children: (
      <>
        <Btn kind='neutral'>ONE</Btn>
        <Btn kind='neutral'>TWO</Btn>
        <Btn kind='primary'>THREE</Btn>
      </>
    ),
  },
} satisfies Meta<typeof Range>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Row: Story = {};
export const Column: Story = { args: { preset: 'column' } };
export const Between: Story = { args: { preset: 'between', width: '340' } };
