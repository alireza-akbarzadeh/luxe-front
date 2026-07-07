'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { Flex } from '@/components/ui/flex';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Typography } from '@/components/ui/typography';
import { useGetSettingsKey } from '@/services/-settings-{key}-get';
import { AppDialog } from '~/src/components/app-dialog';

import {
  LEGAL_SETTING_KEYS,
  type LegalDocumentKind,
  parseLegalDocument
} from '../lib/legal-document';

type LegalDocumentDialogProps = {
  kind: LegalDocumentKind;
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
};

export function LegalDocumentDialog({ kind, open, onOpenChangeAction }: LegalDocumentDialogProps) {
  const t = useTranslations('auth.legal');
  const settingKey = LEGAL_SETTING_KEYS[kind];

  const { data, isLoading, isError } = useGetSettingsKey(settingKey, {
    query: {
      enabled: open,
      staleTime: 60_000
    }
  });

  const document = useMemo(() => parseLegalDocument(data?.data?.value), [data?.data?.value]);

  const title =
    document?.title ?? (kind === 'terms' ? t('termsFallbackTitle') : t('privacyFallbackTitle'));

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChangeAction}
      size='lg'
      className='max-h-[min(85vh,720px)]'
      title={title}
      description={document?.version ? t('updated', { version: document.version }) : undefined}
    >
      <ScrollArea className='min-h-0 flex-1'>
        <Flex direction='column' gap={4} className='px-6 py-5'>
          {isLoading ? (
            <Typography.Muted>{t('loading')}</Typography.Muted>
          ) : isError || !document ? (
            <Typography.Muted>{t('loadError')}</Typography.Muted>
          ) : document.content ? (
            <Typography.P className='leading-relaxed whitespace-pre-wrap'>
              {document.content}
            </Typography.P>
          ) : (
            document.sections?.map((section, index) => (
              <Flex key={`${section.heading ?? 'section'}-${index}`} direction='column' gap={2}>
                {section.heading ? <Typography.H3>{section.heading}</Typography.H3> : null}
                {section.body ? (
                  <Typography.Muted className='leading-relaxed'>{section.body}</Typography.Muted>
                ) : null}
              </Flex>
            ))
          )}
        </Flex>
      </ScrollArea>
    </AppDialog>
  );
}
