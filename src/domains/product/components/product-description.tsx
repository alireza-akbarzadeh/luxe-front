'use client';

import { IconCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface ProductDescriptionProps {
  description: string;
  tags?: string[];
}

export default function ProductDescription({ description, tags = [] }: ProductDescriptionProps) {
  const t = useTranslations('pdp.description');
  const trimmedDescription = description.trim();

  return (
    <div className='space-y-6'>
      {trimmedDescription ? (
        <div className='text-muted-foreground space-y-4 text-sm leading-relaxed whitespace-pre-line'>
          {trimmedDescription}
        </div>
      ) : (
        <p className='text-muted-foreground text-sm'>{t('empty')}</p>
      )}

      {tags.length > 0 && (
        <div>
          <h3 className='font-display text-foreground text-xl'>{t('highlights')}</h3>
          <ul className='mt-4 space-y-2'>
            {tags.map((tag) => (
              <li key={tag} className='flex gap-2 text-sm'>
                <IconCheck className='text-accent mt-0.5 h-4 w-4 shrink-0' />
                <span>{tag}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
