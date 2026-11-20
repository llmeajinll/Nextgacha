import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import PageHeader from '@/shared/ui/PageHeader/PageHeader';
import Btn from '@/shared/ui/Btn/Btn';

const meta = {
  title: 'shared/PageHeader',
  component: PageHeader,
  args: {
    eyebrow: 'REVIEWS',
    title: '리뷰 모아보기',
    description: '모든 상품의 리뷰와 별점을 한곳에서 봐요.',
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    eyebrow: 'PRODUCTS',
    title: '상품 관리',
    action: (
      <Btn kind='primary' scale='l' px>
        ADD PRODUCT
      </Btn>
    ),
  },
};

export const TitleOnly: Story = { args: { eyebrow: 'PRODUCT', title: '불러오는 중…', description: undefined } };
