'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import {
  bulkReceiveDefaultValues,
  bulkReceiveSchema,
  INVENTORY_ADJUST_REASONS,
  parseBulkReceiveLines
} from '@/domains/inventory-admin/inventory.schema';
import { useInventoryStore } from '@/domains/inventory-admin/stores/inventory-store';
import {
  getGetAdminInventoryAdjustmentsRecentQueryKey,
  getGetAdminInventoryOverviewQueryKey,
  getGetAdminInventoryQueryKey,
  usePostAdminInventoryBulkAdjust
} from '@/services/-admin-inventory';
import type { DtoBulkInventoryAdjustRowResult } from '@/services/-admin-inventory.schemas';

export function InventoryBulkReceiveDialog() {
  const queryClient = useQueryClient();
  const bulkReceiveOpen = useInventoryStore((state) => state.bulkReceiveOpen);
  const closeBulkReceive = useInventoryStore((state) => state.closeBulkReceive);

  const { mutateAsync: bulkAdjust, isPending } = usePostAdminInventoryBulkAdjust();

  const form = useAppForm({
    defaultValues: bulkReceiveDefaultValues,
    validators: {
      onChange: bulkReceiveSchema,
      onSubmit: bulkReceiveSchema
    },
    onSubmit: async ({ value }) => {
      const parsed = parseBulkReceiveLines(value.lines);
      const validRows = parsed.filter((row) => !row.error);

      if (validRows.length === 0) {
        toast.error('No valid rows to import', {
          description: 'Fix parsing errors or add SKU and quantity lines.'
        });
        return;
      }

      try {
        const response = await bulkAdjust({
          data: {
            reason: value.reason,
            rows: validRows.map((row) => ({ sku: row.sku, delta: row.delta }))
          }
        });

        const result = response.data;
        const applied = result?.applied ?? 0;
        const failed = result?.failed ?? 0;

        void queryClient.invalidateQueries({ queryKey: getGetAdminInventoryQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetAdminInventoryOverviewQueryKey() });
        void queryClient.invalidateQueries({
          queryKey: getGetAdminInventoryAdjustmentsRecentQueryKey()
        });

        if (failed > 0) {
          toast.warning(`Applied ${applied} rows, ${failed} failed`, {
            description: result?.rows
              ?.filter((row: DtoBulkInventoryAdjustRowResult) => !row.success)
              .slice(0, 3)
              .map((row: DtoBulkInventoryAdjustRowResult) => `${row.sku}: ${row.message ?? 'failed'}`)
              .join(' · ')
          });
        } else {
          toast.success(`Stock updated for ${applied} SKU${applied === 1 ? '' : 's'}`);
        }

        if (failed === 0) {
          closeBulkReceive();
          form.reset(bulkReceiveDefaultValues);
        }
      } catch (error) {
        toast.error('Bulk receive failed', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  return (
    <AppDialog
      open={bulkReceiveOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeBulkReceive();
          form.reset(bulkReceiveDefaultValues);
        }
      }}
      title='Bulk receive'
      description='Paste one SKU and quantity per line. Use comma, tab, or space as separator.'
      size='lg'
    >
      <form.AppForm>
        <form.Root
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <Flex direction='column' spacing={4}>
            <form.AppField
              name='reason'
              children={(field) => (
                <field.Select label='Reason' options={[...INVENTORY_ADJUST_REASONS]} required />
              )}
            />

            <form.AppField
              name='lines'
              children={(field) => (
                <field.TextArea
                  label='SKU list'
                  rows={10}
                  required
                  placeholder={`# Example\nSKU-001,24\nSKU-002 6\nSKU-003\t12`}
                  description='Lines starting with # are ignored. Quantity must be a non-zero integer.'
                />
              )}
            />

            <form.Subscribe
              selector={(state) => state.values.lines}
              children={(lines) => <BulkReceivePreview lines={lines} />}
            />

            <Flex direction='row' justify='end' spacing={2}>
              <Button type='button' variant='ghost' onClick={closeBulkReceive}>
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type='submit' disabled={!canSubmit || isPending || isSubmitting}>
                    {isPending || isSubmitting ? (
                      <>
                        <IconLoader2 className='size-4 animate-spin' />
                        Applying…
                      </>
                    ) : (
                      'Apply bulk receive'
                    )}
                  </Button>
                )}
              />
            </Flex>
          </Flex>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}

function BulkReceivePreview({ lines }: { lines: string }) {
  const parsed = useMemo(() => parseBulkReceiveLines(lines), [lines]);

  if (!lines.trim()) return null;

  const valid = parsed.filter((row) => !row.error);
  const invalid = parsed.filter((row) => row.error);

  return (
    <div className='bg-muted/40 rounded-lg border p-3 text-sm'>
      <Flex direction='row' spacing={2} className='mb-2 flex-wrap'>
        <Badge variant='secondary'>{valid.length} valid</Badge>
        {invalid.length > 0 && <Badge variant='destructive'>{invalid.length} errors</Badge>}
      </Flex>

      {invalid.length > 0 && (
        <ul className='text-destructive mb-2 space-y-1 text-xs'>
          {invalid.slice(0, 5).map((row) => (
            <li key={`${row.line}-${row.sku}`}>
              Line {row.line}: {row.error}
            </li>
          ))}
          {invalid.length > 5 && <li>…and {invalid.length - 5} more</li>}
        </ul>
      )}

      {valid.length > 0 && (
        <ul className='text-muted-foreground max-h-32 space-y-1 overflow-y-auto text-xs'>
          {valid.slice(0, 8).map((row) => (
            <li key={`${row.line}-${row.sku}`}>
              {row.sku} → {row.delta > 0 ? '+' : ''}
              {row.delta}
            </li>
          ))}
          {valid.length > 8 && <li>…and {valid.length - 8} more</li>}
        </ul>
      )}
    </div>
  );
}
