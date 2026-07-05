'use client';

import { IconTargetArrow } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useGoalShopping } from '@/domains/goal-shopping/hooks/use-goal-shopping';
import {
  createGoalShoppingSchema,
  emptyGoalShoppingForm,
  type GoalShoppingFormValues
} from '@/domains/goal-shopping/schemas/goal-shopping-schema';
import { ShoppingAssistantRecommendationCard } from '@/domains/shopping-assistant/components/shopping-assistant-recommendation-card';
import type { DtoAiGoalShoppingResponse } from '@/services/-ai-goal-shopping-post.schemas';

/** Goal-based shopping planner — describe an outcome, get steps and product picks. */
export function GoalShoppingDomain() {
  const t = useTranslations('goalShopping');
  const { findForGoal, offlineMessage } = useGoalShopping();
  const [result, setResult] = useState<DtoAiGoalShoppingResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useAppForm({
    defaultValues: emptyGoalShoppingForm,
    validators: { onSubmit: createGoalShoppingSchema(t('errors.goalTooShort')) },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      setResult(null);
      const payload = mapGoalFormToRequest(value);
      const response = await findForGoal(payload);
      setIsSubmitting(false);
      if (!response) {
        toast.error(offlineMessage);
        return;
      }
      setResult(response);
    }
  });

  return (
    <main className='app-container py-12 pb-24'>
      <Flex direction='column' spacing={3} className='mb-8 max-w-2xl'>
        <Flex direction='row' align='center' spacing={2}>
          <IconTargetArrow className='text-gold-strong size-6' />
          <Typography.H1 className='font-display text-3xl font-semibold tracking-tight lg:text-4xl'>
            {t('title')}
          </Typography.H1>
        </Flex>
        <Typography.Muted className='leading-relaxed'>{t('subtitle')}</Typography.Muted>
      </Flex>

      <Flex direction='column' spacing={8} className='max-w-2xl'>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void form.handleSubmit();
          }}
          className='border-border/70 space-y-4 rounded-2xl border p-6'
        >
          <form.AppField name='goal'>
            {(field) => (
              <field.TextArea
                label={t('fields.goal')}
                placeholder={t('fields.goalPlaceholder')}
                rows={4}
              />
            )}
          </form.AppField>
          <form.AppField name='timeline'>
            {(field) => (
              <field.TextField
                label={t('fields.timeline')}
                placeholder={t('fields.timelinePlaceholder')}
              />
            )}
          </form.AppField>
          <form.AppField name='preferences'>
            {(field) => (
              <field.TextField
                label={t('fields.preferences')}
                placeholder={t('fields.preferencesPlaceholder')}
              />
            )}
          </form.AppField>
          <Flex direction='row' spacing={3} className='gap-3'>
            <form.AppField name='budget_min'>
              {(field) => <field.NumberField label={t('fields.budgetMin')} />}
            </form.AppField>
            <form.AppField name='budget_max'>
              {(field) => <field.NumberField label={t('fields.budgetMax')} />}
            </form.AppField>
          </Flex>
          <Button type='submit' className='rounded-full' disabled={isSubmitting}>
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </form>

        {result ? (
          <Flex direction='column' spacing={5}>
            {result.reply ? (
              <Typography.Text className='text-muted-foreground leading-relaxed'>
                {result.reply}
              </Typography.Text>
            ) : null}
            {result.steps && result.steps.length > 0 ? (
              <Flex direction='column' spacing={2}>
                <Typography.Text className='text-sm font-medium'>{t('steps')}</Typography.Text>
                <ol className='text-muted-foreground list-decimal space-y-1.5 ps-5 text-sm'>
                  {result.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </Flex>
            ) : null}
            {result.recommendations && result.recommendations.length > 0 ? (
              <Flex direction='column' spacing={3}>
                <Typography.Text className='text-sm font-medium'>{t('picks')}</Typography.Text>
                <Flex direction='column' spacing={2}>
                  {result.recommendations.map((item) => (
                    <ShoppingAssistantRecommendationCard
                      key={item.product?.id ?? item.reason}
                      item={item}
                    />
                  ))}
                </Flex>
              </Flex>
            ) : null}
            <Typography.Muted className='text-xs'>{t('footer')}</Typography.Muted>
          </Flex>
        ) : null}
      </Flex>
    </main>
  );
}

function mapGoalFormToRequest(value: GoalShoppingFormValues) {
  return {
    goal: value.goal,
    timeline: value.timeline || undefined,
    preferences: value.preferences || undefined,
    budget_min: value.budget_min,
    budget_max: value.budget_max
  };
}
