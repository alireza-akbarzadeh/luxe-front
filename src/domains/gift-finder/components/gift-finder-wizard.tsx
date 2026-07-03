'use client';

import { IconArrowLeft, IconArrowRight, IconGift, IconLoader2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { GiftFinderChipSelect } from '../components/gift-finder-chip-select';
import { GiftFinderStepShell } from '../components/gift-finder-step-shell';
import { useGiftFinderWizard } from '../hooks/use-gift-finder-wizard';
import { GiftFinderResults } from '../sections/gift-finder-results';

/** Multi-step gift recommendation wizard. */
export function GiftFinderWizard() {
  const t = useTranslations('giftFinder');
  const wizard = useGiftFinderWizard();

  const nextLabel =
    wizard.step === 'interests' || wizard.step === 'followUp'
      ? t('actions.findGifts')
      : t('actions.continue');

  return (
    <Flex direction='column' spacing={8}>
      {!wizard.isResults ? (
        <Flex direction='column' spacing={2}>
          <Flex direction='row' align='center' justify='between'>
            <Typography.Overline className='text-gold-strong'>
              {t('progress', {
                current: wizard.progressStep,
                total: wizard.progressTotal
              })}
            </Typography.Overline>
            <Flex align='center' spacing={1} className='text-muted-foreground'>
              <IconGift className='size-4' />
              <Typography.Muted className='text-xs'>{t('badge')}</Typography.Muted>
            </Flex>
          </Flex>
          <div className='bg-muted h-1.5 overflow-hidden rounded-full'>
            <div
              className='bg-gold h-full rounded-full transition-[width] duration-300'
              style={{ width: `${(wizard.progressStep / wizard.progressTotal) * 100}%` }}
            />
          </div>
        </Flex>
      ) : null}

      {wizard.step === 'recipient' ? (
        <GiftFinderStepShell
          title={t('steps.recipient.title')}
          description={t('steps.recipient.description')}
        >
          <GiftFinderChipSelect
            options={wizard.recipientOptions}
            value={wizard.draft.recipient}
            onChange={wizard.selectRecipient}
            labelFor={(key) => t(`options.recipients.${key}` as never)}
          />
        </GiftFinderStepShell>
      ) : null}

      {wizard.step === 'occasion' ? (
        <GiftFinderStepShell
          title={t('steps.occasion.title')}
          description={t('steps.occasion.description')}
        >
          <GiftFinderChipSelect
            options={wizard.occasionOptions}
            value={wizard.draft.occasion}
            onChange={wizard.selectOccasion}
            labelFor={(key) => t(`options.occasions.${key}` as never)}
            columns={3}
          />
        </GiftFinderStepShell>
      ) : null}

      {wizard.step === 'budget' ? (
        <GiftFinderStepShell
          title={t('steps.budget.title')}
          description={t('steps.budget.description')}
        >
          <GiftFinderChipSelect
            options={wizard.budgetOptions}
            value={wizard.draft.budgetKey}
            onChange={wizard.selectBudget}
            labelFor={(key) => t(`options.budgets.${key}` as never)}
          />
        </GiftFinderStepShell>
      ) : null}

      {wizard.step === 'interests' ? (
        <GiftFinderStepShell
          title={t('steps.interests.title')}
          description={t('steps.interests.description')}
        >
          <Flex direction='column' spacing={4}>
            <Flex direction='column' spacing={2}>
              <Typography.Text className='text-sm font-medium'>
                {t('steps.interests.styleLabel')}
              </Typography.Text>
              <Flex direction='row' wrap='wrap' spacing={2}>
                {wizard.styleOptions.map((tag) => {
                  const selected = wizard.draft.styleTags.includes(tag);
                  return (
                    <Button
                      key={tag}
                      type='button'
                      size='sm'
                      variant={selected ? 'default' : 'outline'}
                      className='rounded-full'
                      aria-pressed={selected}
                      onClick={() => wizard.toggleStyleTag(tag)}
                    >
                      {t(`options.styles.${tag}` as never)}
                    </Button>
                  );
                })}
              </Flex>
            </Flex>
            <Textarea
              value={wizard.draft.interests}
              onChange={(e) => wizard.setInterests(e.target.value)}
              placeholder={t('steps.interests.placeholder')}
              rows={4}
              className='min-h-28 resize-none rounded-2xl'
            />
            <Textarea
              value={wizard.draft.additionalNotes}
              onChange={(e) => wizard.setAdditionalNotes(e.target.value)}
              placeholder={t('steps.interests.notesPlaceholder')}
              rows={2}
              className='resize-none rounded-2xl'
            />
          </Flex>
        </GiftFinderStepShell>
      ) : null}

      {wizard.step === 'followUp' ? (
        <GiftFinderStepShell
          title={t('steps.followUp.title')}
          description={t('steps.followUp.description')}
        >
          <Flex direction='column' spacing={4}>
            {wizard.followUpQuestions.map((question) => (
              <Flex key={question} direction='column' spacing={2}>
                <Typography.Text className='text-sm font-medium'>{question}</Typography.Text>
                <Textarea
                  value={wizard.followUpAnswers[question] ?? ''}
                  onChange={(e) => wizard.setFollowUpAnswer(question, e.target.value)}
                  rows={2}
                  className='resize-none rounded-2xl'
                />
              </Flex>
            ))}
          </Flex>
        </GiftFinderStepShell>
      ) : null}

      {wizard.step === 'results' && wizard.result ? (
        <GiftFinderResults result={wizard.result} onStartOver={wizard.startOver} />
      ) : null}

      {!wizard.isResults ? (
        <Flex direction='row' align='center' justify='between' spacing={3}>
          <Button
            type='button'
            variant='ghost'
            className='rounded-2xl'
            disabled={wizard.isFirst || wizard.isPending}
            onClick={wizard.goBack}
          >
            <IconArrowLeft className='cn-rtl-flip me-2 size-4' />
            {t('actions.back')}
          </Button>
          <Button
            type='button'
            className={cn('rounded-2xl px-6')}
            disabled={!wizard.canGoNext || wizard.isPending}
            onClick={() => void wizard.goNext()}
          >
            {wizard.isPending ? (
              <>
                <IconLoader2 className='me-2 size-4 animate-spin' />
                {t('actions.finding')}
              </>
            ) : (
              <>
                {nextLabel}
                <IconArrowRight className='cn-rtl-flip ms-2 size-4' />
              </>
            )}
          </Button>
        </Flex>
      ) : null}
    </Flex>
  );
}
