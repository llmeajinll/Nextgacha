import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ScrollToTop from '@/shared/ui/ScrollToTop';
import EmptyCard from '@/shared/ui/EmptyCard';

// 화면에 그리는 것은 없다. 마운트·언마운트 때 창을 맨 위로 부드럽게 올린다 (목록 페이지 이동용)
const meta = {
  title: 'shared/ScrollToTop',
  component: ScrollToTop,
  parameters: { layout: 'padded' },
  render: () => (
    <>
      <ScrollToTop />
      <EmptyCard noSpacing>이 스토리를 열면 창이 맨 위로 올라가요 (보이는 UI 없음)</EmptyCard>
    </>
  ),
} satisfies Meta<typeof ScrollToTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
