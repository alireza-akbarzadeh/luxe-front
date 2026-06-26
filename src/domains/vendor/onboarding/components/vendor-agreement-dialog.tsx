'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

interface VendorAgreementDialogProps {
  trigger: React.ReactNode;
}

export function VendorAgreementDialog({ trigger }: VendorAgreementDialogProps) {
  const t = useTranslations('vendor.onboarding.agreement');
  const [open, setOpen] = useState(false);

  return (
    <AppDialog
      open={open}
      onOpenChange={setOpen}
      trigger={trigger}
      title={t('title')}
      description={t('subtitle')}
      size='lg'
    >
      <Flex direction='column' spacing={4}>
        <Typography.Text className='text-muted-foreground text-sm leading-relaxed whitespace-pre-line'>
          {t('body')}
        </Typography.Text>
        <Typography.Text className='text-sm'>
          <Link href='/legal/terms' className='text-primary underline-offset-4 hover:underline'>
            {t('fullTermsLink')}
          </Link>
        </Typography.Text>
        <Flex direction='row' justify='end'>
          <Button type='button' onClick={() => setOpen(false)}>
            {t('close')}
          </Button>
        </Flex>
      </Flex>
    </AppDialog>
  );
}
