'use client';

import type { TablerIcon } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const STATE_COLOR_PRESETS = [
  '#6366f1',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#6b7280',
  '#0ea5e9',
  '#a855f7',
  '#14b8a6'
] as const;

export function PanelSection({
  title,
  description,
  children
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className='space-y-3'>
      <div>
        <h3 className='text-sm font-semibold tracking-tight'>{title}</h3>
        {description ? <p className='text-muted-foreground mt-0.5 text-xs'>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function KeySuggestionPills({
  keys,
  onSelect,
  activeKey
}: {
  keys: readonly string[];
  onSelect: (key: string) => void;
  activeKey?: string;
}) {
  return (
    <div className='flex flex-wrap gap-1.5'>
      {keys.map((key) => (
        <Button
          key={key}
          type='button'
          variant={activeKey === key ? 'default' : 'outline'}
          size='sm'
          className='h-7 rounded-full px-2.5 font-mono text-[10px]'
          onClick={() => onSelect(key)}
        >
          {key}
        </Button>
      ))}
    </div>
  );
}

export function StatePreviewCard({
  name,
  code,
  color,
  textColor,
  isInitial,
  isFinal
}: {
  name: string;
  code: string;
  color: string;
  textColor: string;
  isInitial?: boolean;
  isFinal?: boolean;
}) {
  return (
    <div
      className='overflow-hidden rounded-xl border-2 border-black/5 shadow-sm'
      style={{ backgroundColor: color, color: textColor }}
    >
      <div className='h-1 bg-black/15' />
      <div className='px-4 py-3'>
        <p className='truncate text-sm font-semibold'>{name || 'State name'}</p>
        <p className='truncate font-mono text-[11px] opacity-80'>{code || 'state_code'}</p>
        {(isInitial || isFinal) && (
          <div className='mt-2 flex gap-1'>
            {isInitial ? (
              <Badge className='h-5 border-0 bg-black/20 px-1.5 text-[9px] text-inherit hover:bg-black/20'>
                Initial
              </Badge>
            ) : null}
            {isFinal ? (
              <Badge className='h-5 border-0 bg-black/20 px-1.5 text-[9px] text-inherit hover:bg-black/20'>
                Final
              </Badge>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

export function TransitionFlowBanner({
  fromLabel,
  toLabel,
  fromColor,
  toColor
}: {
  fromLabel: string;
  toLabel: string;
  fromColor?: string;
  toColor?: string;
}) {
  return (
    <div className='bg-muted/40 flex items-center gap-2 rounded-xl border px-3 py-2.5'>
      <StateFlowChip label={fromLabel} color={fromColor ?? '#64748b'} />
      <span className='text-muted-foreground shrink-0 text-xs'>→</span>
      <StateFlowChip label={toLabel} color={toColor ?? '#6366f1'} />
    </div>
  );
}

function StateFlowChip({ label, color }: { label: string; color: string }) {
  return (
    <div className='bg-card flex min-w-0 flex-1 items-center gap-2 rounded-lg border px-2 py-1.5'>
      <span className='size-2.5 shrink-0 rounded-full' style={{ backgroundColor: color }} />
      <span className='truncate font-mono text-xs'>{label}</span>
    </div>
  );
}

export function ColorSwatchPicker({
  value,
  onChange
}: {
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div className='flex flex-wrap gap-2'>
      {STATE_COLOR_PRESETS.map((preset) => (
        <button
          key={preset}
          type='button'
          aria-label={`Use color ${preset}`}
          className={cn(
            'size-7 rounded-lg border-2 transition-transform hover:scale-105',
            value.toLowerCase() === preset.toLowerCase()
              ? 'border-foreground ring-foreground/20 ring-2'
              : 'border-transparent'
          )}
          style={{ backgroundColor: preset }}
          onClick={() => onChange(preset)}
        />
      ))}
    </div>
  );
}

export function WorkflowEditorStat({
  icon: Icon,
  label,
  value
}: {
  icon: TablerIcon;
  label: string;
  value: number | string;
}) {
  return (
    <div className='bg-background/80 flex items-center gap-2.5 rounded-lg border px-3 py-2 shadow-sm'>
      <div className='bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md'>
        <Icon size={16} strokeWidth={2} />
      </div>
      <div>
        <p className='text-muted-foreground text-[10px] font-semibold tracking-wider uppercase'>
          {label}
        </p>
        <p className='text-sm font-semibold tabular-nums'>{value}</p>
      </div>
    </div>
  );
}

export function PanelFooter({ children }: { children: ReactNode }) {
  return (
    <div className='bg-background shrink-0 border-t px-6 py-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>{children}</div>
    </div>
  );
}
