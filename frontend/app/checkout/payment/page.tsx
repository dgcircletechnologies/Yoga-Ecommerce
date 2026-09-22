import { PaymentResultPage } from '@/components/checkout/payment-result-page';
type Props = { searchParams: Promise<{ orderId?: string; status?: string }> };
export default async function PaymentRedirectPage({ searchParams }: Props) { const params = await searchParams; return <PaymentResultPage orderId={params.orderId} />; }
