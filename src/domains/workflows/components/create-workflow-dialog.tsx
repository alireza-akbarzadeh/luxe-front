'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import {
  createWorkflowSchema,
  ENTITY_TYPE_SUGGESTIONS,
  zodFormValidator
} from '@/domains/workflows/schemas/workflow-schema';
import { useCreateWorkflowDialogStore } from '@/domains/workflows/stores/workflow-editor-store';
import { getGetAdminWorkflowsQueryKey } from '@/services/-admin-workflows-get';
import { usePostAdminWorkflows } from '@/services/-admin-workflows-post';

interface CreateWorkflowDialogProps {
  onCreated?: (workflowKey: string) => void;
}

export function CreateWorkflowDialog({ onCreated }: CreateWorkflowDialogProps) {
  const queryClient = useQueryClient();
  const { open, setOpen } = useCreateWorkflowDialogStore();
  const { mutateAsync: createWorkflow, isPending } = usePostAdminWorkflows();

  const form = useAppForm({
    defaultValues: {
      key: '',
      name: '',
      entity_type: 'product',
      description: ''
    },
    validators: {
      onChange: zodFormValidator(createWorkflowSchema),
      onSubmit: zodFormValidator(createWorkflowSchema)
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        const result = await createWorkflow({
          data: {
            key: value.key,
            name: value.name,
            entity_type: value.entity_type,
            description: value.description || undefined
          }
        });

        if (!result.success) {
          toast.error(result.message ?? 'Failed to create workflow');
          return;
        }

        toast.success('Workflow created');
        await queryClient.invalidateQueries({ queryKey: getGetAdminWorkflowsQueryKey() });
        setOpen(false);
        formApi.reset();
        onCreated?.(value.key);
      } catch {
        toast.error('Failed to create workflow');
      }
    }
  });

  useEffect(() => {
    if (!open) form.reset();
  }, [open, form]);

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      title='Create workflow'
      description='Define a new state machine. Add states and transitions in the visual editor.'
      size='lg'
    >
      <form.AppForm>
        <form.Root
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className='space-y-4'
        >
          <form.AppField name='key'>
            {(field) => (
              <field.TextField label='Key' placeholder='product_v2' detail='Unique slug used in API paths' />
            )}
          </form.AppField>
          <form.AppField name='name'>
            {(field) => <field.TextField label='Name' placeholder='Product lifecycle' />}
          </form.AppField>
          <form.AppField name='entity_type'>
            {(field) => (
              <field.Select
                label='Entity type'
                placeholder='Select entity'
                options={ENTITY_TYPE_SUGGESTIONS.map((t) => ({ label: t, value: t }))}
              />
            )}
          </form.AppField>
          <form.AppField name='description'>
            {(field) => (
              <field.TextArea label='Description' placeholder='Optional description for admins' rows={3} />
            )}
          </form.AppField>
          <div className='flex justify-end gap-2 pt-2'>
            <Button type='button' variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <form.Subscribe selector={(s) => s.isSubmitting}>
              {(submitting) => (
                <form.Submit disabled={submitting || isPending}>
                  {submitting || isPending ? 'Creating…' : 'Create & open editor'}
                </form.Submit>
              )}
            </form.Subscribe>
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
