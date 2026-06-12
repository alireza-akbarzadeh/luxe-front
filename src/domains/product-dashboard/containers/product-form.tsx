'use client';

import {
  IconBox,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconInfoCircle,
  IconPhoto,
  IconRocket,
  IconTag
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
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
import { LeaveGuard } from '@/domains/product-dashboard/components/product-leave-guard';
import { buildFormData } from '@/domains/product-dashboard/product.utils';
import { BasicInfoStep } from '@/domains/product-dashboard/sections/basic-info';
import { InventoryStep } from '@/domains/product-dashboard/sections/inventory';
import { MediaStep } from '@/domains/product-dashboard/sections/media';
import { PublishingStep } from '@/domains/product-dashboard/sections/publishing';
import { VariantsPricingStep } from '@/domains/product-dashboard/sections/variants-pricing';
import {
  productDefaultValues,
  type ProductFormValues,
  productSchema,
  stepFields,
  type StepId
} from '~/src/domains/product-dashboard/product-schema';

const STEPS = [
  {
    id: 'basic-info' as StepId,
    title: 'Basic info',
    description: 'Name, category & description',
    icon: <IconInfoCircle />
  },
  {
    id: 'variants-pricing' as StepId,
    title: 'Pricing',
    description: 'Prices & attributes',
    icon: <IconTag />
  },
  {
    id: 'inventory' as StepId,
    title: 'Inventory',
    description: 'Stock & identifiers',
    icon: <IconBox />
  },
  {
    id: 'media' as StepId,
    title: 'Media',
    description: 'Images & assets',
    icon: <IconPhoto />
  },
  {
    id: 'publishing' as StepId,
    title: 'Publishing',
    description: 'Status & SEO',
    icon: <IconRocket />
  }
] as StepDefinition[];

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  isEditMode?: boolean;
}

