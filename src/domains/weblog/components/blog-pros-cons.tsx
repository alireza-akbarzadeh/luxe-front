import { IconCheck, IconX } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { ProsConsBlock } from '@/domains/weblog/lib/content-blocks';
import { cn } from '@/lib/utils';

interface BlogProsConsProps {
  block: ProsConsBlock;
  className?: string;
}

/** Pros and cons sidebar card. */
export async function BlogProsCons({ block, className }: BlogProsConsProps) {
  const t = await getTranslations('weblog.post');

  return (
    <aside className={cn('bg-card rounded-2xl border p-5 shadow-sm', className)}>
      <Typography.H3 className='font-display mb-4 text-lg'>{t('prosConsTitle')}</Typography.H3>
      <Flex direction='column' gap={4}>
        {block.pros.length > 0 ? (
          <div>
            <Typography.S className='mb-2 text-xs font-semibold tracking-wide text-emerald-600 uppercase dark:text-emerald-400'>
              {t('pros')}
            </Typography.S>
            <ul className='flex flex-col gap-2'>
              {block.pros.map((item) => (
                <li key={item} className='flex items-start gap-2 text-sm'>
                  <IconCheck className='mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {block.cons.length > 0 ? (
          <div>
            <Typography.S className='mb-2 text-xs font-semibold tracking-wide text-red-600 uppercase dark:text-red-400'>
              {t('cons')}
            </Typography.S>
            <ul className='flex flex-col gap-2'>
              {block.cons.map((item) => (
                <li key={item} className='flex items-start gap-2 text-sm'>
                  <IconX className='mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Flex>
    </aside>
  );
}
