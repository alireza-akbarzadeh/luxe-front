'use client';

import { useEffect, useState } from 'react';

/** Stagger delays (ms) so PDP insight APIs do not fire in one burst. */
const STAGE_DELAYS_MS = [0, 400, 800, 1000, 1200, 1600, 2000, 2400, 2800] as const;

export type PdpInsightStage =
  | 'idle'
  | 'trust'
  | 'durability'
  | 'sustainability'
  | 'priceChart'
  | 'market'
  | 'returnRisk'
  | 'purchaseAdvisor'
  | 'pricePrediction';

const STAGE_ORDER: PdpInsightStage[] = [
  'idle',
  'trust',
  'durability',
  'sustainability',
  'priceChart',
  'market',
  'returnRisk',
  'purchaseAdvisor',
  'pricePrediction'
];

/**
 * Advances insight fetch stages sequentially after the insights block is visible.
 */
export function usePdpInsightStages(sectionVisible: boolean) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!sectionVisible) {
      return;
    }

    const timers = STAGE_DELAYS_MS.map((delay, index) =>
      window.setTimeout(() => setStageIndex(index + 1), delay)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [sectionVisible]);

  const currentStage = STAGE_ORDER[stageIndex] ?? 'pricePrediction';

  const isStageReached = (stage: PdpInsightStage) => STAGE_ORDER.indexOf(stage) <= stageIndex;

  return { currentStage, isStageReached };
}
