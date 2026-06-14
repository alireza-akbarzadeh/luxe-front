'use client';

import { useTransition } from 'react';
import { toast } from 'sonner';

import { changePasswordAction } from '@/actions/auth.actions';
import { useAppForm } from '~/src/components/forms/useAppForm';

import { changePasswordFormSchema } from '../../auth/auth.schema';

export function ChangePasswordPanel() {
  const [isPending, startTransition] = useTransition();

  const form = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validators: {
      onChange: changePasswordFormSchema,
      onBlur: changePasswordFormSchema
    },
    onSubmit: async ({ value, formApi }) => {
      startTransition(async () => {
        const result = await changePasswordAction(value.currentPassword, value.newPassword);

        if (result.success) {
          toast.success('Password changed successfully');
          formApi.reset();
          return;
        }

        toast.error(result.error ?? 'Unable to change password');
        if (result.error?.toLowerCase().includes('current password')) {
          formApi.setFieldMeta('currentPassword', (prev) => ({
            ...prev,
            error: result.error
          }));
        }
      });
    }
  });

  return (
    <div className='bg-card border-border rounded-2xl border p-6'>
      <div className='mb-4'>
        <h3 className='font-semibold'>Change password</h3>
        <p className='text-muted-foreground text-sm'>
          Update your password to keep your account secure
        </p>
      </div>

      <form.AppForm>
        <form.Root
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            form.handleSubmit();
          }}
          className='space-y-4'
        >
          <form.AppField name='currentPassword'>
            {(field) => (
              <field.InputPassword label='Current password' placeholder='Enter current password' />
            )}
          </form.AppField>

          <form.AppField name='newPassword'>
            {(field) => (
              <field.InputPassword label='New password' placeholder='Enter new password' />
            )}
          </form.AppField>

          <form.AppField name='confirmPassword'>
            {(field) => (
              <field.InputPassword
                label='Confirm new password'
                placeholder='Confirm new password'
              />
            )}
          </form.AppField>

          <form.Submit isPending={isPending} label='Update password' />
        </form.Root>
      </form.AppForm>
    </div>
  );
}
