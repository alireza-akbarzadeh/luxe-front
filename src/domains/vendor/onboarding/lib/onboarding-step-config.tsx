import { IconBuildingStore, IconClipboardCheck, IconTruck, IconUser } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import type { StepDefinition } from '@/components/ui/stepper';
import type { VendorOnboardingStepId } from '@/domains/vendor/onboarding/schemas/vendor-onboarding.schema';

const STEP_ICONS: Record<VendorOnboardingStepId, React.ReactElement> = {
  account: <IconUser className='size-4' aria-hidden />,
  business: <IconBuildingStore className='size-4' aria-hidden />,
  store: <IconBuildingStore className='size-4' aria-hidden />,
  operations: <IconTruck className='size-4' aria-hidden />,
  review: <IconClipboardCheck className='size-4' aria-hidden />
};

const STEP_ORDER: VendorOnboardingStepId[] = [
  'account',
  'business',
  'store',
  'operations',
  'review'
];

export function useOnboardingSteps() {
  const t = useTranslations('vendor.onboarding');

  const steps = useMemo<StepDefinition[]>(
    () =>
      STEP_ORDER.map((id) => ({
        id,
        title: t(`steps.${id}.title`),
        description: t(`steps.${id}.description`),
        icon: STEP_ICONS[id]
      })),
    [t]
  );

  return { steps, stepOrder: STEP_ORDER };
}
