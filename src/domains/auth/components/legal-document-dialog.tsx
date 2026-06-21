'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Flex } from '@/components/ui/flex';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Typography } from '@/components/ui/typography';
import { useGetSettingsKey } from '@/services/-settings-{key}-get';

import { LEGAL_SETTING_KEYS, type LegalDocumentKind,parseLegalDocument } from '../lib/legal-document';

type LegalDocumentDialogProps = {
  kind: LegalDocumentKind;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LegalDocumentDialog({ kind, open, onOpenChange }: LegalDocumentDialogProps) {
  const t = useTranslations('auth.legal');
  const settingKey = LEGAL_SETTING_KEYS[kind];

  const { data, isLoading, isError } = useGetSettingsKey(settingKey, {
    query: {
      enabled: open,
      staleTime: 60_000
    }
  });

  const document = useMemo(
    () => parseLegalDocument(data?.data?.value),
    [data?.data?.value]
  );

  const title = document?.title ?? (kind === 'terms' ? t('termsFallbackTitle') : t('privacyFallbackTitle'));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[min(85vh,720px)] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl'>
        <DialogHeader className='border-border shrink-0 border-b px-6 py-5 text-start'>
          <DialogTitle>{title}</DialogTitle>
          {document?.version ? (
            <DialogDescription>{t('updated', { version: document.version })}</DialogDescription>
          ) : null}
        </DialogHeader>

        <ScrollArea className='min-h-0 flex-1'>
          <Flex direction='column' gap={4} className='px-6 py-5'>
            {isLoading ? (
              <Typography.Muted>{t('loading')}</Typography.Muted>
            ) : isError || !document ? (
              <Typography.Muted>{t('loadError')}</Typography.Muted>
            ) : document.content ? (
              <Typography.P className='leading-relaxed whitespace-pre-wrap'>{document.content}</Typography.P>
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
      </DialogContent>
    </Dialog>
  );
}
