'use client';

import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react';
import type { ChatStatus } from 'ai';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachmentList,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputController
} from '@/components/ai/prompt-input';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useVoiceChatInput } from '@/domains/shopping-assistant/hooks/use-voice-chat-input';
import { cn } from '@/lib/utils';
import { FlexVoiceStatus } from '~/src/components/ai/flex-voice-status';
import { TooltipProvider } from '~/src/components/ui/tooltip';

export type VoiceAiChatComposerProps = {
  isPending: boolean;
  placeholder: string;
  onSubmit: (message: PromptInputMessage) => void | Promise<void>;
  autoStartVoice?: boolean;
  onAutoStartConsumed?: () => void;
  className?: string;
};

/** AI chat composer with browser speech recognition (push + hold-to-talk). */
export function VoiceAiChatComposerInner({
  isPending,
  placeholder,
  onSubmit,
  autoStartVoice = false,
  onAutoStartConsumed,
  className
}: VoiceAiChatComposerProps) {
  const t = useTranslations('shoppingAssistant.voice');

  const { textInput, attachments } = usePromptInputController();
  const inputStatus: ChatStatus | undefined = isPending ? 'submitted' : undefined;
  const hasContent = textInput.value.trim().length > 0 || attachments.files.length > 0;
  const canSubmit = hasContent && !isPending;

  const voice = useVoiceChatInput({
    value: textInput.value,
    onChange: textInput.setInput,
    autoStart: autoStartVoice,
    onAutoStartConsumed
  });

  const voiceRef = useRef(voice);

  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

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
      voiceRef.current.startHoldToTalk();
    };

    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code !== 'Space') {
        return;
      }
      voiceRef.current.stopHoldToTalk();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [isPending]);

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

      <PromptInput
        className='rounded-2xl'
        onSubmit={onSubmit}
        globalDrop
        multiple
        accept='image/*,application/pdf,text/*'
      >
        <PromptInputAttachmentList />
        <PromptInputBody>
          <PromptInputTextarea
            className='max-h-28 min-h-12'
            disabled={isPending}
            placeholder={placeholder}
            aria-label={t('inputLabel')}
          />
        </PromptInputBody>
        <PromptInputFooter className='justify-between gap-2 ps-2 pe-2 pb-2'>
          <PromptInputTools className='gap-0'>
            <PromptInputActionMenu>
              <PromptInputActionMenuTrigger tooltip={t('addMenu')} />
              <PromptInputActionMenuContent>
                <PromptInputActionAddAttachments label={t('addFiles')} />
                <PromptInputActionAddScreenshot label={t('addScreenshot')} />
              </PromptInputActionMenuContent>
            </PromptInputActionMenu>
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
          </PromptInputTools>
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

/** AI chat composer with browser speech recognition (push + hold-to-talk). */
export function VoiceAiChatComposer(props: VoiceAiChatComposerProps) {
  return (
    <PromptInputProvider>
      <TooltipProvider>
        <VoiceAiChatComposerInner {...props} />
      </TooltipProvider>
    </PromptInputProvider>
  );
}
