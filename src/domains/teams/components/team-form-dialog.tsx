'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { zodFormValidators } from '@/domains/menus/schemas/form-validator';
import { useTeam, useTeamMutations } from '@/domains/teams/hooks/use-teams';
import {
  slugifyTeamName,
  teamDefaults,
  teamEditDefaults,
  teamEditSchema,
  teamSchema
} from '@/domains/teams/schemas/team.schema';
import { useTeamsStore } from '@/domains/teams/stores/teams-store';

export function TeamFormDialog() {
  const { createDialogOpen, editTeamId, closeDialogs } = useTeamsStore();
  const { data: editingTeam } = useTeam(editTeamId);
  const { createTeam, updateTeam, isCreating, isUpdating } = useTeamMutations();

  const isEdit = editTeamId != null;
  const open = createDialogOpen || isEdit;

  const createForm = useAppForm({
    defaultValues: teamDefaults,
    validators: zodFormValidators(teamSchema),
    listeners: {
      onChange: ({ formApi, fieldApi }) => {
        if (fieldApi?.name !== 'name') return;
        const slugMeta = formApi.getFieldMeta('slug');
        if (slugMeta?.isDirty) return;
        const slug = slugifyTeamName(formApi.getFieldValue('name'));
        if (slug) formApi.setFieldValue('slug', slug);
      }
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await createTeam({
          name: value.name,
          slug: value.slug,
          description: value.description?.trim() || undefined
        });
        toast.success('Team created');
        closeDialogs();
        formApi.reset();
      } catch {
        toast.error('Failed to create team');
      }
    }
  });

  const editForm = useAppForm({
    defaultValues: teamEditDefaults,
    validators: zodFormValidators(teamEditSchema),
    onSubmit: async ({ value, formApi }) => {
      if (!editTeamId) return;
      try {
        await updateTeam({
          id: editTeamId,
          data: {
            name: value.name,
            description: value.description?.trim() || undefined
          }
        });
        toast.success('Team updated');
        closeDialogs();
        formApi.reset();
      } catch {
        toast.error('Failed to update team');
      }
    }
  });

  useEffect(() => {
    if (!createDialogOpen) return;
    createForm.reset(teamDefaults);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when dialog opens
  }, [createDialogOpen]);

  useEffect(() => {
    if (!isEdit || !editingTeam) return;
    editForm.reset({
      name: editingTeam.name ?? '',
      description: editingTeam.description ?? ''
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when editing team loads
  }, [isEdit, editingTeam?.id]);

  return (
    <AppDialog
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && closeDialogs()}
      title={isEdit ? 'Edit team' : 'New team'}
      description={
        isEdit
          ? 'Update the team name and description. Slug is fixed after creation.'
          : 'Create a team to organize staff members.'
      }
      size='md'
    >
      {isEdit ? (
        <editForm.AppForm>
          <editForm.Root
            className='space-y-4 px-1 pb-2'
            onSubmit={() => {
              void editForm.handleSubmit();
            }}
          >
            <editForm.AppField name='name'>
              {(field) => <field.TextField label='Team name' />}
            </editForm.AppField>
            <editForm.AppField name='description'>
              {(field) => <field.TextArea label='Description (optional)' />}
            </editForm.AppField>
            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={closeDialogs}>
                Cancel
              </Button>
              <editForm.Submit isPending={isUpdating}>Save changes</editForm.Submit>
            </div>
          </editForm.Root>
        </editForm.AppForm>
      ) : (
        <createForm.AppForm>
          <createForm.Root
            className='space-y-4 px-1 pb-2'
            onSubmit={() => {
              void createForm.handleSubmit();
            }}
          >
            <createForm.AppField name='name'>
              {(field) => <field.TextField label='Team name' placeholder='Support' />}
            </createForm.AppField>
            <createForm.AppField name='slug'>
              {(field) => <field.TextField label='Slug' placeholder='support' />}
            </createForm.AppField>
            <createForm.AppField name='description'>
              {(field) => (
                <field.TextArea
                  label='Description (optional)'
                  placeholder='What this team handles'
                />
              )}
            </createForm.AppField>
            <div className='flex justify-end gap-2 pt-2'>
              <Button type='button' variant='outline' onClick={closeDialogs}>
                Cancel
              </Button>
              <createForm.Submit isPending={isCreating}>Create team</createForm.Submit>
            </div>
          </createForm.Root>
        </createForm.AppForm>
      )}
    </AppDialog>
  );
}
