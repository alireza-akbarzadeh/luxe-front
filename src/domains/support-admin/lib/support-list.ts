import type { DtoSupportTicketResponse } from '@/services/-admin-support-tickets-{id}-get.schemas';
import type { UtilsResponse } from '@/services/-admin-support-tickets-get.schemas';

export type GetAdminSupportTickets200 = UtilsResponse & {
  data?: {
    tickets?: DtoSupportTicketResponse[];
    total?: number;
    limit?: number;
    offset?: number;
  };
};

export type { DtoSupportTicketResponse };

export function getTicketsFromListResponse(
  data: GetAdminSupportTickets200 | undefined
): DtoSupportTicketResponse[] {
  return data?.data?.tickets ?? [];
}

export function getTicketsTotalFromListResponse(
  data: GetAdminSupportTickets200 | undefined
): number | undefined {
  return data?.data?.total;
}
