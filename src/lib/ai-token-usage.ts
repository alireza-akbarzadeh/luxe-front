/**
 * Lightweight stand-in for tokenlens `getUsage` — no extra dependency.
 * Token counts come from the Vercel `ai` package (`LanguageModelUsage`).
 * Cost is optional: add model ids to `MODEL_PRICING_USD_PER_M` when you wire real models.
 */

/** Fields passed from `@/components/ai/context` (matches tokenlens call shape). */
export type AiTokenUsageInput = {
  input?: number;
  output?: number;
  reasoningTokens?: number;
  cacheReads?: number;
};

export type AiTokenUsageResult = {
  costUSD?: {
    totalUSD?: number;
  };
};

/** USD per 1M tokens. Keys are provider model ids (e.g. `openai/gpt-4o-mini`). */
export const MODEL_PRICING_USD_PER_M: Record<
  string,
  { input?: number; output?: number; reasoning?: number; cacheRead?: number }
> = {
  // Extend when backend exposes model id + you want cost in the Context hover card.
  // 'openai/gpt-4o-mini': { input: 0.15, output: 0.6 },
};

function costForTokens(tokens: number, usdPerMillion: number | undefined): number {
  if (!tokens || !usdPerMillion) {
    return 0;
  }
  return (tokens / 1_000_000) * usdPerMillion;
}

/**
 * Estimates USD cost for a usage slice. Returns `{}` when model id has no pricing row
 * (Context UI still shows token counts; cost lines show $0.00).
 */
export function getUsage(params: {
  modelId: string;
  usage: AiTokenUsageInput;
}): AiTokenUsageResult {
  const pricing = MODEL_PRICING_USD_PER_M[params.modelId];
  if (!pricing) {
    return {};
  }

  const { usage } = params;
  const totalUSD =
    costForTokens(usage.input ?? 0, pricing.input) +
    costForTokens(usage.output ?? 0, pricing.output) +
    costForTokens(usage.reasoningTokens ?? 0, pricing.reasoning) +
    costForTokens(usage.cacheReads ?? 0, pricing.cacheRead);

  if (totalUSD <= 0) {
    return {};
  }

  return { costUSD: { totalUSD } };
}
