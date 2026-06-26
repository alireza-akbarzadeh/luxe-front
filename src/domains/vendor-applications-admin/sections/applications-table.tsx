'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Table } from '@/components/table/data-table';
import { Flex } from '@/components/ui/flex';
import { ApplicationDetailSheet } from '@/domains/vendor-applications-admin/components/application-detail-sheet';
import { createApplicationColumns } from '@/domains/vendor-applications-admin/sections/applications-columns';
import { type AdminStoreSummary, listAdminStores, updateAdminStore } from '@/lib/api/vendor-stores';

export function VendorApplicationsTable() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<AdminStoreSummary | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-vendor-applications', 'pending'],
    queryFn: () => listAdminStores({ status: 'pending', limit: 50, offset: 0 })
  });

  const rows = data?.data?.stores ?? [];

  const columns = useMemo(
    () =>
      createApplicationColumns({
        onReview: (store) => {
          setSelected(store);
          setDetailOpen(true);
        }
      }),
    []
  );

  const handleApprove = async (store: AdminStoreSummary) => {
    try {
      await updateAdminStore(store.id, { status: 'active' });
      toast.success('Store approved');
      setDetailOpen(false);
      void queryClient.invalidateQueries({ queryKey: ['admin-vendor-applications'] });
    } catch (error) {
      toast.error('Failed to approve store', {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  const handleReject = async (store: AdminStoreSummary) => {
    try {
      await updateAdminStore(store.id, { status: 'suspended' });
      toast.success('Application rejected');
      setDetailOpen(false);
      void queryClient.invalidateQueries({ queryKey: ['admin-vendor-applications'] });
    } catch (error) {
      toast.error('Failed to reject store', {
        description: error instanceof Error ? error.message : undefined
      });
    }
  };

  return (
    <Flex direction='column' spacing={4} fullWidth>
      <Table.Root data={rows} columns={columns}>
        <Table.Grid isLoading={isLoading} />
      </Table.Root>

      <ApplicationDetailSheet
        store={selected}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Flex>
  );
}
