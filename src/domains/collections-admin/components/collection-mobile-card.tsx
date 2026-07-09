'use client';

import type { Row } from '@tanstack/react-table';

import { AppImage } from '@/components/ui/app-image';
import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import {
  formatScheduleStatusLabel,
  getCollectionScheduleStatus
} from '@/domains/collections-admin/lib/collection-schedule';
import { WorkflowStateBadge } from '@/domains/workflows/components/workflow-state-badge';
import { mapBrandStatusToStateView } from '@/domains/workflows/lib/workflow-runtime';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoCollectionResponse } from '@/services/-collections-get.schemas';

interface CollectionMobileCardProps {
  row: Row<DtoCollectionResponse>;
}

export function CollectionMobileCard({ row }: CollectionMobileCardProps) {
  const collection = row.original;
  const workflowState = collection.workflow_state ?? mapBrandStatusToStateView(collection.status);
  const scheduleStatus = getCollectionScheduleStatus(collection.starts_at, collection.ends_at);

  return (
    <Flex direction='row' align='start' className='gap-3 p-4'>
      <Flex
        align='center'
        justify='center'
        className='bg-muted relative size-12 shrink-0 overflow-hidden rounded-md border'
      >
        <AppImage
          src={collection.image_url ?? IMAGE_FALLBACK}
          alt={collection.title ?? 'Collection'}
          fill
          sizes='48px'
          className='object-cover'
        />
      </Flex>

      <Flex direction='column' className='min-w-0 flex-1 gap-2'>
        <Flex direction='row' align='start' justify='between' className='gap-2'>
          <Flex direction='column' className='min-w-0 gap-0.5'>
            <Text variant='small' className='truncate font-semibold'>
              {collection.title ?? '—'}
            </Text>
            <Text variant='muted' className='truncate text-xs'>
              {collection.eyebrow ?? '—'} · /{collection.slug ?? '—'}
            </Text>
          </Flex>
          <WorkflowStateBadge state={workflowState} className='shrink-0 text-[10px]' />
        </Flex>

        <Flex direction='row' align='center' wrap='wrap' className='gap-2'>
          <Badge variant='outline' className='text-[10px] capitalize'>
            {collection.collection_type ?? 'smart'}
          </Badge>
          <Badge variant='secondary' className='text-[10px]'>
            {formatScheduleStatusLabel(scheduleStatus)}
          </Badge>
          {collection.theme ? (
            <Badge variant='outline' className='text-[10px] capitalize'>
              {collection.theme}
            </Badge>
          ) : null}
          {collection.sort_order != null ? (
            <Text variant='muted' className='text-[11px]'>
              Order {collection.sort_order}
            </Text>
          ) : null}
        </Flex>

        {collection.description ? (
          <Text variant='muted' className='line-clamp-2 text-xs'>
            {collection.description}
          </Text>
        ) : null}
      </Flex>
    </Flex>
  );
}
