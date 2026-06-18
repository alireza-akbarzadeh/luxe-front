'use client';

import { IconHistory, IconRotateClockwise2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { AuditKpiCards } from '@/domains/audit/components/audit-kpi-cards';
import { AuditLogTable } from '@/domains/audit/sections/audit-table';
import { getGetAdminAuditLogsQueryKey } from '@/services/-admin-audit-logs-get';
import { getGetAdminAuditLogsSummaryQueryKey, useGetAdminAuditLogsSummary } from '@/services/-admin-audit-logs-summary-get';

export function AuditLogsDomain() {
  const queryClient = useQueryClient();
  const { data: summaryResponse, isLoading: isSummaryLoading } = useGetAdminAuditLogsSummary();

  const handleRefresh = () => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminAuditLogsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminAuditLogsSummaryQueryKey() });
  };

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-400 px-6 py-5'>
          <div className='flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <div className='bg-primary/10 flex h-9 w-9 items-center justify-center rounded-xl'>
                <IconHistory className='text-primary h-4.5 w-4.5' />
              </div>
              <div>
                <h1 className='text-xl font-black tracking-tight'>Audit Logs</h1>
                <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                  Activity trail
                </p>
              </div>
            </div>
            <Button
              variant='outline'
              size='sm'
              className='h-9 gap-2 rounded-xl text-[10px] font-bold uppercase'
              onClick={handleRefresh}
            >
              <IconRotateClockwise2 className='h-3.5 w-3.5' /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-400 space-y-8 px-6 py-8'>
        <AuditKpiCards summary={summaryResponse?.data} isLoading={isSummaryLoading} />

        <div>
          <div className='mb-4'>
            <h2 className='text-base font-black tracking-tight'>Event log</h2>
            <p className='text-muted-foreground mt-0.5 text-[11px]'>
              Staff mutations are recorded automatically. Double-click a row for full details.
            </p>
          </div>
          <div className='border-border/40 bg-card/30 rounded-[2.5rem] border shadow-2xl shadow-black/5 backdrop-blur-xl'>
            <AuditLogTable />
          </div>
        </div>
      </div>
    </div>
  );
}
