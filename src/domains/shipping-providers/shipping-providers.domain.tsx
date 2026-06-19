'use client';

import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { Table, useTableState } from '@/components/table/data-table';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { shippingProviderColumns } from '@/domains/shipping-providers/sections/provider-columns';
import {
  getGetAdminShippingProvidersQueryKey,
  useGetAdminShippingProviders
} from '@/services/-admin-shipping-providers-get';
import { deleteShippingProvidersId } from '@/services/-shipping-providers-{id}-delete';
import { getGetShippingProvidersQueryKey } from '@/services/-shipping-providers-get';
import type { ModelsShippingProviders } from '@/services/-shipping-providers-get.schemas';

export function ShippingProvidersDomains() {
  const { push } = useRouter();
  const queryClient = useQueryClient();
  const tableState = useTableState();

  const { data, isLoading, isFetching, refetch } = useGetAdminShippingProviders();
  const shippingProviders = data?.data ?? [];

  const invalidateLists = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminShippingProvidersQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetShippingProvidersQueryKey() });
  }, [queryClient]);

  const handleDeleteProvider = useCallback(
    async (provider: ModelsShippingProviders) => {
      if (!provider.id) return;

      const confirmed = window.confirm(`Delete shipping provider "${provider.name ?? 'this provider'}"?`);
      if (!confirmed) return;

      try {
        await deleteShippingProvidersId(provider.id);
        invalidateLists();
        toast.success('Shipping provider deleted');
      } catch (error) {
        toast.error('Failed to delete shipping provider', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [invalidateLists]
  );

  const handleBulkDelete = useCallback(async () => {
    const ids = Object.entries(tableState.rowSelection)
      .filter(([, selected]) => selected)
      .map(([id]) => Number(id))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      toast.error('Select at least one provider');
      return;
    }

    const confirmed = window.confirm(`Delete ${ids.length} selected provider(s)?`);
    if (!confirmed) return;

    try {
      await Promise.all(ids.map((id) => deleteShippingProvidersId(id)));
      invalidateLists();
      tableState.resetRowSelection();
      toast.success('Selected providers deleted');
    } catch (error) {
      toast.error('Failed to delete selected providers', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  }, [invalidateLists, tableState]);

  return (
    <Table.Root
      data={shippingProviders}
      columns={shippingProviderColumns}
      tableState={tableState}
    >
      <Table.Toolbar
        searchPlaceholder='Search by name or description'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showCreate
        onCreate={() => push('/dashboard/shipping-providers/create')}
        showClear
        showColumnVisibility
        showBulkActions
        onDelete={handleBulkDelete}
      />
      <Table.Grid<ModelsShippingProviders>
        onRowDoubleClick={(row) => {
          const id = row.original.id;
          if (id) push(`/dashboard/shipping-providers/edit/${id}`);
        }}
        isLoading={isLoading}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuItem
              className='gap-2 text-[11px] font-semibold'
              onClick={() => push(`/dashboard/shipping-providers/edit/${row.original.id}`)}
            >
              <IconPencil className='size-3.5' />
              Edit provider
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='text-destructive gap-2 text-[11px] font-semibold'
              onClick={() => void handleDeleteProvider(row.original)}
            >
              <IconTrash className='size-3.5' />
              Delete provider
            </DropdownMenuItem>
          </>
        )}
      />
      <Table.Pagination
        showPageSize
        showTotalRows
        showJumpToPage
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Table.Root>
  );
}
