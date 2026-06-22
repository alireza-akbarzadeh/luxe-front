'use client';

import { toast } from 'sonner';

import { usePostAdminAiGenerate } from '@/services/-admin-ai-generate-post';
import type { DtoAiGenerateResponse } from '@/services/-admin-ai-generate-post.schemas';

/**
 * Admin AI copilot mutation — wraps Orval `postAdminAiGenerate` with toast errors.
 */
export function useAiGenerate() {
  const mutation = usePostAdminAiGenerate();

  const generate = async (
    task: string,
    context: Record<string, unknown>
  ): Promise<DtoAiGenerateResponse | undefined> => {
    try {
      const response = await mutation.mutateAsync({ data: { task, context } });
      return response.data;
    } catch {
      toast.error('AI generation failed. Check that AI is enabled on the server.');
      return undefined;
    }
  };

  return {
    generate,
    isPending: mutation.isPending
  };
}
