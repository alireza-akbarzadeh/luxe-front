'use client';

import { useTranslations } from 'next-intl';

import { FieldContainer } from '@/components/forms/form';
import { useFieldContext } from '@/components/forms/useFormContext';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { VendorAgreementDialog } from '@/domains/vendor/onboarding/components/vendor-agreement-dialog';

export function VendorAgreementField() {
  const t = useTranslations('vendor.onboarding.fields.acceptVendorTerms');
  const field = useFieldContext<boolean>();
  const error = field.state.meta.errors?.[0];

  return (
    <FieldContainer>
      <Flex direction='row' align='start' spacing={3}>
        <ShadcnCheckbox
          name={field.name}
          checked={field.state.value ?? false}
          onCheckedChange={(checked) => field.handleChange(!!checked)}
          onBlur={field.handleBlur}
          className='mt-0.5'
        />
        <Typography.Text className='text-sm leading-relaxed'>
          {t('prefix')}{' '}
          <VendorAgreementDialog
            trigger={
              <button
                type='button'
                className='text-primary font-medium underline-offset-4 hover:underline'
              >
                {t('agreementLink')}
              </button>
            }
          />
          {t('suffix')}
        </Typography.Text>
      </Flex>
      {error ? (
        <Typography.Text className='text-destructive mt-1 text-xs'>{String(error)}</Typography.Text>
      ) : null}
    </FieldContainer>
  );
}
