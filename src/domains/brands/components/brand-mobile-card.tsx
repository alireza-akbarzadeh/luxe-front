'use client';

import type { Row } from '@tanstack/react-table';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { BrandHomepageBadge } from '@/domains/brands/components/brand-homepage-badge';
import { BrandProductCountCell } from '@/domains/brands/components/brand-product-count-cell';
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
          <Flex direction='column' align='end' spacing={1} className='shrink-0'>
            <WorkflowStateBadge state={workflowState} className='text-[10px]' />
            <BrandHomepageBadge brand={brand} />
          </Flex>
        </Flex>

        <Flex direction='row' align='center' spacing={2}>
          <BrandProductCountCell brand={brand} />
          <Text variant='muted' className='text-[11px]'>
            products
          </Text>
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
