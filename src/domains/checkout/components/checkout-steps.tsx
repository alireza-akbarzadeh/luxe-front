'use client';
import { IconCheck } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { stepNames, steps, type CheckoutSteps } from '../hooks/useCheckoutSteps';

interface CheckoutStepsProps {
  currentStep: CheckoutSteps;
}

export function CheckoutSteps({ currentStep }: CheckoutStepsProps) {
  const currentIndex = stepNames.indexOf(currentStep);

  return (
    <div className='mb-12'>
      <div className='flex items-center justify-center'>
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentIndex > index;
          return (
            <div key={step.id} className='flex items-center'>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 ${isActive
                  ? 'bg-accent text-accent-foreground'
                  : isCompleted
                    ? 'bg-green-500/10 text-green-600'
                    : 'bg-muted text-muted-foreground'
                  }`}
              >
                {isCompleted ? (
                  <IconCheck className='h-4 w-4' />
                ) : (
                  <step.icon className='h-4 w-4' />
                )}
                <span className='hidden text-sm font-medium sm:block'>{step.name}</span>
              </motion.div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-12 sm:w-24 ${isCompleted ? 'bg-green-500' : 'bg-border'
                    }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
