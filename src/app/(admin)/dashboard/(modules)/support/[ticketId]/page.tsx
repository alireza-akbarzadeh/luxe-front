import { TicketDetailDomain } from '@/domains/support-admin/containers/ticket-detail';

interface SupportDetailPageProps {
  params: Promise<{ ticketId: string }>;
}

export default async function SupportDetailPage(props: SupportDetailPageProps) {
  const { ticketId } = await props.params;
  return <TicketDetailDomain ticketId={ticketId} />;
}