export function ProductForm({ initialValues, isEditMode = false }: ProductFormProps) {
  const router = useRouter();
  const [currentStepId, setCurrentStepId] = useState<StepId>('basic-info');
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentIdx = STEPS.findIndex((s) => s.id === currentStepId);
  const isLastStep = currentIdx === STEPS.length - 1;

  const form = useAppForm({
    defaultValues: { ...productDefaultValues, ...initialValues } as ProductFormValues,
    // @ts-expect-error issuw with multi step form
    validators: { onChange: productSchema, onSubmit: productSchema },
    onSubmit: async ({ value }) => {
      const valid = await validateStep(form, currentStepId);
      if (!valid) return;

      setIsSubmitting(true);
      try {
        const formData = buildFormData(value);

        await new Promise((r) => setTimeout(r, 1200));
        console.log('FormData entries:', [...formData.entries()]);

        toast.success('Product created', {
          description: `"${value.name}" has been saved successfully.`
        });

        router.push('/dashboard/products');
      } catch {
        toast.error('Something went wrong', {
          description: 'Failed to create the product. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const validateStep = useCallback(async (formApi: typeof form, stepId: StepId) => {
    const fields = stepFields[stepId];

    await Promise.all(
      fields.map((fieldName) =>
        formApi.validateField(fieldName as keyof ProductFormValues, 'submit')
      )
    );

    const meta = formApi.state.fieldMeta;
    return fields.every((f) => !meta[f as keyof typeof meta]?.errors?.length);
  }, []);

  const markCompleted = useCallback((stepId: StepId) => {
    setCompletedSteps((prev) => new Set(prev).add(stepId));
  }, []);

  const goToStep = useCallback(
    async (targetId: StepId, skipValidation = false) => {
      const targetIdx = STEPS.findIndex((s) => s.id === targetId);
      const movingForward = targetIdx > currentIdx;

      if (!isEditMode && !skipValidation && movingForward) {
        const valid = await validateStep(form, currentStepId);
        if (!valid) return;
      }

      markCompleted(currentStepId);
      setCurrentStepId(targetId);
    },
    [currentIdx, isEditMode, markCompleted, currentStepId, validateStep, form]
  );

  const handleNext = useCallback(async () => {
    const next = STEPS[currentIdx + 1];
    if (next) await goToStep(next.id as StepId);
  }, [currentIdx, goToStep]);

  const handlePrev = useCallback(async () => {
    const prev = STEPS[currentIdx - 1];
    if (prev) await goToStep(prev.id as StepId, true);
  }, [currentIdx, goToStep]);

  const handleStepperClick = useCallback(
    async (stepId: StepId) => {
      if (isEditMode) {
        setCurrentStepId(stepId);
        return;
      }
      // In create mode only allow clicking already-completed steps
      if (completedSteps.has(stepId)) {
        await goToStep(stepId, true);
      }
    },
    [isEditMode, completedSteps, goToStep]
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <LeaveGuard isDirty={form.state.isDirty && !isSubmitting} />
      <form.AppForm>
        <form.Root
          onSubmit={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await form.handleSubmit();
          }}
          className='space-y-6'
        >
          <Flex direction='column' spacing={6}>
            {/* ── Stepper nav ───────────────────────────────────────── */}
            <Stepper
              steps={STEPS}
              value={currentStepId}
              onValueChange={(id) => handleStepperClick(id as StepId)}
              orientation='horizontal'
              responsive
            >
              <StepperNav>
                {STEPS.map((step) => {
                  const isCompleted = completedSteps.has(step.id);
                  const isClickable = isEditMode || isCompleted;

                  return (
                    <StepperItem
                      key={step.id}
                      stepId={step.id}
                      completed={isCompleted}
                      disabled={!isClickable && step.id !== currentStepId}
                    >
                      <StepperTrigger className='flex flex-col items-center gap-1 py-2 md:flex-row'>
                        <StepperIndicator>
                          {isCompleted ? <IconCheck className='size-4' /> : step.icon}
                        </StepperIndicator>
                        <Flex direction='column' spacing={0} className='hidden md:flex'>
                          <StepperTitle>{step.title}</StepperTitle>
                          <StepperDescription>{step.description}</StepperDescription>
                        </Flex>
                      </StepperTrigger>
                      {step.id !== 'publishing' && <StepperSeparator />}
                    </StepperItem>
                  );
                })}
              </StepperNav>

              {/* ── Step panels ─────────────────────────────────────── */}
              <StepperPanel className='mt-8'>
                <div className='bg-card rounded-xl border p-6 shadow-sm'>
                  <Flex direction='column' spacing={1} className='mb-6'>
                    <h2 className='text-base font-semibold'>{STEPS[currentIdx]?.title}</h2>
                    <p className='text-muted-foreground text-sm'>
                      {STEPS[currentIdx]?.description}
                    </p>
                  </Flex>

                  <StepperContent value='basic-info' forceMount>
                    {currentStepId === 'basic-info' && <BasicInfoStep form={form} />}
                  </StepperContent>
                  <StepperContent value='variants-pricing' forceMount>
                    {currentStepId === 'variants-pricing' && <VariantsPricingStep form={form} />}
                  </StepperContent>
                  <StepperContent value='inventory' forceMount>
                    {currentStepId === 'inventory' && <InventoryStep form={form} />}
                  </StepperContent>
                  <StepperContent value='media' forceMount>
                    {currentStepId === 'media' && <MediaStep form={form} />}
                  </StepperContent>
                  <StepperContent value='publishing' forceMount>
                    {currentStepId === 'publishing' && <PublishingStep form={form} />}
                  </StepperContent>
                </div>
              </StepperPanel>
            </Stepper>

            {/* ── Footer navigation ─────────────────────────────────── */}
            <Flex direction='row' align='center' justify='between' className='pt-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handlePrev}
                disabled={currentIdx === 0}
              >
                <IconChevronLeft className='size-4' />
                Back
              </Button>

              <Flex direction='row' align='center' spacing={2}>
                <span className='text-muted-foreground text-xs'>
                  Step {currentIdx + 1} of {STEPS.length}
                </span>

                {isLastStep ? (
                  <Button type='submit' disabled={isSubmitting} className='min-w-32'>
                    {isSubmitting ? (
                      'Publishing…'
                    ) : (
                      <>
                        <IconRocket className='size-4' />
                        Publish product
                      </>
                    )}
                  </Button>
                ) : (
                  <Button type='button' onClick={handleNext}>
                    Continue
                    <IconChevronRight className='size-4' />
                  </Button>
                )}
              </Flex>
            </Flex>
          </Flex>
        </form.Root>
      </form.AppForm>
    </>
  );
}
