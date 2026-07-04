'use client';

import type { ChatStatus } from 'ai';

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

export type AiChatComposerProps = {
  isPending: boolean;
  placeholder: string;
  onSubmit: (message: PromptInputMessage) => void | Promise<void>;
};

function AiChatComposerInner({ isPending, placeholder, onSubmit }: AiChatComposerProps) {
  const { textInput } = usePromptInputController();
  const inputStatus: ChatStatus | undefined = isPending ? 'submitted' : undefined;
  const canSubmit = textInput.value.trim().length > 0 && !isPending;

  return (
    <PromptInput className='rounded-2xl' onSubmit={onSubmit}>
      <PromptInputBody>
        <PromptInputTextarea
          className='max-h-28 min-h-12'
          disabled={isPending}
          placeholder={placeholder}
        />
      </PromptInputBody>
      <PromptInputFooter className='justify-end pe-2 pb-2'>
        <PromptInputSubmit
          className='size-10 rounded-xl'
          disabled={!canSubmit}
          status={inputStatus}
        />
      </PromptInputFooter>
    </PromptInput>
  );
}

/** Shared AI Elements prompt composer for assistant sheets. */
export function AiChatComposer(props: AiChatComposerProps) {
  return (
    <PromptInputProvider>
      <AiChatComposerInner {...props} />
    </PromptInputProvider>
  );
}
