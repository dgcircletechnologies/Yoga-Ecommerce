import { TrainerBookingDetailPage } from "@/components/trainer/trainer-booking-detail-page";
type Props = { params: Promise<{ id: string }> };
export default async function TrainerBookingRoute({ params }: Props) { return <TrainerBookingDetailPage id={(await params).id} />; }
