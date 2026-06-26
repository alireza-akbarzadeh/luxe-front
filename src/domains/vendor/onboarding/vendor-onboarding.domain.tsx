'use client';

import {
  IconBuildingStore,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconClipboardCheck,
  IconTruck,
  IconUser
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { vendorRegisterAction } from '@/actions/auth.actions';
import { getFieldErrorMessage } from '@/components/forms/form';
import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DirectionalArrow } from '@/components/ui/directional-icon';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import {
  type StepDefinition,
  Stepper,
  StepperContent,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger
} from '@/components/ui/stepper';
import { Typography } from '@/components/ui/typography';
import { VendorAgreementField } from '@/domains/vendor/onboarding/components/vendor-agreement-field';
import { VendorLocationField } from '@/domains/vendor/onboarding/components/vendor-location-field';
import { mapOnboardingToStorePayload } from '@/domains/vendor/onboarding/lib/map-onboarding-to-store';
import {
  applyVendorOnboardingFieldErrors,
  findOnboardingStepForField,
  getFirstOnboardingErrorMessage,
  getVendorOnboardingFormErrors,
  getVendorOnboardingStepErrors,
  vendorOnboardingSchema,
  type VendorOnboardingStepId,
  type VendorOnboardingValues
} from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';
import {
  canOpenOnboardingStep,
  useVendorOnboardingStore
} from '@/domains/vendor/onboarding/stores/vendor-onboarding-store';
import { getDirection, type Locale } from '@/i18n/config';
import { createVendorStore } from '@/lib/api/vendor-stores';
import { useGetCategories } from '@/services/-categories-get';

interface VendorOnboardingDomainProps {
  isAuthenticated: boolean;
  userEmail?: string;
}

const STEP_ICONS: Record<VendorOnboardingStepId, React.ReactElement> = {
  account: <IconUser className='size-4' aria-hidden />,
  business: <IconBuildingStore className='size-4' aria-hidden />,
  store: <IconBuildingStore className='size-4' aria-hidden />,
  operations: <IconTruck className='size-4' aria-hidden />,
  review: <IconClipboardCheck className='size-4' aria-hidden />
};

