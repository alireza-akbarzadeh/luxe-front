'use client';

import type { UIMessage } from 'ai';
import type { ComponentProps, HTMLAttributes, ReactNode } from 'react';
import { memo } from 'react';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
  from: UIMessage['role'] | 'store';
};

/** Chat message row — user right-aligned, assistant/store left-aligned. */
export const Message = ({ className, from, ...props }: MessageProps) => (
  <div
    className={cn(
      'group flex w-full max-w-[95%] flex-col gap-2',
      from === 'user' ? 'is-user ms-auto justify-end' : 'is-assistant',
      className
    )}
    {...props}
  />
);

export type MessageContentProps = HTMLAttributes<HTMLDivElement>;

export const MessageContent = ({ children, className, ...props }: MessageContentProps) => (
  <div
    className={cn(
      'flex w-fit max-w-full min-w-0 flex-col gap-1 overflow-hidden rounded-2xl px-4 py-3 text-sm',
      'group-[.is-user]:bg-gold group-[.is-user]:text-primary-foreground group-[.is-user]:rounded-br-md',
      'group-[.is-assistant]:bg-card group-[.is-assistant]:border-border group-[.is-assistant]:text-foreground group-[.is-assistant]:rounded-bl-md group-[.is-assistant]:border',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export type MessageResponseProps = HTMLAttributes<HTMLDivElement>;

/** Plain-text assistant/user reply body (no markdown streamdown). */
export const MessageResponse = memo(({ className, children, ...props }: MessageResponseProps) => (
  <div className={cn('leading-relaxed whitespace-pre-wrap', className)} {...props}>
    {children}
  </div>
));

MessageResponse.displayName = 'MessageResponse';

export type MessageActionsProps = ComponentProps<'div'>;

export const MessageActions = ({ className, children, ...props }: MessageActionsProps) => (
  <div className={cn('flex items-center gap-1', className)} {...props}>
    {children}
  </div>
);

export type MessageActionProps = ComponentProps<typeof Button> & {
  tooltip?: string;
  label?: string;
};

export const MessageAction = ({
  tooltip,
  children,
  label,
  variant = 'ghost',
  size = 'icon-sm',
  ...props
}: MessageActionProps) => {
  const button = (
    <Button size={size} type='button' variant={variant} {...props}>
      {children}
      <span className='sr-only'>{label ?? tooltip}</span>
    </Button>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export type MessageLabelProps = {
  children: ReactNode;
  className?: string;
};

/** Optional role label above assistant/store message text. */
export const MessageLabel = ({ children, className }: MessageLabelProps) => (
  <span
    className={cn(
      'text-muted-foreground mb-1 block text-[10px] font-medium tracking-wider uppercase',
      className
    )}
  >
    {children}
  </span>
);
