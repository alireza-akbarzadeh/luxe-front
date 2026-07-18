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
import {
  getPrivacyRulesFromListResponse,
  getPrivacyRulesTotalFromListResponse
} from '@/domains/privacy-rules/lib/privacy-rule-list';
import { privacyRuleColumns } from '@/domains/privacy-rules/sections/privacy-rule-columns';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { deleteAdminPrivacyRulesId } from '@/services/-admin-privacy-rules-{id}-delete';
import {
  getGetAdminPrivacyRulesQueryKey,
  useGetAdminPrivacyRules
} from '@/services/-admin-privacy-rules-get';
import type {
  DtoPrivacyRuleListResponse,
  DtoPrivacyRuleResponse
} from '@/services/-admin-privacy-rules-get.schemas';

export function PrivacyRulesDomain() {
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
    (data: DtoPrivacyRuleListResponse | undefined) => getPrivacyRulesFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: DtoPrivacyRuleListResponse | undefined) => getPrivacyRulesTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: privacyRuleColumns,
    initialPageSize: 15,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminPrivacyRules
  });

  const handleDeleteRule = useCallback(
    async (rule: DtoPrivacyRuleResponse) => {
      if (!rule.id) return;

      const confirmed = window.confirm(`Delete privacy rule "${rule.name ?? 'this rule'}"?`);
      if (!confirmed) return;

      try {
        await deleteAdminPrivacyRulesId(rule.id);
        void queryClient.invalidateQueries({ queryKey: getGetAdminPrivacyRulesQueryKey() });
        toast.success('Privacy rule deleted');
      } catch (error) {
        toast.error('Failed to delete privacy rule', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    },
    [queryClient]
  );

  const handleBulkDelete = useCallback(async () => {
    const ids = Object.entries(serverTable.tableState.rowSelection)
      .filter(([, selected]) => selected)
      .map(([rowId]) => Number(rowId))
      .filter((id) => Number.isFinite(id) && id > 0);

    if (ids.length === 0) return;

    const confirmed = window.confirm(`Delete ${ids.length} selected privacy rule(s)?`);
    if (!confirmed) return;

    try {
      await Promise.all(ids.map((id) => deleteAdminPrivacyRulesId(id)));
      void queryClient.invalidateQueries({ queryKey: getGetAdminPrivacyRulesQueryKey() });
      serverTable.tableState.resetRowSelection();
      toast.success('Selected privacy rules deleted');
    } catch (error) {
      toast.error('Failed to delete selected rules', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    }
  }, [queryClient, serverTable.tableState]);

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search by name, key, or summary'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showCreate
        onCreate={() => push('/dashboard/privacy-rules/create')}
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
            {serverTable.total.toLocaleString()} rules
          </Text>
          <Text variant='muted' className='text-[10px]'>
            Tap to edit
          </Text>
        </Flex>
      ) : null}

      {isDesktop ? (
        <Table.Grid<DtoPrivacyRuleResponse>
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
          onRowDoubleClick={(row) => {
            const id = row.original.id;
            if (id) push(`/dashboard/privacy-rules/edit/${id}`);
          }}
          extendMenuActions={(row) => (
            <>
              <DropdownMenuItem
                className='gap-2 text-[11px] font-semibold'
                onClick={() => push(`/dashboard/privacy-rules/edit/${row.original.id}`)}
              >
                <IconPencil className='size-3.5' />
                Edit rule
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className='text-destructive gap-2 text-[11px] font-semibold'
                onClick={() => void handleDeleteRule(row.original)}
              >
                <IconTrash className='size-3.5' />
                Delete rule
              </DropdownMenuItem>
            </>
          )}
        />
      ) : (
        <Table.MobileList<DtoPrivacyRuleResponse>
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
          renderCard={(row) => (
            <Flex direction='column' spacing={1} className='p-4'>
              <Text className='font-medium'>{row.original.name || 'Untitled'}</Text>
              <Text variant='muted' className='text-xs'>
                {row.original.provider || 'platform'} · {row.original.key || '—'} · v
                {row.original.version ?? 1}
              </Text>
            </Flex>
          )}
          onCardClick={(row) => {
            const id = row.original.id;
            if (id) push(`/dashboard/privacy-rules/edit/${id}`);
          }}
        />
      )}

      <Table.Pagination />
    </Table.Root>
  );
}
