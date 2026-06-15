'use client';

import { IconCheck } from '@tabler/icons-react';

import {
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTrigger
} from '@/components/ui/stepper';
import { cn } from '@/lib/utils';

import type { CheckoutStepId } from '../checkout.schema';
import { useCheckoutSteps } from '../hooks/useCheckoutSteps';

interface CheckoutStepperNavProps {
  onStepClick: (stepId: CheckoutStepId) => void;
}

/** Horizontal checkout progress — stays horizontal on mobile (no vertical responsive flip). */
export function CheckoutStepperNav({ onStepClick }: CheckoutStepperNavProps) {
  const { steps, currentStepId, completedSteps } = useCheckoutSteps();
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <StepperNav className='w-full flex-row gap-0'>
      {steps.map((step, index) => {
        const stepId = step.id as CheckoutStepId;
        const isCompleted = completedSteps.includes(stepId);
        const isClickable = isCompleted || index <= currentIndex;
        const isActive = stepId === currentStepId;

        return (
          <StepperItem
            key={step.id}
            stepId={step.id}
            completed={isCompleted}
            disabled={!isClickable && !isActive}
            className='min-w-0 flex-1'
          >
            <StepperTrigger
              type='button'
              onClick={() => isClickable && onStepClick(stepId)}
              className={cn(
                'w-full flex-col items-center gap-1.5 px-1 py-2 sm:flex-row sm:gap-2 sm:px-2',
                !isClickable && !isActive && 'cursor-default'
              )}
            >
              <StepperIndicator className='size-7 sm:size-8'>
                {isCompleted ? <IconCheck className='size-3.5 sm:size-4' /> : step.icon}
              </StepperIndicator>
              <div className='flex min-w-0 flex-col items-center text-center sm:items-start sm:text-left'>
                <span
                  className={cn(
                    'truncate text-[11px] leading-tight font-medium sm:text-sm',
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
                <span className='text-muted-foreground hidden truncate text-xs sm:block'>
                  {step.description}
                </span>
              </div>
            </StepperTrigger>
            {index < steps.length - 1 && <StepperSeparator className='mx-1 h-0.5 flex-1 sm:mx-2' />}
          </StepperItem>
        );
      })}
    </StepperNav>
  );
}
