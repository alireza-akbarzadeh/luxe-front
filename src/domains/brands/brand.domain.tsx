'use client';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { BrandMobileCard } from '@/domains/brands/components/brand-mobile-card';
import {
  getBrandsFromListResponse,
  getBrandsTotalFromListResponse
} from '@/domains/brands/lib/brand-list';
import { brandColumns } from '@/domains/brands/sections/brand-columns';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { deleteBrandsId } from '@/services/-brands-{id}-delete';
import { getGetBrandsQueryKey, useGetBrands } from '@/services/-brands-get';
import type { DtoBrandListResponse, DtoBrandResponse } from '@/services/-brands-get.schemas';

export function BrandsDomains() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const { isDesktop } = useMediaDevices();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      page: state.pagination.pageIndex + 1,
      search: filter || undefined
    }),
    []
  );

  const getRows = useCallback(
    (data: DtoBrandListResponse | undefined) => getBrandsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: DtoBrandListResponse | undefined) => getBrandsTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: brandColumns,
    initialPageSize: 15,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetBrands
  });

  const handleDeleteBrand = useCallback(
    async (brand: DtoBrandResponse) => {
      if (!brand.id) return;

      const confirmed = window.confirm(`Delete brand "${brand.name ?? 'this brand'}"?`);
      if (!confirmed) return;

      try {
        await deleteBrandsId(brand.id);
        void queryClient.invalidateQueries({ queryKey: getGetBrandsQueryKey() });
        toast.success('Brand deleted');
      } catch (error) {
        toast.error('Failed to delete brand', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [queryClient]
  );

  const handleBulkDelete = useCallback(async () => {
    const ids = Object.entries(serverTable.tableState.rowSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      toast.error('Select at least one brand');
      return;
    }

    const confirmed = window.confirm(`Delete ${ids.length} selected brand(s)?`);
    if (!confirmed) return;

    try {
      await Promise.all(ids.map((id) => deleteBrandsId(id)));
      void queryClient.invalidateQueries({ queryKey: getGetBrandsQueryKey() });
      serverTable.tableState.resetRowSelection();
      toast.success('Selected brands deleted');
    } catch (error) {
      toast.error('Failed to delete selected brands', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  }, [queryClient, serverTable.tableState]);

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search by name or slug'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => push('/dashboard/brands/create')}
        showClear
        showColumnVisibility={isDesktop}
        showBulkActions={isDesktop}
        onDelete={isDesktop ? handleBulkDelete : undefined}
      />

      {!isDesktop ? (
        <Flex
          direction='row'
          align='center'
          justify='between'
          className='border-border/40 bg-background/50 border-b px-4 py-3'
        >
          <Text variant='muted' className='text-[10px] font-bold tracking-widest uppercase'>
            {serverTable.total.toLocaleString()} brands
          </Text>
          <Text variant='muted' className='text-[10px]'>
            Tap to edit
          </Text>
        </Flex>
      ) : null}

      {isDesktop ? (
        <Table.Grid<DtoBrandResponse>
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
          onRowDoubleClick={(row) => {
            const id = row.original.id;
            if (id) push(`/dashboard/brands/edit/${id}`);
          }}
          extendMenuActions={(row) => (
            <>
              <DropdownMenuItem
                className='gap-2 text-[11px] font-semibold'
                onClick={() => push(`/dashboard/brands/edit/${row.original.id}`)}
              >
                <IconPencil className='size-3.5' />
                Edit brand
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-destructive gap-2 text-[11px] font-semibold'
                onClick={() => void handleDeleteBrand(row.original)}
              >
                <IconTrash className='size-3.5' />
                Delete brand
              </DropdownMenuItem>
            </>
          )}
        />
      ) : (
        <Table.MobileList<DtoBrandResponse>
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
          renderCard={(row) => <BrandMobileCard row={row} />}
          onCardClick={(row) => {
            const id = row.original.id;
            if (id) push(`/dashboard/brands/edit/${id}`);
          }}
        />
      )}

      <Table.Pagination
        showPageSize
        showTotalRows={isDesktop}
        showJumpToPage={isDesktop}
        pageSizeOptions={[10, 15, 20, 50, 100]}
      />
    </Table.Root>
  );
}
