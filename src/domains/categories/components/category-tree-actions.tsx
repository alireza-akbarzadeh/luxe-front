'use client';

import { IconChevronsDown, IconChevronsUp } from '@tabler/icons-react';
import { useEffect } from 'react';

import { useTableContext } from '@/components/table/table-context';
import { Button } from '@/components/ui/button';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import type { ModelsCategory } from '@/services/-categories-get.schemas';

/** Expand/collapse controls for the nested category table; auto-expands on mobile. */
export function CategoryTreeActions() {
  const { table } = useTableContext<ModelsCategory>();
  const { isDesktop } = useMediaDevices();
  const rowCount = table.getRowModel().rows.length;

  useEffect(() => {
    if (!isDesktop && rowCount > 0) {
      table.toggleAllRowsExpanded(true);
    }
  }, [isDesktop, rowCount, table]);

  if (!isDesktop) return null;

  return (
    <>
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={() => table.toggleAllRowsExpanded(true)}
      >
        <IconChevronsDown className='size-4' />
        Expand all
      </Button>
      <Button
        type='button'
        variant='outline'
        size='sm'
        onClick={() => table.toggleAllRowsExpanded(false)}
      >
        <IconChevronsUp className='size-4' />
        Collapse all
      </Button>
    </>
  );
}
