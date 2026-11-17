import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Writer from '@/shared/ui/Writer/Writer';

// 이메일 아이디 앞 3글자만 보이고 나머지는 *
const meta = {
  title: 'shared/Writer',
  component: Writer,
  args: { writer: 'gachafan@example.com', created_at: '2026-11-16T09:30:00+09:00' },
} satisfies Meta<typeof Writer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const ShortId: Story = { args: { writer: 'abc@example.com' } };
export const Anonymity: Story = { args: { writer: 'anonymity' } };
