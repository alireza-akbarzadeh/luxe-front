'use client';

import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { zodFormValidators } from '@/domains/menus/schemas/form-validator';
import { useTeamMutations } from '@/domains/teams/hooks/use-teams';
import { addTeamMemberDefaults, addTeamMemberSchema } from '@/domains/teams/schemas/team.schema';
import { useTeamsStore } from '@/domains/teams/stores/teams-store';
import { WalletUserPicker } from '@/domains/wallet-admin/components/wallet-user-picker';

export function AddTeamMemberDialog() {
  const { selectedTeamId, addMemberDialogOpen, closeDialogs } = useTeamsStore();
  const { addMember, isAddingMember } = useTeamMutations();

  const form = useAppForm({
    defaultValues: addTeamMemberDefaults,
    validators: zodFormValidators(addTeamMemberSchema),
    onSubmit: async ({ value, formApi }) => {
      if (!selectedTeamId) return;
      try {
        await addMember({
          teamId: selectedTeamId,
          data: {
            user_id: Number(value.user_id),
            role: value.role
          }
        });
        toast.success('Member added');
        closeDialogs();
        formApi.reset();
      } catch {
        toast.error('Failed to add member');
      }
    }
  });

  return (
    <AppDialog
      open={addMemberDialogOpen}
      onOpenChange={(nextOpen) => !nextOpen && closeDialogs()}
      title='Add team member'
      description='Search for a user by name or email.'
      size='md'
    >
      <form.AppForm>
        <form.Root
          className='space-y-4 px-1 pb-2'
          onSubmit={() => {
            void form.handleSubmit();
          }}
        >
          <form.AppField name='user_id'>
            {(field) => (
              <WalletUserPicker
                value={field.state.value}
                onChange={field.handleChange}
                label='User'
                error={
                  field.state.meta.errors.length > 0
                    ? String(field.state.meta.errors[0])
                    : undefined
                }
              />
            )}
          </form.AppField>
          <form.AppField name='role'>
            {(field) => (
              <field.Select
                label='Team role'
                options={[
                  { label: 'Member', value: 'member' },
                  { label: 'Lead', value: 'lead' }
                ]}
              />
            )}
          </form.AppField>
          <div className='flex justify-end gap-2 pt-2'>
            <Button type='button' variant='outline' onClick={closeDialogs}>
              Cancel
            </Button>
            <form.Submit isPending={isAddingMember}>Add member</form.Submit>
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
