'use client';

import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react';
import type { ChatStatus } from 'ai';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputController
} from '@/components/ai/prompt-input';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { VoiceWaveform } from '@/domains/shopping-assistant/components/voice-waveform';
import { useVoiceChatInput } from '@/domains/shopping-assistant/hooks/use-voice-chat-input';
import { cn } from '@/lib/utils';

export type VoiceAiChatComposerProps = {
  isPending: boolean;
  placeholder: string;
  onSubmit: (message: PromptInputMessage) => void | Promise<void>;
  autoStartVoice?: boolean;
  onAutoStartConsumed?: () => void;
  className?: string;
};

function VoiceAiChatComposerInner({
  isPending,
  placeholder,
  onSubmit,
  autoStartVoice = false,
  onAutoStartConsumed,
  className
}: VoiceAiChatComposerProps) {
  const t = useTranslations('shoppingAssistant.voice');
  const { textInput } = usePromptInputController();
  const inputStatus: ChatStatus | undefined = isPending ? 'submitted' : undefined;
  const canSubmit = textInput.value.trim().length > 0 && !isPending;

  const voice = useVoiceChatInput({
    value: textInput.value,
    onChange: textInput.setInput,
    autoStart: autoStartVoice,
    onAutoStartConsumed
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || event.repeat || isPending) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (target?.tagName === 'TEXTAREA' || target?.tagName === 'INPUT') {
        return;
      }
      event.preventDefault();
      voice.startHoldToTalk();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') {
        return;
      }
      voice.stopHoldToTalk();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isPending, voice.startHoldToTalk, voice.stopHoldToTalk]);

  return (
    <Flex direction='column' spacing={2} className={className}>
      {voice.isListening ? <FlexVoiceStatus label={t('listening')} /> : null}
      {!voice.isSupported ? (
        <Typography.Muted className='text-center text-xs'>{t('unsupported')}</Typography.Muted>
      ) : null}
      {voice.permissionDenied ? (
        <Typography.Muted className='text-destructive text-center text-xs' role='alert'>
          {t('permissionDenied')}
        </Typography.Muted>
      ) : null}

      <PromptInput className='rounded-2xl' onSubmit={onSubmit}>
        <PromptInputBody>
          <PromptInputTextarea
            className='max-h-28 min-h-12'
            disabled={isPending}
            placeholder={placeholder}
            aria-label={t('inputLabel')}
          />
        </PromptInputBody>
        <PromptInputFooter className='justify-between gap-2 ps-2 pe-2 pb-2'>
          {voice.isSupported ? (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              className={cn('size-10 rounded-xl', voice.isListening && 'bg-accent/10')}
              aria-label={voice.isListening ? t('stopListening') : t('startListening')}
              aria-pressed={voice.isListening}
              onClick={voice.toggleVoice}
              onPointerDown={(event) => {
                if (event.pointerType !== 'mouse') {
                  voice.startHoldToTalk();
                }
              }}
              onPointerUp={voice.stopHoldToTalk}
              onPointerLeave={voice.stopHoldToTalk}
              disabled={isPending}
            >
              {voice.permissionDenied ? (
                <IconMicrophoneOff className='size-4' />
              ) : (
                <IconMicrophone className={cn('size-4', voice.isListening && 'text-accent')} />
              )}
            </Button>
          ) : (
            <span />
          )}
          <PromptInputSubmit
            className='size-10 rounded-xl'
            disabled={!canSubmit}
            status={inputStatus}
          />
        </PromptInputFooter>
      </PromptInput>
      {voice.isSupported ? (
        <Typography.Muted className='text-center text-xs'>{t('keyboardHint')}</Typography.Muted>
      ) : null}
    </Flex>
  );
}

function FlexVoiceStatus({ label }: { label: string }) {
  return (
    <Flex
      direction='row'
      align='center'
      justify='center'
      spacing={2}
      className='bg-accent/5 rounded-xl px-3 py-2'
      role='status'
      aria-live='polite'
    >
      <VoiceWaveform active compact barClassName='bg-accent' />
      <Typography.Small className='text-accent font-medium'>{label}</Typography.Small>
    </Flex>
  );
}

/** AI chat composer with browser speech recognition (push + hold-to-talk). */
export function VoiceAiChatComposer(props: VoiceAiChatComposerProps) {
  return (
    <PromptInputProvider>
      <VoiceAiChatComposerInner {...props} />
    </PromptInputProvider>
  );
}
