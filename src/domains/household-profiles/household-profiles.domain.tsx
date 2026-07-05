'use client';

import { IconHomeHeart, IconTrash, IconUsers } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useHouseholdShopping } from '@/domains/household-profiles/hooks/use-household-shopping';
import {
  createHouseholdMemberSchema,
  emptyHouseholdMemberForm,
  emptyHouseholdShoppingForm,
  type HouseholdMemberFormValues
} from '@/domains/household-profiles/schemas/household-profiles-schema';
import { useHouseholdProfilesStore } from '@/domains/household-profiles/stores/household-profiles-store';
import { ShoppingAssistantRecommendationCard } from '@/domains/shopping-assistant/components/shopping-assistant-recommendation-card';
import type { DtoAiHouseholdShoppingResponse } from '@/services/-ai-household-shopping-post.schemas';
import { DynamicBreadcrumb } from '~/src/components/breadcrumb-list';

/** Manage household profiles and get per-member product picks. */
export function HouseholdProfilesDomain() {
  const t = useTranslations('householdProfiles');
  const { isAuthenticated } = useAuth();
  const members = useHouseholdProfilesStore((state) => state.members);
  const addMember = useHouseholdProfilesStore((state) => state.addMember);
  const removeMember = useHouseholdProfilesStore((state) => state.removeMember);
  const { findForHousehold, isPending, offlineMessage } = useHouseholdShopping();
  const [result, setResult] = useState<DtoAiHouseholdShoppingResponse | null>(null);

  const memberForm = useAppForm({
    defaultValues: emptyHouseholdMemberForm,
    validators: { onSubmit: createHouseholdMemberSchema(t('errors.nameTooShort')) },
    onSubmit: async ({ value }) => {
      addMember(mapMemberForm(value));
      memberForm.reset();
      toast.success(t('memberAdded'));
    }
  });

  const shopForm = useAppForm({
    defaultValues: emptyHouseholdShoppingForm,
    onSubmit: async ({ value }) => {
      if (members.length === 0) {
        toast.error(t('errors.noMembers'));
        return;
      }
      setResult(null);
      const response = await findForHousehold({
        members: members.map((member) => ({
          name: member.name,
          relationship: member.relationship || undefined,
          sizes: member.sizes || undefined,
          preferences: member.preferences || undefined,
          interests: member.interests || undefined
        })),
        context: value.context || undefined,
        budget_min: value.budget_min,
        budget_max: value.budget_max
      });
      if (!response) {
        toast.error(offlineMessage);
        return;
      }
      setResult(response);
    }
  });

  if (!isAuthenticated) {
    return (
      <main className='app-container py-16'>
        <Flex
          direction='column'
          align='center'
          spacing={4}
          className='mx-auto max-w-lg text-center'
        >
          <IconUsers className='text-gold-strong size-10' />
          <Typography.H1 className='font-display text-3xl font-semibold'>
            {t('guestTitle')}
          </Typography.H1>
          <Typography.Muted>{t('guestDescription')}</Typography.Muted>
          <Button asChild className='rounded-full'>
            <Link href='/login'>{t('signIn')}</Link>
          </Button>
        </Flex>
      </main>
    );
  }

  return (
    <main className='app-container py-12 pb-24'>
      <DynamicBreadcrumb
        showBackButton={false}
        items={[{ label: t('title'), href: '/household-profiles' }]}
      />
      <Flex direction='column' spacing={3} className='mt-6 mb-8 max-w-2xl'>
        <Flex direction='row' align='center' spacing={2}>
          <IconHomeHeart className='text-gold-strong size-6' />
          <Typography.H1 className='font-display text-3xl font-semibold tracking-tight lg:text-4xl'>
            {t('title')}
          </Typography.H1>
        </Flex>
        <Typography.Muted className='leading-relaxed'>{t('subtitle')}</Typography.Muted>
      </Flex>

      <Flex direction='column' spacing={8} className='max-w-2xl'>
        <Card className='border-border/70 space-y-4 rounded-2xl border p-6'>
          <Typography.H2 className='text-base font-semibold'>{t('membersTitle')}</Typography.H2>
          {members.length > 0 ? (
            <ul className='divide-border/60 divide-y rounded-xl border'>
              {members.map((member) => (
                <li key={member.id} className='flex items-start justify-between gap-3 p-3'>
                  <Flex direction='column' spacing={1} className='min-w-0'>
                    <Typography.Text className='font-medium'>{member.name}</Typography.Text>
                    {member.relationship ? (
                      <Typography.Muted className='text-xs capitalize'>
                        {member.relationship}
                      </Typography.Muted>
                    ) : null}
                  </Flex>
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    className='text-muted-foreground shrink-0'
                    aria-label={t('removeMember', { name: member.name })}
                    onClick={() => removeMember(member.id)}
                  >
                    <IconTrash className='size-4' />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <Typography.Muted className='text-sm'>{t('membersEmpty')}</Typography.Muted>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void memberForm.handleSubmit();
            }}
            className='space-y-3 border-t pt-4'
          >
            <Typography.Text className='text-sm font-medium'>{t('addMember')}</Typography.Text>
            <memberForm.AppField name='name'>
              {(field) => (
                <field.TextField
                  label={t('fields.name')}
                  placeholder={t('fields.namePlaceholder')}
                />
              )}
            </memberForm.AppField>
            <memberForm.AppField name='relationship'>
              {(field) => (
                <field.TextField
                  label={t('fields.relationship')}
                  placeholder={t('fields.relationshipPlaceholder')}
                />
              )}
            </memberForm.AppField>
            <memberForm.AppField name='sizes'>
              {(field) => (
                <field.TextField
                  label={t('fields.sizes')}
                  placeholder={t('fields.sizesPlaceholder')}
                />
              )}
            </memberForm.AppField>
            <memberForm.AppField name='preferences'>
              {(field) => (
                <field.TextField
                  label={t('fields.preferences')}
                  placeholder={t('fields.preferencesPlaceholder')}
                />
              )}
            </memberForm.AppField>
            <memberForm.AppField name='interests'>
              {(field) => (
                <field.TextField
                  label={t('fields.interests')}
                  placeholder={t('fields.interestsPlaceholder')}
                />
              )}
            </memberForm.AppField>
            <Button type='submit' variant='outline' className='rounded-full'>
              {t('addMemberAction')}
            </Button>
          </form>
        </Card>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void shopForm.handleSubmit();
          }}
          className='border-border/70 space-y-4 rounded-2xl border p-6'
        >
          <shopForm.AppField name='context'>
            {(field) => (
              <field.TextArea
                label={t('fields.context')}
                placeholder={t('fields.contextPlaceholder')}
                rows={3}
              />
            )}
          </shopForm.AppField>
          <Flex direction='row' spacing={3} className='gap-3'>
            <shopForm.AppField name='budget_min'>
              {(field) => <field.NumberField label={t('fields.budgetMin')} />}
            </shopForm.AppField>
            <shopForm.AppField name='budget_max'>
              {(field) => <field.NumberField label={t('fields.budgetMax')} />}
            </shopForm.AppField>
          </Flex>
          <Button
            type='submit'
            className='rounded-full'
            disabled={isPending || members.length === 0}
          >
            {isPending ? t('submitting') : t('submit')}
          </Button>
        </form>

        {result ? (
          <Flex direction='column' spacing={5}>
            {result.summary ? (
              <Typography.Text className='text-muted-foreground leading-relaxed'>
                {result.summary}
              </Typography.Text>
            ) : null}
            {result.members?.map((member) => (
              <Card
                key={member.member_name}
                className='border-border/70 space-y-3 rounded-2xl border p-5'
              >
                <Typography.H3 className='text-base font-semibold'>
                  {member.member_name}
                </Typography.H3>
                {member.summary ? (
                  <Typography.Muted className='text-sm leading-relaxed'>
                    {member.summary}
                  </Typography.Muted>
                ) : null}
                {member.recommendations && member.recommendations.length > 0 ? (
                  <Flex direction='column' spacing={2}>
                    {member.recommendations.map((item) => (
                      <ShoppingAssistantRecommendationCard
                        key={item.product?.id ?? item.reason}
                        item={item}
                      />
                    ))}
                  </Flex>
                ) : null}
              </Card>
            ))}
            <Typography.Muted className='text-xs'>{t('footer')}</Typography.Muted>
          </Flex>
        ) : null}
      </Flex>
    </main>
  );
}

function mapMemberForm(value: HouseholdMemberFormValues) {
  return {
    name: value.name,
    relationship: value.relationship ?? '',
    sizes: value.sizes ?? '',
    preferences: value.preferences ?? '',
    interests: value.interests ?? ''
  };
}
