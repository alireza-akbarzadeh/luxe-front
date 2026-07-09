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
  getTemplatesFromList,
  getTemplatesTotal
} from '@/domains/newsletters-admin/lib/email-marketing-list';
import { templateColumns } from '@/domains/newsletters-admin/sections/template-columns';
import { deleteAdminEmailTemplatesId } from '@/services/-admin-email-templates-{id}-delete';
import {
  getGetAdminEmailTemplatesQueryKey,
  useGetAdminEmailTemplates
} from '@/services/-admin-email-templates-get';
import type {
  DtoEmailTemplateListResponse,
  ModelsEmailTemplate
} from '@/services/-admin-email-templates-get.schemas';

export function TemplatesAdminDomain() {
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
    columns: templateColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows: (data: DtoEmailTemplateListResponse | undefined) => getTemplatesFromList(data),
    getTotal: (data: DtoEmailTemplateListResponse | undefined) => getTemplatesTotal(data),
    useQuery: useGetAdminEmailTemplates
  });

  const handleDelete = useCallback(
    async (template: ModelsEmailTemplate) => {
      if (!template.id) return;
      if (!window.confirm(`Delete template "${template.name}"?`)) return;
      try {
        await deleteAdminEmailTemplatesId(template.id);
        void queryClient.invalidateQueries({ queryKey: getGetAdminEmailTemplatesQueryKey() });
        toast.success('Template deleted');
      } catch {
        toast.error('Failed to delete template');
      }
    },
    [queryClient]
  );

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search templates…'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => router.push('/dashboard/marketing/templates/create')}
        showClear
        showColumnVisibility
      />
      <Table.Grid<ModelsEmailTemplate>
        onRowDoubleClick={(row) =>
          row.original.id && router.push(`/dashboard/marketing/templates/edit/${row.original.id}`)
        }
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        extendMenuActions={(row) => (
          <>
            <DropdownMenuItem
              onClick={() =>
                row.original.id &&
                router.push(`/dashboard/marketing/templates/edit/${row.original.id}`)
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
