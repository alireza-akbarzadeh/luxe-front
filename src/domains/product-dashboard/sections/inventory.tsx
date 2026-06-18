'use client';

import { IconAlertTriangle, IconPackage } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Separator } from '@/components/ui/separator';

import { productDefaultValues } from '../product-schema';

export const InventoryStep = withForm({
  defaultValues: productDefaultValues,
  render: function InventoryRender({ form }) {
    const trackInventory = useStore(form.store, (s) => s.values.trackInventory);

    return (
      <Flex direction='column' spacing={8}>
        {/* ── Identifiers ───────────────────────────────────────────── */}
        <Flex direction='column' spacing={4}>
          <h3 className='text-foreground text-sm font-medium'>Identifiers</h3>

          <Grid cols={1} gap={4} className='sm:grid-cols-2'>
            <GridItem>
              <form.AppField
                name='sku'
                children={(field) => (
                  <field.TextField
                    label='SKU (Stock Keeping Unit)'
                    placeholder='e.g. SHOE-001-BLK'
                    detail='Internal identifier for your product'
                    required
                  />
                )}
              />
            </GridItem>

            <GridItem>
              <form.AppField
                name='barcode'
                children={(field) => (
                  <field.TextField
                    label='Barcode (ISBN, UPC, GTIN…)'
                    placeholder='e.g. 012345678905'
                  />
                )}
              />
            </GridItem>
          </Grid>
        </Flex>

        <Separator />

        {/* ── Stock tracking ────────────────────────────────────────── */}
        <Flex direction='column' spacing={4}>
          <h3 className='text-foreground text-sm font-medium'>Stock tracking</h3>

          <form.AppField
            name='trackInventory'
            children={(field) => (
              <field.Switch
                label='Track inventory'
                description='Automatically update stock levels when orders are placed'
              />
            )}
          />

          {trackInventory && (
            <Grid cols={1} gap={4} className='sm:grid-cols-2'>
              <GridItem>
                <form.AppField
                  name='quantity'
                  children={(field) => (
                    <field.NumberField
                      label='Quantity in stock'
                      type='number'
                      min={0}
                      step={1}
                      detail='How meny in stock'
                      placeholder='0'
                    />
                  )}
                />
              </GridItem>

              <GridItem>
                <form.AppField
                  name='lowStockThreshold'
                  children={(field) => (
                    <field.NumberField
                      label='Low stock alert threshold'
                      type='number'
                      min={0}
                      step={1}
                      placeholder='5'
                      detail='Get notified when stock drops below this'
                    />
                  )}
                />
              </GridItem>

              <GridItem colSpan={1} className='sm:col-span-2'>
                <form.AppField
                  name='allowBackorder'
                  children={(field) => (
                    <field.Switch
                      label='Allow backorders'
                      description='Continue selling when out of stock'
                    />
                  )}
                />
              </GridItem>
            </Grid>
          )}

          {!trackInventory && (
            <Flex
              direction='row'
              align='center'
              spacing={2}
              className='rounded-md bg-amber-50 p-3 dark:bg-amber-950/30'
            >
              <IconAlertTriangle className='size-4 shrink-0 text-amber-600 dark:text-amber-400' />
              <p className='text-xs text-amber-700 dark:text-amber-300'>
                Inventory tracking is disabled. Stock levels will not be updated automatically.
              </p>
            </Flex>
          )}
        </Flex>

        <Separator />

        {/* ── Location ──────────────────────────────────────────────── */}
        <Flex direction='column' spacing={4}>
          <Flex direction='row' align='center' spacing={2}>
            <IconPackage className='text-muted-foreground size-4' />
            <h3 className='text-foreground text-sm font-medium'>Warehouse location</h3>
          </Flex>

          <form.AppField
            name='warehouseLocation'
            children={(field) => (
              <field.TextField
                label='Location / bin'
                placeholder='e.g. Shelf A3, Bin 12'
                detail='Optional — helps staff find the item quickly'
              />
            )}
          />
        </Flex>
      </Flex>
    );
  }
});
