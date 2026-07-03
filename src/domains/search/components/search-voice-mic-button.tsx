'use client';

import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SearchVoiceMicButtonProps = {
  isSupported: boolean;
  isListening: boolean;
  permissionDenied: boolean;
  onToggle: () => void;
  className?: string;
};

/** Inline mic for search — accent highlight while listening. */
export function SearchVoiceMicButton({
  isSupported,
  isListening,
  permissionDenied,
  onToggle,
  className
}: SearchVoiceMicButtonProps) {
  const t = useTranslations('search.voice');

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type='button'
      variant='ghost'
      size='icon'
      className={cn('h-8 w-8 shrink-0 rounded-full', isListening && 'bg-accent/10', className)}
      aria-label={isListening ? t('stopListening') : t('startListening')}
      aria-pressed={isListening}
      onClick={onToggle}
    >
      {permissionDenied ? (
        <IconMicrophoneOff className='size-4' />
      ) : isListening ? (
        <IconMicrophone className='text-accent size-4' />
      ) : (
        <IconMicrophone className='size-4' />
      )}
    </Button>
  );
}
