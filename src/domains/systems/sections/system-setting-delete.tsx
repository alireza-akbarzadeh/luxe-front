// components/system-setting-delete.tsx
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { useSettingsDialogStore } from '@/domains/systems/system.store';
import { useDeleteSettingsKey } from '@/services/-settings-{key}-delete';

interface SystemSettingDeleteProps {
  onSuccess: () => void;
}

export function SystemSettingDelete({ onSuccess }: SystemSettingDeleteProps) {
  const { modalType, selectedSetting, close } = useSettingsDialogStore();
  const { mutateAsync: deleteSetting, isPending: isDeletePending } = useDeleteSettingsKey();

  const isOpen = modalType === 'delete';
  const setting = selectedSetting;

  const handleDelete = async () => {
    if (!setting?.key) return;
    try {
      await deleteSetting({ key: setting.key });
      toast.success('Setting deleted');
      onSuccess();
      close();
    } catch (err) {
      toast.error('Failed to delete setting');
      console.error(err);
    }
  };

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) close();
      }}
      title='Delete Setting'
      description={`Are you sure you want to delete “${setting?.key}”? This cannot be undone.`}
    >
      <div className='flex justify-end gap-2 pt-4'>
        <Button variant='outline' onClick={close}>
          Cancel
        </Button>
        <Button variant='destructive' onClick={handleDelete} disabled={isDeletePending}>
          {isDeletePending ? 'Deleting…' : 'Delete'}
        </Button>
      </div>
    </AppDialog>
  );
}
