'use client';

import type { Row } from '@tanstack/react-table';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { WorkflowStateBadge } from '@/domains/workflows/components/workflow-state-badge';
import { mapBrandStatusToStateView } from '@/domains/workflows/lib/workflow-runtime';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoBrandResponse } from '@/services/-brands-get.schemas';

interface BrandMobileCardProps {
  row: Row<DtoBrandResponse>;
}

export function BrandMobileCard({ row }: BrandMobileCardProps) {
  const brand = row.original;
  const workflowState = brand.workflow_state ?? mapBrandStatusToStateView(brand.status);

  return (
    <Flex direction='row' align='start' className='gap-3 p-4'>
      <Flex
        align='center'
        justify='center'
        className='bg-muted relative size-12 shrink-0 overflow-hidden rounded-md border'
      >
        <AppImage
          src={brand.logo_url ?? IMAGE_FALLBACK}
          alt={brand.name ?? 'Brand'}
          fill
          sizes='48px'
          className='object-contain p-1'
        />
      </Flex>

      <Flex direction='column' className='min-w-0 flex-1 gap-2'>
        <Flex direction='row' align='start' justify='between' className='gap-2'>
          <Flex direction='column' className='min-w-0 gap-0.5'>
            <Text variant='small' className='truncate font-semibold'>
              {brand.name ?? '—'}
            </Text>
            <Text variant='muted' className='truncate text-xs'>
              /{brand.slug ?? '—'}
            </Text>
          </Flex>
          <WorkflowStateBadge state={workflowState} className='shrink-0 text-[10px]' />
        </Flex>

        {brand.description ? (
          <Text variant='muted' className='line-clamp-2 text-xs'>
            {brand.description}
          </Text>
        ) : null}
      </Flex>
    </Flex>
  );
}
