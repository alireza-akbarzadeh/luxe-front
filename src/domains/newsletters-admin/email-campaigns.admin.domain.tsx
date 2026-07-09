'use client';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import {
  getEmailCampaignsFromList,
  getEmailCampaignsTotal
} from '@/domains/newsletters-admin/lib/email-marketing-list';
import { emailCampaignColumns } from '@/domains/newsletters-admin/sections/email-campaign-columns';
import { deleteAdminEmailCampaignsId } from '@/services/-admin-email-campaigns-{id}-delete';
import {
  getGetAdminEmailCampaignsQueryKey,
  useGetAdminEmailCampaigns
} from '@/services/-admin-email-campaigns-get';
import type {
  DtoEmailCampaignListResponse,
  ModelsEmailCampaign
} from '@/services/-admin-email-campaigns-get.schemas';

export function EmailCampaignsAdminDomain() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter || undefined,
      status: 'all'
    }),
    []
  );

  const serverTable = useServerTable({
    columns: emailCampaignColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows: (data: DtoEmailCampaignListResponse | undefined) => getEmailCampaignsFromList(data),
    getTotal: (data: DtoEmailCampaignListResponse | undefined) => getEmailCampaignsTotal(data),
    useQuery: useGetAdminEmailCampaigns
  });

  const handleDelete = useCallback(
    async (campaign: ModelsEmailCampaign) => {
      if (!campaign.id) return;
      if (!window.confirm(`Delete campaign "${campaign.name}"?`)) return;
      try {
        await deleteAdminEmailCampaignsId(campaign.id);
        void queryClient.invalidateQueries({ queryKey: getGetAdminEmailCampaignsQueryKey() });
        toast.success('Campaign deleted');
      } catch {
        toast.error('Failed to delete campaign');
      }
    },
    [queryClient]
  );

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search email campaigns…'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => router.push('/dashboard/marketing/campaigns/create')}
        showClear
        showColumnVisibility
      />
      <Table.Grid<ModelsEmailCampaign>
        onRowDoubleClick={(row) =>
          row.original.id && router.push(`/dashboard/marketing/campaigns/edit/${row.original.id}`)
        }
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() =>
                row.original.id &&
                router.push(`/dashboard/marketing/campaigns/edit/${row.original.id}`)
              }
            >
              <IconPencil className='size-3.5' /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive'
              onClick={() => void handleDelete(row.original)}
            >
              <IconTrash className='size-3.5' /> Delete
            </DropdownMenuItem>
          </>
        )}
      />
      <Table.Pagination showPageSize showTotalRows />
    </Table.Root>
  );
}
