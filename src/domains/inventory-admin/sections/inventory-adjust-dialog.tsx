'use client';

import { IconLoader2, IconMinus, IconPlus } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import {
  INVENTORY_ADJUST_REASONS,
  inventoryAdjustDefaultValues,
  inventoryAdjustSchema
} from '@/domains/inventory-admin/inventory.schema';
import { useInventoryStore } from '@/domains/inventory-admin/stores/inventory-store';
import { getGetAdminInventoryAdjustmentsRecentQueryKey } from '@/services/-admin-inventory-adjustments-recent-get';
import { getGetAdminInventoryOverviewQueryKey } from '@/services/-admin-inventory-overview-get';
import { getGetAdminInventoryProductsIdHistoryQueryKey } from '@/services/-admin-inventory-products-{id}-history-get';
import { getGetAdminInventoryQueryKey } from '@/services/-admin-inventory-get';
import { usePostAdminInventoryAdjust } from '@/services/-admin-inventory-adjust-post';

export function InventoryAdjustDialog() {
  const queryClient = useQueryClient();
  const adjustTarget = useInventoryStore((state) => state.adjustTarget);
  const closeAdjust = useInventoryStore((state) => state.closeAdjust);

  const { mutateAsync: adjustStock, isPending } = usePostAdminInventoryAdjust();

  const form = useAppForm({
    defaultValues: inventoryAdjustDefaultValues,
    validators: {
      onChange: inventoryAdjustSchema,
      onSubmit: inventoryAdjustSchema
    },
    onSubmit: async ({ value }) => {
      if (!adjustTarget?.id) return;

      try {
        await adjustStock({
          data: {
            product_id: adjustTarget.id,
            delta: value.delta,
            reason: value.reason,
            note: value.note?.trim() || undefined
          }
        });

        void queryClient.invalidateQueries({ queryKey: getGetAdminInventoryQueryKey() });
        void queryClient.invalidateQueries({ queryKey: getGetAdminInventoryOverviewQueryKey() });
        void queryClient.invalidateQueries({
          queryKey: getGetAdminInventoryProductsIdHistoryQueryKey(adjustTarget.id)
        });
        void queryClient.invalidateQueries({
          queryKey: getGetAdminInventoryAdjustmentsRecentQueryKey()
        });

        toast.success('Stock updated');
        closeAdjust();
        form.reset(inventoryAdjustDefaultValues);
      } catch (error) {
        toast.error('Failed to adjust stock', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  const applyQuickDelta = (delta: number) => {
    form.setFieldValue('delta', delta);
  };

  return (
    <AppDialog
      open={Boolean(adjustTarget)}
      onOpenChange={(open) => {
        if (!open) {
          closeAdjust();
          form.reset(inventoryAdjustDefaultValues);
        }
      }}
      title='Adjust stock'
      description={
        adjustTarget
          ? `${adjustTarget.name ?? 'Product'} · SKU ${adjustTarget.sku ?? '—'} · current ${adjustTarget.stock ?? 0}`
          : undefined
      }
      size='md'
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
            <Flex direction='row' spacing={2} className='flex-wrap'>
              <Button type='button' variant='outline' size='sm' onClick={() => applyQuickDelta(10)}>
                <IconPlus className='size-4' />
                +10
              </Button>
              <Button type='button' variant='outline' size='sm' onClick={() => applyQuickDelta(1)}>
                <IconPlus className='size-4' />
                +1
              </Button>
              <Button type='button' variant='outline' size='sm' onClick={() => applyQuickDelta(-1)}>
                <IconMinus className='size-4' />
                −1
              </Button>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => applyQuickDelta(-10)}
              >
                <IconMinus className='size-4' />
                −10
              </Button>
            </Flex>

            <form.AppField
              name='delta'
              children={(field) => (
                <field.NumberField
                  label='Quantity change'
                  required
                  detail='Positive to add stock, negative to remove'
                />
              )}
            />

            <form.AppField
              name='reason'
              children={(field) => (
                <field.Select label='Reason' options={[...INVENTORY_ADJUST_REASONS]} required />
              )}
            />

            <form.AppField
              name='note'
              children={(field) => (
                <field.TextArea
                  label='Note'
                  rows={3}
                  placeholder='Optional context for the audit log'
                />
              )}
            />

            <Flex direction='row' justify='end' spacing={2}>
              <Button type='button' variant='ghost' onClick={closeAdjust}>
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type='submit' disabled={!canSubmit || isPending || isSubmitting}>
                    {isPending || isSubmitting ? (
                      <>
                        <IconLoader2 className='size-4 animate-spin' />
                        Saving…
                      </>
                    ) : (
                      'Apply adjustment'
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
