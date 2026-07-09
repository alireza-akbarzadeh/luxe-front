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
  getCampaignsFromList,
  getCampaignsTotal
} from '@/domains/promotions-admin/lib/promotion-list';
import { campaignColumns } from '@/domains/promotions-admin/sections/campaign-columns';
import { deleteAdminCampaignsId } from '@/services/-admin-campaigns-{id}-delete';
import {
  getGetAdminCampaignsQueryKey,
  useGetAdminCampaigns
} from '@/services/-admin-campaigns-get';
import type {
  DtoCampaignListResponse,
  ModelsCampaign
} from '@/services/-admin-campaigns-get.schemas';

export function CampaignsAdminDomain() {
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
    columns: campaignColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows: (data: DtoCampaignListResponse | undefined) => getCampaignsFromList(data),
    getTotal: (data: DtoCampaignListResponse | undefined) => getCampaignsTotal(data),
    useQuery: useGetAdminCampaigns
  });

  const handleDelete = useCallback(
    async (campaign: ModelsCampaign) => {
      if (!campaign.id) return;
      if (!window.confirm(`Delete campaign "${campaign.name}"?`)) return;
      try {
        await deleteAdminCampaignsId(campaign.id);
        void queryClient.invalidateQueries({ queryKey: getGetAdminCampaignsQueryKey() });
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
        searchPlaceholder='Search campaigns…'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => router.push('/dashboard/promotions/campaigns/create')}
        showClear
        showColumnVisibility
      />
      <Table.Grid<ModelsCampaign>
        onRowDoubleClick={(row) =>
          row.original.id && router.push(`/dashboard/promotions/campaigns/edit/${row.original.id}`)
        }
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() =>
                row.original.id &&
                router.push(`/dashboard/promotions/campaigns/edit/${row.original.id}`)
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