export function VendorOnboardingDomain({
  isAuthenticated,
  userEmail
}: VendorOnboardingDomainProps) {
  const t = useTranslations('vendor.onboarding');
  const locale = useLocale() as Locale;
  const rtl = getDirection(locale) === 'rtl';
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepId = useVendorOnboardingStore((s) => s.currentStepId);
  const completedSteps = useVendorOnboardingStore((s) => s.completedSteps);
  const draft = useVendorOnboardingStore((s) => s.draft);
  const accountCreated = useVendorOnboardingStore((s) => s.accountCreated);
  const setCurrentStep = useVendorOnboardingStore((s) => s.setCurrentStep);
  const markCompleted = useVendorOnboardingStore((s) => s.markCompleted);
  const updateDraft = useVendorOnboardingStore((s) => s.updateDraft);
  const setAccountCreated = useVendorOnboardingStore((s) => s.setAccountCreated);
  const resetOnboarding = useVendorOnboardingStore((s) => s.reset);

  const { data: categoriesData } = useGetCategories({ limit: 100 });

  const categoryOptions = useMemo(() => {
    const categories = categoriesData?.data?.categories ?? [];
    return categories
      .filter((category) => category.id)
      .map((category) => ({
        value: String(category.id),
        label: category.name ?? `Category ${category.id}`
      }));
  }, [categoriesData]);

  const steps = useMemo<StepDefinition[]>(
    () =>
      (['account', 'business', 'store', 'operations', 'review'] as VendorOnboardingStepId[]).map(
        (id) => ({
          id,
          title: t(`steps.${id}.title`),
          description: t(`steps.${id}.description`),
          icon: STEP_ICONS[id]
        })
      ),
    [t]
  );

  const defaultValues = useMemo(
    () => ({
      ...draft,
      ...(isAuthenticated && userEmail ? { email: userEmail } : {})
    }),
    [draft, isAuthenticated, userEmail]
  );

  const skipAccountFields = isAuthenticated || accountCreated;

  const form = useAppForm({
    defaultValues,
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: vendorOnboardingSchema as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSubmit: vendorOnboardingSchema as any
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      try {
        const formErrors = getVendorOnboardingFormErrors(value, { skipAccountFields });

        if (Object.keys(formErrors).length > 0) {
          applyVendorOnboardingFieldErrors(form, formErrors);
          const firstField = Object.keys(formErrors)[0] as keyof VendorOnboardingValues;
          setCurrentStep(findOnboardingStepForField(firstField));
          toast.error(t('errors.validationFailed'), {
            description: getFirstOnboardingErrorMessage(formErrors)
          });
          return;
        }

        const parsed = skipAccountFields
          ? vendorOnboardingSchema.omit({ password: true, confirmPassword: true }).safeParse(value)
          : vendorOnboardingSchema.safeParse(value);

        if (!parsed.success) {
          return;
        }

        if (!skipAccountFields) {
          const registerResult = await vendorRegisterAction({
            email: value.email,
            password: value.password,
            firstName: value.firstName,
            lastName: value.lastName,
            phone: value.phone || undefined
          });

          if (registerResult.error) {
            toast.error(t('errors.registerFailed'), { description: registerResult.error });
            return;
          }

          setAccountCreated(true);
        }

        await createVendorStore(mapOnboardingToStorePayload(parsed.data as VendorOnboardingValues));
        resetOnboarding();
        toast.success(t('success.title'), { description: t('success.description') });
        router.push('/vendor/panel');
        router.refresh();
      } catch (error) {
        const message = error instanceof Error ? error.message : t('errors.submitFailed');
        toast.error(t('errors.submitFailed'), { description: message });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      setAccountCreated(true);
      if (currentStepId === 'account') {
        markCompleted('account');
        setCurrentStep('business');
      }
    }
  }, [isAuthenticated, currentStepId, markCompleted, setAccountCreated, setCurrentStep]);

  const currentIdx = steps.findIndex((s) => s.id === currentStepId);
  const isLastStep = currentStepId === 'review';

  const validateStep = useCallback(
    async (stepId: VendorOnboardingStepId) => {
      if (stepId === 'account' && skipAccountFields) {
        return true;
      }

      const values = form.state.values as VendorOnboardingValues;
      const stepErrors = getVendorOnboardingStepErrors(values, stepId, { skipAccountFields });

      applyVendorOnboardingFieldErrors(form, stepErrors);

      if (Object.keys(stepErrors).length > 0) {
        toast.error(t('errors.validationFailed'), {
          description: getFirstOnboardingErrorMessage(stepErrors)
        });
        return false;
      }

      return true;
    },
    [form, skipAccountFields, t]
  );

  const goToStep = useCallback(
    async (targetId: VendorOnboardingStepId, skipValidation = false) => {
      const targetIdx = steps.findIndex((s) => s.id === targetId);
      const movingForward = targetIdx > currentIdx;

      if (!skipValidation && movingForward) {
        const valid = await validateStep(currentStepId);
        if (!valid) return;
      }

      updateDraft(form.state.values as VendorOnboardingValues);
      markCompleted(currentStepId);
      setCurrentStep(targetId);
    },
    [
      currentIdx,
      currentStepId,
      form,
      markCompleted,
      setCurrentStep,
      steps,
      updateDraft,
      validateStep
    ]
  );

  const handleNext = useCallback(async () => {
    const next = steps[currentIdx + 1];
    if (next) await goToStep(next.id as VendorOnboardingStepId);
  }, [currentIdx, goToStep, steps]);

  const handlePrev = useCallback(async () => {
    const prev = steps[currentIdx - 1];
    if (prev) await goToStep(prev.id as VendorOnboardingStepId, true);
  }, [currentIdx, goToStep, steps]);

  const handleStepperClick = useCallback(
    async (stepId: VendorOnboardingStepId) => {
      if (
        !canOpenOnboardingStep(stepId, completedSteps, accountCreated || isAuthenticated) &&
        stepId !== currentStepId
      ) {
        return;
      }
      await goToStep(stepId, stepId !== currentStepId && completedSteps.includes(stepId));
    },
    [accountCreated, completedSteps, currentStepId, goToStep, isAuthenticated]
  );

  const businessTypeOptions = [
    { value: 'brand', label: t('fields.businessType.options.brand') },
    { value: 'company', label: t('fields.businessType.options.company') },
    { value: 'individual', label: t('fields.businessType.options.individual') }
  ];

  const fulfillmentOptions = [
    { value: 'self', label: t('fields.fulfillmentModel.options.self') },
    { value: 'platform', label: t('fields.fulfillmentModel.options.platform') },
    { value: 'hybrid', label: t('fields.fulfillmentModel.options.hybrid') }
  ];

  const countryOptions = [
    { value: 'US', label: t('fields.country.options.us') },
    { value: 'CA', label: t('fields.country.options.ca') },
    { value: 'GB', label: t('fields.country.options.gb') },
    { value: 'DE', label: t('fields.country.options.de') },
    { value: 'FR', label: t('fields.country.options.fr') },
    { value: 'IR', label: t('fields.country.options.ir') },
    { value: 'AE', label: t('fields.country.options.ae') }
  ];

  return (
    <div className='mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14'>
      <Flex direction='column' spacing={2} className='mb-8 text-center'>
        <Typography.H1 className='text-3xl font-semibold tracking-tight md:text-4xl'>
          {t('title')}
        </Typography.H1>
        <Typography.Muted className='mx-auto max-w-2xl text-base'>{t('subtitle')}</Typography.Muted>
      </Flex>

      <form.AppForm>
        <form.Root
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isLastStep) {
              await form.handleSubmit();
            } else {
              await handleNext();
            }
          }}
        >
          <Flex direction='column' spacing={8}>
            <Stepper
              steps={steps}
              value={currentStepId}
              onValueChange={(id) => void handleStepperClick(id as VendorOnboardingStepId)}
              orientation='horizontal'
              responsive
            >
              <StepperNav>
                {steps.map((step) => {
                  const stepId = step.id as VendorOnboardingStepId;
                  const isCompleted = completedSteps.includes(stepId);
                  const isClickable =
                    canOpenOnboardingStep(
                      stepId,
                      completedSteps,
                      accountCreated || isAuthenticated
                    ) || stepId === currentStepId;

                  return (
                    <StepperItem
                      key={step.id}
                      stepId={step.id}
                      completed={isCompleted}
                      disabled={!isClickable}
                    >
                      <StepperTrigger className='flex flex-col items-center gap-1 py-2 md:flex-row'>
                        <StepperIndicator>
                          {isCompleted ? <IconCheck className='size-4' /> : step.icon}
                        </StepperIndicator>
                        <div className='hidden text-center md:block md:text-start'>
                          <StepperTitle>{step.title}</StepperTitle>
                          <StepperDescription className='hidden lg:block'>
                            {step.description}
                          </StepperDescription>
                        </div>
                      </StepperTrigger>
                      <StepperSeparator />
                    </StepperItem>
                  );
                })}
              </StepperNav>

              <StepperPanel>
                <StepperContent value='account' forceMount>
                  {currentStepId === 'account' ? (
                    <OnboardingCard
                      title={t('steps.account.cardTitle')}
                      description={t('steps.account.cardDescription')}
                    >
                      {isAuthenticated ? (
                        <Typography.Muted className='text-sm'>
                          {t('steps.account.signedInAs', { email: userEmail ?? draft.email })}
                        </Typography.Muted>
                      ) : (
                        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                          <form.AppField
                            name='firstName'
                            children={(field) => (
                              <field.TextField label={t('fields.firstName.label')} required />
                            )}
                          />
                          <form.AppField
                            name='lastName'
                            children={(field) => (
                              <field.TextField label={t('fields.lastName.label')} required />
                            )}
                          />
                          <form.AppField
                            name='email'
                            children={(field) => (
                              <field.TextField
                                label={t('fields.email.label')}
                                type='email'
                                required
                                className='sm:col-span-2'
                              />
                            )}
                          />
                          <form.AppField
                            name='phone'
                            children={(field) => (
                              <field.InputPhone
                                label={t('fields.phone.label')}
                                className='sm:col-span-2'
                              />
                            )}
                          />
                          <form.AppField
                            name='password'
                            children={(field) => (
                              <field.InputPassword label={t('fields.password.label')} required />
                            )}
                          />
                          <form.AppField
                            name='confirmPassword'
                            children={(field) => (
                              <field.InputPassword
                                label={t('fields.confirmPassword.label')}
                                required
                              />
                            )}
                          />
                        </Grid>
                      )}
                    </OnboardingCard>
                  ) : null}
                </StepperContent>

                <StepperContent value='business' forceMount>
                  {currentStepId === 'business' ? (
                    <OnboardingCard
                      title={t('steps.business.cardTitle')}
                      description={t('steps.business.cardDescription')}
                    >
                      <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                        <form.AppField
                          name='businessLegalName'
                          children={(field) => (
                            <field.TextField
                              label={t('fields.businessLegalName.label')}
                              required
                              className='sm:col-span-2'
                            />
                          )}
                        />
                        <form.AppField
                          name='businessType'
                          children={(field) => (
                            <field.Select
                              label={t('fields.businessType.label')}
                              options={businessTypeOptions}
                              required
                            />
                          )}
                        />
                        <form.AppField
                          name='country'
                          children={(field) => (
                            <field.Select
                              label={t('fields.country.label')}
                              options={countryOptions}
                              required
                            />
                          )}
                        />
                        <form.AppField
                          name='website'
                          children={(field) => (
                            <field.TextField
                              label={t('fields.website.label')}
                              placeholder='https://'
                            />
                          )}
                        />
                        <form.AppField
                          name='taxId'
                          children={(field) => <field.TextField label={t('fields.taxId.label')} />}
                        />
                      </Grid>
                    </OnboardingCard>
                  ) : null}
                </StepperContent>

                <StepperContent value='store' forceMount>
                  {currentStepId === 'store' ? (
                    <OnboardingCard
                      title={t('steps.store.cardTitle')}
                      description={t('steps.store.cardDescription')}
                    >
                      <Grid cols={1} gap={4}>
                        <form.AppField
                          name='storeName'
                          children={(field) => (
                            <field.TextField label={t('fields.storeName.label')} required />
                          )}
                        />
                        <form.AppField
                          name='storeDescription'
                          children={(field) => (
                            <field.TextArea
                              label={t('fields.storeDescription.label')}
                              rows={4}
                              required
                            />
                          )}
                        />
                        <form.AppField
                          name='location'
                          children={(field) => (
                            <VendorLocationField
                              location={field.state.value ?? ''}
                              locationLat={form.state.values.locationLat}
                              locationLng={form.state.values.locationLng}
                              onChange={({ location, locationLat, locationLng }) => {
                                field.handleChange(location);
                                form.setFieldValue('locationLat', locationLat);
                                form.setFieldValue('locationLng', locationLng);
                              }}
                              error={
                                field.state.meta.isTouched && field.state.meta.errors?.[0]
                                  ? (getFieldErrorMessage(field.state.meta.errors[0]) ?? undefined)
                                  : undefined
                              }
                            />
                          )}
                        />
                        <form.AppField
                          name='categoryIds'
                          children={(field) => (
                            <field.MultiSelect
                              label={`${t('fields.categoryIds.label')} *`}
                              placeholder={t('fields.categoryIds.placeholder')}
                              props={{
                                options: categoryOptions,
                                getOptionValue: (opt) => opt.value,
                                getOptionLabel: (opt) => opt.label
                              }}
                            />
                          )}
                        />
                        <form.AppField
                          name='logoUrl'
                          children={(field) => (
                            <field.TextField
                              label={t('fields.logoUrl.label')}
                              placeholder='https://'
                              detail={t('fields.logoUrl.detail')}
                            />
                          )}
                        />
                      </Grid>
                    </OnboardingCard>
                  ) : null}
                </StepperContent>

                <StepperContent value='operations' forceMount>
                  {currentStepId === 'operations' ? (
                    <OnboardingCard
                      title={t('steps.operations.cardTitle')}
                      description={t('steps.operations.cardDescription')}
                    >
                      <Grid cols={1} gap={4}>
                        <form.AppField
                          name='fulfillmentModel'
                          children={(field) => (
                            <field.Select
                              label={t('fields.fulfillmentModel.label')}
                              options={fulfillmentOptions}
                              required
                            />
                          )}
                        />
                        <form.AppField
                          name='shippingInfo'
                          children={(field) => (
                            <field.TextArea
                              label={t('fields.shippingInfo.label')}
                              rows={3}
                              required
                            />
                          )}
                        />
                        <form.AppField
                          name='returnPolicy'
                          children={(field) => (
                            <field.TextArea
                              label={t('fields.returnPolicy.label')}
                              rows={3}
                              required
                            />
                          )}
                        />
                      </Grid>
                    </OnboardingCard>
                  ) : null}
                </StepperContent>

                <StepperContent value='review' forceMount>
                  {currentStepId === 'review' ? (
                    <OnboardingCard
                      title={t('steps.review.cardTitle')}
                      description={t('steps.review.cardDescription')}
                    >
                      <Flex direction='column' spacing={4}>
                        <ReviewRow label={t('fields.storeName.label')} value={draft.storeName} />
                        <ReviewRow
                          label={t('fields.businessLegalName.label')}
                          value={draft.businessLegalName}
                        />
                        <ReviewRow label={t('fields.country.label')} value={draft.country} />
                        <ReviewRow label={t('fields.location.label')} value={draft.location} />
                        <form.AppField
                          name='acceptVendorTerms'
                          children={() => <VendorAgreementField />}
                        />
                      </Flex>
                    </OnboardingCard>
                  ) : null}
                </StepperContent>
              </StepperPanel>
            </Stepper>

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
                onClick={() => void handlePrev()}
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
                {t('progress', { current: currentIdx + 1, total: steps.length })}
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
          </Flex>
        </form.Root>
      </form.AppForm>
    </div>
  );
}

function OnboardingCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className='border-border/50 bg-card/60 backdrop-blur-xl'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex
      justify='between'
      align='start'
      className='border-border/40 border-b pb-3 text-sm last:border-0'
    >
      <span className='text-muted-foreground'>{label}</span>
      <span className='max-w-[60%] text-end font-medium'>{value || '—'}</span>
    </Flex>
  );
}
