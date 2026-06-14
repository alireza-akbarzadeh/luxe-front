'use client';

import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { usePostAuthChangePassword } from '~/src/services/-auth-change-password-post';

import { changePasswordFormSchema } from '../../auth/auth.schema';

export function ChangePasswordPanel() {
  const { mutateAsync, isPending } = usePostAuthChangePassword();

  const form = useAppForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validators: {
      onSubmit: changePasswordFormSchema
    },
    onSubmit: async ({ value, formApi }) => {
      try {
        await mutateAsync({
          data: {
            current_password: value.currentPassword,
            new_password: value.newPassword
          }
        });
        toast.success('Password updated successfully');
        formApi.reset();
      } catch (error) {
        const message = extractErrorMessage(error as AxiosError<ApiErrorResponse>);
        toast.error(message);

        if (message.toLowerCase().includes('current password')) {
          formApi.setFieldMeta('currentPassword', (prev) => ({
            ...prev,
            error: message
          }));
        }
      }
    }
  });

  return (
    <div className='bg-card border-border rounded-2xl border p-6 sm:p-7'>
      <div className='mb-5'>
        <h3 className='font-display text-lg font-semibold tracking-tight'>Change password</h3>
        <p className='text-muted-foreground mt-1 text-sm'>
          Use at least 8 characters. Updating your password keeps your account secure.
        </p>
      </div>

      <form.AppForm>
        <form.Root
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
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

          <form.Submit isPending={isPending} label='Update password' className='max-w-xs' />
        </form.Root>
      </form.AppForm>
    </div>
  );
}
