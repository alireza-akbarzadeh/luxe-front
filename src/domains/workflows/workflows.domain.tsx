'use client';

import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Table, useTableState } from '@/components/table/data-table';
import { CreateWorkflowDialog } from '@/domains/workflows/components/create-workflow-dialog';
import { workflowColumns } from '@/domains/workflows/sections/workflow-columns';
import { useCreateWorkflowDialogStore } from '@/domains/workflows/stores/workflow-editor-store';
import { useGetAdminWorkflows } from '@/services/-admin-workflows-get';
import type { GetAdminWorkflows200, ModelsWorkflow } from '@/services/-admin-workflows-get.schemas';

export function WorkflowsDomain() {
  const router = useRouter();
  const setCreateOpen = useCreateWorkflowDialogStore((s) => s.setOpen);
  const tableState = useTableState({ initialPageSize: 20 });

  const { data, isLoading, isFetching, refetch } = useGetAdminWorkflows();
  const workflows = useMemo(
    () => (data as GetAdminWorkflows200 | undefined)?.data ?? [],
    [data]
  );

  return (
    <>
      <Table.Root data={workflows} columns={workflowColumns} tableState={tableState}>
        <Table.Toolbar
          searchPlaceholder='Search by name or key…'
          showRefresh
          onRefresh={refetch}
          isLoading={isFetching}
          showCreate
          onCreate={() => setCreateOpen(true)}
          showClear
          showColumnVisibility
        />
        <Table.Grid<ModelsWorkflow>
          isLoading={isLoading}
          onRowDoubleClick={(row) => {
            if (row.original.key) router.push(`/dashboard/workflows/${row.original.key}`);
          }}
        />
        <Table.Pagination showPageSize showTotalRows pageSizeOptions={[10, 20, 50]} />
      </Table.Root>

      <CreateWorkflowDialog
        onCreated={(key) => router.push(`/dashboard/workflows/${key}`)}
      />
    </>
  );
}
