import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ReactSlick from '@/shared/ui/ReactSlick/ReactSlick';

// shared/ui 래퍼: react-slick을 페이지에서 직접 쓰지 않고 이걸 쓴다 (fsd.md)
const meta = {
  title: 'shared/ReactSlick',
  component: ReactSlick,
  args: { image: ['/images/event/event1.png', '/images/event/event2.png', '/images/event/event3.png'] },
} satisfies Meta<typeof ReactSlick>;

export default meta;
type Story = StoryObj<typeof meta>;

// 상품 상세 이미지 (450 × 450)
export const Small: Story = {};

// 메인 배너 (1312 × 439, 자동 넘김 + 가챠 레버)
export const Banner: Story = {
  args: { preset: 'banner' },
  parameters: { layout: 'fullscreen' },
};
