'use client';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

interface VisualizationResultListProps {
  title: string;
  items?: string[];
}

/** Bulleted list for AI visualization guidance sections. */
export function VisualizationResultList({ title, items }: VisualizationResultListProps) {
  if (!items?.length) {
    return null;
  }

  return (
    <Flex direction='column' spacing={2}>
      <Typography.Text className='font-medium'>{title}</Typography.Text>
      <ul className='text-muted-foreground space-y-2 ps-1 text-sm leading-relaxed'>
        {items.map((item) => (
          <li key={item} className='flex gap-2'>
            <span className='text-muted-foreground/60 mt-2 size-1 shrink-0 rounded-full bg-current' />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </Flex>
  );
}
