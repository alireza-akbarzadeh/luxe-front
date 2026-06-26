'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { DirectionalArrow } from '@/components/ui/directional-icon';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { getDirection, type Locale } from '@/i18n/config';

interface OnboardingFormActionsProps {
  currentIdx: number;
  totalSteps: number;
  isLastStep: boolean;
  isSubmitting: boolean;
  onBack: () => void;
}

export function OnboardingFormActions({
  currentIdx,
  totalSteps,
  isLastStep,
  isSubmitting,
  onBack
}: OnboardingFormActionsProps) {
  const t = useTranslations('vendor.onboarding');
  const locale = useLocale() as Locale;
  const rtl = getDirection(locale) === 'rtl';

  return (
    <Flex
      direction='row'
      fullWidth
      justify='between'
      align='center'
      className='border-border/50 border-t pt-6'
    >
      <Button
        type='button'
        variant='outline'
        onClick={onBack}
        disabled={currentIdx === 0 || isSubmitting}
        className='gap-2'
      >
        {rtl ? (
          <IconChevronRight className='size-4' aria-hidden />
        ) : (
          <IconChevronLeft className='size-4' aria-hidden />
        )}
        {t('actions.back')}
      </Button>

      <Typography.Muted className='hidden text-xs tabular-nums sm:block'>
        {t('progress', { current: currentIdx + 1, total: totalSteps })}
      </Typography.Muted>

      {isLastStep ? (
        <Button type='submit' disabled={isSubmitting} className='gap-2 rounded-full px-6'>
          {isSubmitting ? t('actions.submitting') : t('actions.launchStore')}
          {!isSubmitting ? <DirectionalArrow /> : null}
        </Button>
      ) : (
        <Button type='submit' disabled={isSubmitting} className='gap-2 rounded-full px-6'>
          {t('actions.continue')}
          {rtl ? (
            <IconChevronLeft className='size-4' aria-hidden />
          ) : (
            <IconChevronRight className='size-4' aria-hidden />
          )}
        </Button>
      )}
    </Flex>
  );
}
