'use client';

import type { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { toast } from 'sonner';

import { extractErrorMessage } from '@/lib/api/api-utils';
import type { ApiErrorResponse } from '@/lib/api/type';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { usePostAuthChangePassword } from '~/src/services/-auth-change-password-post';

import { createChangePasswordFormSchema } from '../../auth/auth.schema';

export function ChangePasswordPanel() {
  const tChange = useTranslations('auth.changePassword');
  const tValidation = useTranslations('auth.validation');
  const { mutateAsync, isPending } = usePostAuthChangePassword();

  const changePasswordFormSchema = useMemo(
    () => createChangePasswordFormSchema(tValidation),
    [tValidation]
  );

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
        toast.success(tChange('successToast'));
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
        <h3 className='font-display text-lg font-semibold tracking-tight'>{tChange('title')}</h3>
        <p className='text-muted-foreground mt-1 text-sm'>{tChange('subtitle')}</p>
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
              <field.InputPassword
                label={tChange('currentPassword')}
                placeholder={tChange('currentPasswordPlaceholder')}
              />
            )}
          </form.AppField>

          <form.AppField name='newPassword'>
            {(field) => (
              <field.InputPassword
                label={tChange('newPassword')}
                placeholder={tChange('newPasswordPlaceholder')}
              />
            )}
          </form.AppField>

          <form.AppField name='confirmPassword'>
            {(field) => (
              <field.InputPassword
                label={tChange('confirmPassword')}
                placeholder={tChange('confirmPasswordPlaceholder')}
              />
            )}
          </form.AppField>

          <form.Submit isPending={isPending} label={tChange('submit')} className='max-w-xs' />
        </form.Root>
      </form.AppForm>
    </div>
  );
}
