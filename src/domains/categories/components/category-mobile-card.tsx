'use client';

import type { Row } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { WorkflowStateBadge } from '@/domains/workflows/components/workflow-state-badge';
import { mapCategoryActiveToStateView } from '@/domains/workflows/lib/workflow-runtime';
import type { ModelsCategory } from '@/services/-categories-get.schemas';

interface CategoryMobileCardProps {
  row: Row<ModelsCategory>;
}

export function CategoryMobileCard({ row }: CategoryMobileCardProps) {
  const category = row.original;
  const depth = row.depth;
  const childrenCount = category.children?.length ?? 0;
  const workflowState = category.workflow_state ?? mapCategoryActiveToStateView(category.is_active);

  return (
    <Flex
      direction='column'
      className='gap-2 p-4'
      style={{ paddingInlineStart: `${16 + depth * 16}px` }}
    >
      <Flex direction='row' align='start' justify='between' className='gap-2'>
        <Flex direction='column' className='min-w-0 flex-1 gap-0.5'>
          <Text variant='small' className='truncate font-semibold'>
            {category.icon ? `${category.icon.replace(/^Icon/, '')} · ` : ''}
            {category.name ?? '—'}
          </Text>
          <Text variant='muted' className='truncate text-xs'>
            /{category.slug ?? '—'}
          </Text>
        </Flex>
        <WorkflowStateBadge state={workflowState} className='shrink-0 text-[10px]' />
      </Flex>

      <Flex direction='row' align='center' wrap='wrap' className='gap-2'>
        <Badge variant='outline' className='font-mono text-[10px]'>
          L{category.level ?? 0}
        </Badge>
        {childrenCount > 0 ? (
          <Badge variant='secondary' className='text-[10px]'>
            {childrenCount} sub
          </Badge>
        ) : null}
        {category.parent?.name ? (
          <Text variant='muted' className='text-[11px]'>
            Under {category.parent.name}
          </Text>
        ) : depth === 0 ? (
          <Text variant='muted' className='text-[11px]'>
            Top level
          </Text>
        ) : null}
      </Flex>

      {category.description ? (
        <Text variant='muted' className='line-clamp-2 text-xs'>
          {category.description}
        </Text>
      ) : null}
    </Flex>
  );
}
