'use client';

import { IconSparkles } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import type { DtoAiGenerateResponse } from '@/services/-admin-ai-generate-post.schemas';

import { useAiGenerate } from '../hooks/use-ai-generate';

interface AiGenerateButtonProps {
  label?: string;
  task: string;
  buildContext: () => Record<string, unknown>;
  onResult: (result: DtoAiGenerateResponse) => void;
  disabled?: boolean;
}

/** Sparkles button that calls POST /admin/ai/generate and passes the result upstream. */
export function AiGenerateButton({
  label = 'Generate',
  task,
  buildContext,
  onResult,
  disabled
}: AiGenerateButtonProps) {
  const { generate, isPending } = useAiGenerate();

  const handleClick = async () => {
    const result = await generate(task, buildContext());
    if (result) {
      onResult(result);
    }
  };

  return (
    <Button
      type='button'
      variant='outline'
      size='sm'
      disabled={disabled || isPending}
      onClick={() => void handleClick()}
    >
      <Flex direction='row' align='center' spacing={2}>
        <IconSparkles className='size-4' />
        <span>{isPending ? 'Generating…' : label}</span>
      </Flex>
    </Button>
  );
}
