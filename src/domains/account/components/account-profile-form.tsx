'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction, useTransition } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '~/src/components/app-dialog';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { Button } from '~/src/components/ui/button';
import { getGetAccountSummaryQueryKey } from '~/src/services/-account-summary-get';
import { usePutProfile } from '~/src/services/-profile-put';

import { profileFormSchema, type ProfileFormValues } from '../account.schema';
import { AccountProfileAvatarField } from './account-profile-avatar-field';

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
  const t = useTranslations('account.overview');
  const tCommon = useTranslations('account.common');
  const tFields = useTranslations('auth.fields');

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
              phone: value.phone,
              avatar_url: value.avatarUrl
            }
          });
          await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
          toast.success(t('profileUpdated'));
          onClose();
        } catch (error: unknown) {
          const message =
            (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t('profileUpdateFailed');
          toast.error(message);
        }
      });
    }
  });

  return (
    <AppDialog title={t('profileTitle')} open={open} onOpenChange={onOpenChange}>
      <form.AppForm>
        <form.Root
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className='grid grid-cols-2 gap-4'
        >
          <form.Subscribe
            selector={(state) => ({
              avatarUrl: state.values.avatarUrl,
              firstName: state.values.firstName,
              lastName: state.values.lastName
            })}
          >
            {({ avatarUrl, firstName, lastName }) => (
              <AccountProfileAvatarField
                avatarUrl={avatarUrl}
                fallbackLabel={`${firstName}${lastName}`}
                onAvatarUrlChange={(url) => form.setFieldValue('avatarUrl', url)}
              />
            )}
          </form.Subscribe>
          <form.AppField name='firstName'>
            {(field) => <field.TextField label={tFields('firstName')} />}
          </form.AppField>
          <form.AppField name='lastName'>
            {(field) => <field.TextField label={tFields('lastName')} />}
          </form.AppField>
          <form.AppField name='email'>
            {(field) => <field.TextField label={tFields('email')} disabled />}
          </form.AppField>
          <form.AppField name='phone'>
            {(field) => (
              <field.TextField label={tFields('phone')} placeholder={tFields('phonePlaceholder')} />
            )}
          </form.AppField>
          <div className='col-span-2 flex items-center justify-end gap-2'>
            <Button className='flex-1' size='lg' type='button' variant='outline' onClick={onClose}>
              {tCommon('cancel')}
            </Button>
            <form.Submit
              className='flex-1'
              isPending={isPending || isMutating}
              label={tCommon('saveChanges')}
            />
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
