'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { useSettingsDialogStore } from '@/domains/systems/system.store';
import { usePutSettingsKey } from '@/services/-settings-{key}-put';
import type { DtoSetSettingRequest } from '@/services/-settings-{key}-put.schemas';

const settingFormSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  description: z.string(),
  value: z.string().refine(
    (val) => {
      try {
        JSON.parse(val);
        return true;
      } catch {
        return false;
      }
    },
    { message: 'Invalid JSON' }
  )
});

interface SystemSetSettingProps {
  onSuccess?: () => void;
}

export function SystemsSetSetting({ onSuccess }: SystemSetSettingProps) {
  const { mutateAsync: putSetting, isPending: isPutPending } = usePutSettingsKey();
  const { modalType, selectedSetting, close } = useSettingsDialogStore();
  const isCreateOrUpdateOpen = modalType === 'create' || modalType === 'update';
  const editingSetting = modalType === 'update' ? selectedSetting : null;

  const form = useAppForm({
    defaultValues: {
      key: '',
      description: '',
      value: ''
    },
    validators: {
      onChange: settingFormSchema,
      onBlur: settingFormSchema
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const parsedValue = JSON.parse(value.value);
        const result = await putSetting({
          key: value.key,
          data: {
            value: parsedValue,
            description: value.description || undefined
          } as DtoSetSettingRequest
        });

        if (!result.success) {
          toast.error(result.message || 'Failed to save setting');
          return;
        }

        toast.success(editingSetting ? 'Setting updated' : 'Setting created');
        onSuccess?.();
        close();
        formApi.reset();
      } catch (err) {
        toast.error('Failed to save setting');
        console.error(err);
      }
    }
  });

  // Reset form when editing a different setting or switching to create mode
  useEffect(() => {
    if (modalType === 'update' && selectedSetting) {
      form.setFieldValue('key', selectedSetting.key as string);
      form.setFieldValue('description', selectedSetting.description ?? '');
      form.setFieldValue('value', JSON.stringify(selectedSetting.value, null, 2));
    } else if (modalType === 'create') {
      form.setFieldValue('key', '');
      form.setFieldValue('description', '');
      form.setFieldValue('value', '');
    }
  }, [modalType, selectedSetting, form]);

  return (
    <AppDialog
      open={isCreateOrUpdateOpen}
      onOpenChange={(open) => !open && close()}
      title={editingSetting ? 'Edit Setting' : 'Create Setting'}
      description='Settings are stored as JSON. Use valid JSON for the value.'
      className='w-screen max-w-screen sm:max-w-4xl md:max-w-6xl'
    >
      <form.AppForm>
        <form.Root
          onSubmit={async (e) => {
            e.preventDefault();
            await form.handleSubmit();
          }}
          className='space-y-4'
        >
          <form.AppField name='key'>
            {(field) => (
              <field.TextField
                label='Key'
                placeholder='e.g. site_name'
                className='h-12'
                disabled={!!editingSetting}
              />
            )}
          </form.AppField>
          <form.AppField name='description'>
            {(field) => (
              <field.TextField
                label='Description (optional)'
                placeholder='A short note about this setting'
                className='h-12'
              />
            )}
          </form.AppField>
          <form.AppField name='value'>{(field) => <field.JsonField />}</form.AppField>
          <div className='flex flex-wrap justify-end gap-2 pt-4'>
            <form.Submit isPending={isPutPending} label={editingSetting ? 'Update' : 'Create'} />
            <Button
              className='h-10 flex-1 rounded-lg'
              type='button'
              variant='outline'
              onClick={close}
            >
              Cancel
            </Button>
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
