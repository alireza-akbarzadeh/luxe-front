'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { profileFormSchema } from '@/domains/account/account.schema';
import { ChangePasswordPanel } from '@/domains/account/components/change-password-panel';
import { EmailVerificationPanel } from '@/domains/account/components/email-verification-panel';
import { VendorModuleHeader } from '@/domains/vendor/panel/components/ui/vendor-module-header';
import {
  getGetAccountSummaryQueryKey,
  useGetAccountSummary
} from '@/services/-account-summary-get';
import { usePutProfile } from '@/services/-profile-put';

export function VendorAccountDomain() {
  return <VendorAccountSettingsContent />;
}

function VendorAccountSettingsContent() {
  const t = useTranslations('vendor.panel.account');
  const tFields = useTranslations('auth.fields');
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);

  const { data: summaryData, isLoading, error } = useGetAccountSummary();
  const { mutateAsync } = usePutProfile();
  const user = summaryData?.data;

  const form = useAppForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    validators: { onSubmit: profileFormSchema },
    onSubmit: async ({ value }) => {
      setIsSaving(true);
      try {
        await mutateAsync({
          data: {
            first_name: value.firstName,
            last_name: value.lastName,
            phone: value.phone
          }
        });
        await queryClient.invalidateQueries({ queryKey: getGetAccountSummaryQueryKey() });
        toast.success(t('saved'));
      } catch (submitError: unknown) {
        const message =
          (submitError as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? t('saveFailed');
        toast.error(message);
      } finally {
        setIsSaving(false);
      }
    }
  });

  useEffect(() => {
    if (!user) return;

    form.reset({
      firstName: user.first_name ?? '',
      lastName: user.last_name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? ''
    });
  }, [form, user]);

  if (isLoading) {
    return <p className='text-muted-foreground text-sm'>{t('loading')}</p>;
  }

  if (error || !user) {
    return <p className='text-destructive text-sm'>{t('loadError')}</p>;
  }

  const initials = `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`;

  return (
    <Flex direction='column' spacing={8} fullWidth>
      <VendorModuleHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Button
            size='sm'
            className='rounded-xl'
            disabled={isSaving}
            onClick={() => void form.handleSubmit()}
          >
            {isSaving ? t('saving') : t('saveChanges')}
          </Button>
        }
      />

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
        <CardHeader>
          <Flex direction='row' align='center' spacing={4}>
            <span className='bg-gold/15 text-gold flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold'>
              {initials}
            </span>
            <div className='min-w-0'>
              <CardTitle className='text-base'>
                {user.first_name} {user.last_name}
              </CardTitle>
              <p className='text-muted-foreground truncate text-sm' dir='ltr'>
                {user.email}
              </p>
            </div>
          </Flex>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <form.Root
              onSubmit={(e) => {
                e.preventDefault();
                void form.handleSubmit();
              }}
            >
              <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                <form.AppField
                  name='firstName'
                  children={(field) => <field.TextField label={tFields('firstName')} required />}
                />
                <form.AppField
                  name='lastName'
                  children={(field) => <field.TextField label={tFields('lastName')} required />}
                />
                <form.AppField
                  name='email'
                  children={(field) => <field.TextField label={tFields('email')} disabled />}
                />
                <form.AppField
                  name='phone'
                  children={(field) => (
                    <field.TextField
                      label={tFields('phone')}
                      placeholder={tFields('phonePlaceholder')}
                    />
                  )}
                />
              </Grid>
            </form.Root>
          </form.AppForm>
        </CardContent>
      </Card>

      <EmailVerificationPanel />
      <ChangePasswordPanel />
    </Flex>
  );
}
