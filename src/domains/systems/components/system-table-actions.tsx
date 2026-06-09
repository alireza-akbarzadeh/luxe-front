import { IconEye, IconPencil, IconTrash } from '@tabler/icons-react';
import type { Row } from '@tanstack/react-table';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useSettingsDialogStore } from '@/domains/systems/system.store';
import type { DtoSettingResponse } from '@/services/-settings-get.schemas';

interface SystemTableActionsProps {
  row: Row<DtoSettingResponse>;
}

export function SystemTableActions(props: SystemTableActionsProps) {
  const { row } = props;
  const { openUpdate, openDelete } = useSettingsDialogStore();

  return (
    <div className='flex items-center justify-end gap-1'>
      <Button
        variant='ghost'
        size='icon'
        className='h-7 w-7'
        onClick={() => {
          toast(
            <pre className='max-h-80 overflow-auto text-xs'>
              {JSON.stringify(row.original.value, null, 2)}
            </pre>,
            { duration: 5000 }
          );
        }}
      >
        <IconEye className='h-3.5 w-3.5' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='h-7 w-7'
        onClick={() => openUpdate(row.original)}
      >
        <IconPencil className='h-3.5 w-3.5' />
      </Button>
      <Button
        variant='ghost'
        size='icon'
        className='text-destructive hover:bg-destructive/10 h-7 w-7'
        onClick={() => openDelete(row.original)}
      >
        <IconTrash className='h-3.5 w-3.5' />
      </Button>
    </div>
  );
}
