import { OrderComplete } from '@/features/purchase/ui/PaymentResult';

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <OrderComplete orderId={orderId} />;
}
