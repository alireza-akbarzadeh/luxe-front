'use client';
import { Text } from '@/components/ui/typography';
import { AppDialog } from '~/src/components/app-dialog';

interface IosInstallGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  steps: string[];
}

export function IosInstallGuide({
  open,
  onOpenChange,
  title,
  description,
  steps
}: IosInstallGuideProps) {
  return (
    <AppDialog title={title} description={description} open={open} onOpenChange={onOpenChange}>
      <ol className='list-decimal space-y-2 ps-5'>
        {steps.map((step) => (
          <li key={step}>
            <Text variant='muted'>{step}</Text>
          </li>
        ))}
      </ol>
    </AppDialog>
  );
}
