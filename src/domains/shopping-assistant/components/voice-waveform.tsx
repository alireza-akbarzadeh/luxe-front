'use client';

import { Flex } from '@/components/ui/flex';
import { cn } from '@/lib/utils';

const BAR_SCALES = [0.45, 0.75, 1, 0.65, 0.9, 0.55, 0.8] as const;
const COMPACT_BAR_SCALES = [0.5, 0.85, 1, 0.7, 0.55] as const;

const MAX_BAR_PX = 16;

type VoiceWaveformProps = {
  active?: boolean;
  /** Use fewer bars for tight spaces (e.g. mic button). */
  compact?: boolean;
  /** Bar color on light backgrounds. */
  barClassName?: string;
  className?: string;
};

/** Animated voice level bars shown while speech recognition is active. */
export function VoiceWaveform({
  active = false,
  compact = false,
  barClassName = 'bg-accent',
  className
}: VoiceWaveformProps) {
  const scales = compact ? COMPACT_BAR_SCALES : BAR_SCALES;

  return (
    <Flex
      align='end'
      justify='center'
      spacing={0.5}
      className={cn('h-4 shrink-0', className)}
      aria-hidden
    >
      {scales.map((scale, index) => (
        <span
          key={index}
          className={cn(
            'w-0.5 shrink-0 rounded-full',
            barClassName,
            active ? 'voice-wave-bar' : 'opacity-40'
          )}
          style={{
            height: `${Math.max(4, Math.round(scale * MAX_BAR_PX))}px`,
            animationDelay: active ? `${index * 90}ms` : undefined
          }}
        />
      ))}
    </Flex>
  );
}
