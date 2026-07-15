'use client';

import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandX,
  IconLink,
  IconMail
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { copyToClipboard } from '@/lib/utils';

interface BlogShareBarProps {
  title: string;
  url: string;
}

/** Social share row for article pages. */
export function BlogShareBar({ title, url }: BlogShareBarProps) {
  const t = useTranslations('weblog.post');
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: IconBrandFacebook
    },
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: IconBrandX
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: IconBrandLinkedin
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
      icon: IconMail
    }
  ] as const;

  return (
    <Flex align='center' gap={2} className='flex-wrap'>
      <Typography.Muted className='text-sm'>{t('share')}</Typography.Muted>
      {links.map((item) => (
        <Button key={item.label} asChild variant='ghost' size='icon-sm' aria-label={item.label}>
          <a href={item.href} target='_blank' rel='noopener noreferrer'>
            <item.icon className='size-4' />
          </a>
        </Button>
      ))}
      <Button
        type='button'
        variant='ghost'
        size='icon-sm'
        aria-label={t('copyLink')}
        onClick={() => void copyToClipboard(url, t('linkCopiedLabel'))}
      >
        <IconLink className='size-4' />
      </Button>
    </Flex>
  );
}
