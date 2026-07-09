'use client';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { getBannersFromList, getBannersTotal } from '@/domains/promotions-admin/lib/promotion-list';
import { bannerColumns } from '@/domains/promotions-admin/sections/banner-columns';
import { deleteAdminHomepageSectionsId } from '@/services/-admin-homepage-sections-{id}-delete';
import {
  getGetAdminHomepageSectionsQueryKey,
  useGetAdminHomepageSections
} from '@/services/-admin-homepage-sections-get';
import type {
  DtoHomepageSectionListResponse,
  ModelsHomepageSection
} from '@/services/-admin-homepage-sections-get.schemas';

export function BannersAdminDomain() {
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
    columns: bannerColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows: (data: DtoHomepageSectionListResponse | undefined) => getBannersFromList(data),
    getTotal: (data: DtoHomepageSectionListResponse | undefined) => getBannersTotal(data),
    useQuery: useGetAdminHomepageSections
  });

  const handleDelete = useCallback(
    async (section: ModelsHomepageSection) => {
      if (!section.id) return;
      if (!window.confirm(`Delete banner "${section.title}"?`)) return;
      try {
        await deleteAdminHomepageSectionsId(section.id);
        void queryClient.invalidateQueries({ queryKey: getGetAdminHomepageSectionsQueryKey() });
        toast.success('Banner deleted');
      } catch {
        toast.error('Failed to delete banner');
      }
    },
    [queryClient]
  );

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search banners…'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => router.push('/dashboard/promotions/banners/create')}
        showClear
        showColumnVisibility
      />
      <Table.Grid<ModelsHomepageSection>
        onRowDoubleClick={(row) =>
          row.original.id && router.push(`/dashboard/promotions/banners/edit/${row.original.id}`)
        }
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() =>
                row.original.id &&
                router.push(`/dashboard/promotions/banners/edit/${row.original.id}`)
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
