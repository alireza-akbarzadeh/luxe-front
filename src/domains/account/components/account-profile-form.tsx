// containers/account-profile-form.tsx
'use client';

import { useTransition, type Dispatch, type SetStateAction } from 'react';
import { Button } from '~/src/components/ui/button';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { toast } from 'sonner';
import { profileFormSchema, type ProfileFormValues } from '../account.schema';
import { usePutProfile } from '~/src/services/-profile-put';
import { useQueryClient } from '@tanstack/react-query';
import { getGetAccountSummaryQueryKey } from '~/src/services/-account-summary-get';
import { AppDialog } from '~/src/components/app-dialog';

interface AccountProfileFormProps {
  onClose: () => void;
  defaultValues: ProfileFormValues;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function AccountProfileForm(props: AccountProfileFormProps) {
  const { defaultValues, onClose, onOpenChange, open } = props;
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending: isMutating } = usePutProfile();

  const form = useAppForm({
    defaultValues: defaultValues,
    validators: {
      onChange: profileFormSchema,
      onBlur: profileFormSchema
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          await mutateAsync({
            data: {
              first_name: value.firstName,
              last_name: value.lastName,
              phone: value.phone
            }
          });
          await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
          toast.success('Profile updated successfully');
          onClose();
        } catch (error: any) {
          const message = error?.response?.data?.message || 'Failed to update profile';
          toast.error(message);
        }
      });
    }
  });

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <form.AppForm>
        <form.Root
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className='grid grid-cols-2 gap-4'
        >
          <form.AppField name='firstName'>
            {(field) => <field.TextField label='First Name' />}
          </form.AppField>
          <form.AppField name='lastName'>
            {(field) => <field.TextField label='Last Name' />}
          </form.AppField>
          <form.AppField name='email'>
            {(field) => <field.TextField label='Email' disabled />}
          </form.AppField>
          <form.AppField name='phone'>
            {(field) => <field.TextField label='Phone' placeholder='+1 (555) 000-0000' />}
          </form.AppField>
          <div className='col-span-2 flex items-center justify-end gap-2'>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <form.Submit isPending={isPending || isMutating} label='Save Changes' />
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
