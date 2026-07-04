'use client';

import {
  IconCircle,
  IconGenderAndrogyne,
  IconGenderFemale,
  IconGenderMale,
  IconGenderNeutrois,
  IconGenderTransgender,
  IconPlayerPause,
  IconPlayerPlay
} from '@tabler/icons-react';
import type { ComponentProps, ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut
} from '@/components/ui/command';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { useControllableState } from '@/hooks/useControllableState';
import { cn } from '@/lib/utils';

interface VoiceSelectorContextValue {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const VoiceSelectorContext = createContext<VoiceSelectorContextValue | null>(null);

export const useVoiceSelector = () => {
  const context = useContext(VoiceSelectorContext);
  if (!context) {
    throw new Error('VoiceSelector components must be used within VoiceSelector');
  }
  return context;
};

export type VoiceSelectorProps = ComponentProps<typeof Dialog> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
};

export const VoiceSelector = ({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: VoiceSelectorProps) => {
  const [value, setValue] = useControllableState<string | undefined>({
    defaultProp: defaultValue,
    onChange: onValueChange,
    prop: valueProp
  });

  const [open, setOpen] = useControllableState({
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: openProp
  });

  const voiceSelectorContext = useMemo(
    () => ({ open, setOpen, setValue, value }),
    [value, setValue, open, setOpen]
  );

  return (
    <VoiceSelectorContext.Provider value={voiceSelectorContext}>
      <Dialog onOpenChange={setOpen} open={open} {...props}>
        {children}
      </Dialog>
    </VoiceSelectorContext.Provider>
  );
};

export type VoiceSelectorTriggerProps = ComponentProps<typeof DialogTrigger>;

export const VoiceSelectorTrigger = (props: VoiceSelectorTriggerProps) => (
  <DialogTrigger {...props} />
);

export type VoiceSelectorContentProps = ComponentProps<typeof DialogContent> & {
  title?: ReactNode;
};

export const VoiceSelectorContent = ({
  className,
  children,
  title = 'Voice Selector',
  ...props
}: VoiceSelectorContentProps) => (
  <DialogContent aria-describedby={undefined} className={cn('p-0', className)} {...props}>
    <DialogTitle className='sr-only'>{title}</DialogTitle>
    <Command className='**:data-[slot=command-input-wrapper]:h-auto'>{children}</Command>
  </DialogContent>
);

export type VoiceSelectorDialogProps = ComponentProps<typeof CommandDialog>;

export const VoiceSelectorDialog = (props: VoiceSelectorDialogProps) => (
  <CommandDialog {...props} />
);

export type VoiceSelectorInputProps = ComponentProps<typeof CommandInput>;

export const VoiceSelectorInput = ({ className, ...props }: VoiceSelectorInputProps) => (
  <CommandInput className={cn('h-auto py-3.5', className)} {...props} />
);

export type VoiceSelectorListProps = ComponentProps<typeof CommandList>;

export const VoiceSelectorList = (props: VoiceSelectorListProps) => <CommandList {...props} />;

export type VoiceSelectorEmptyProps = ComponentProps<typeof CommandEmpty>;

export const VoiceSelectorEmpty = (props: VoiceSelectorEmptyProps) => <CommandEmpty {...props} />;

export type VoiceSelectorGroupProps = ComponentProps<typeof CommandGroup>;

export const VoiceSelectorGroup = (props: VoiceSelectorGroupProps) => <CommandGroup {...props} />;

export type VoiceSelectorItemProps = ComponentProps<typeof CommandItem>;

export const VoiceSelectorItem = ({ className, ...props }: VoiceSelectorItemProps) => (
  <CommandItem className={cn('px-4 py-2', className)} {...props} />
);

export type VoiceSelectorShortcutProps = ComponentProps<typeof CommandShortcut>;

export const VoiceSelectorShortcut = (props: VoiceSelectorShortcutProps) => (
  <CommandShortcut {...props} />
);

export type VoiceSelectorSeparatorProps = ComponentProps<typeof CommandSeparator>;

export const VoiceSelectorSeparator = (props: VoiceSelectorSeparatorProps) => (
  <CommandSeparator {...props} />
);

export type VoiceSelectorGenderProps = ComponentProps<'span'> & {
  value?: 'male' | 'female' | 'transgender' | 'androgyne' | 'non-binary' | 'intersex';
};

function resolveGenderIcon(value?: VoiceSelectorGenderProps['value']): ReactNode {
  switch (value) {
    case 'male':
      return <IconGenderMale className='size-4' />;
    case 'female':
      return <IconGenderFemale className='size-4' />;
    case 'transgender':
      return <IconGenderTransgender className='size-4' />;
    case 'androgyne':
      return <IconGenderAndrogyne className='size-4' />;
    case 'non-binary':
      return <IconGenderNeutrois className='size-4' />;
    case 'intersex':
      return <IconGenderTransgender className='size-4' />;
    default:
      return <IconCircle className='size-4 fill-current' />;
  }
}

export const VoiceSelectorGender = ({
  className,
  value,
  children,
  ...props
}: VoiceSelectorGenderProps) => (
  <span className={cn('text-muted-foreground text-xs', className)} {...props}>
    {children ?? resolveGenderIcon(value)}
  </span>
);

export type VoiceSelectorAccentProps = ComponentProps<'span'> & {
  value?:
    | 'american'
    | 'british'
    | 'australian'
    | 'canadian'
    | 'irish'
    | 'scottish'
    | 'indian'
    | 'south-african'
    | 'new-zealand'
    | 'spanish'
    | 'french'
    | 'german'
    | 'italian'
    | 'portuguese'
    | 'brazilian'
    | 'mexican'
    | 'argentinian'
    | 'japanese'
    | 'chinese'
    | 'korean'
    | 'russian'
    | 'arabic'
    | 'dutch'
    | 'swedish'
    | 'norwegian'
    | 'danish'
    | 'finnish'
    | 'polish'
    | 'turkish'
    | 'greek'
    | string;
};

const ACCENT_EMOJI: Record<string, string> = {
  american: '🇺🇸',
  argentinian: '🇦🇷',
  arabic: '🇸🇦',
  australian: '🇦🇺',
  brazilian: '🇧🇷',
  british: '🇬🇧',
  canadian: '🇨🇦',
  chinese: '🇨🇳',
  danish: '🇩🇰',
  dutch: '🇳🇱',
  finnish: '🇫🇮',
  french: '🇫🇷',
  german: '🇩🇪',
  greek: '🇬🇷',
  indian: '🇮🇳',
  irish: '🇮🇪',
  italian: '🇮🇹',
  japanese: '🇯🇵',
  korean: '🇰🇷',
  mexican: '🇲🇽',
  'new-zealand': '🇳🇿',
  norwegian: '🇳🇴',
  polish: '🇵🇱',
  portuguese: '🇵🇹',
  russian: '🇷🇺',
  scottish: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'south-african': '🇿🇦',
  spanish: '🇪🇸',
  swedish: '🇸🇪',
  turkish: '🇹🇷'
};

export const VoiceSelectorAccent = ({
  className,
  value,
  children,
  ...props
}: VoiceSelectorAccentProps) => (
  <span className={cn('text-muted-foreground text-xs', className)} {...props}>
    {children ?? (value ? ACCENT_EMOJI[value] : null)}
  </span>
);

export type VoiceSelectorAgeProps = ComponentProps<'span'>;

export const VoiceSelectorAge = ({ className, ...props }: VoiceSelectorAgeProps) => (
  <span className={cn('text-muted-foreground text-xs tabular-nums', className)} {...props} />
);

export type VoiceSelectorNameProps = ComponentProps<'span'>;

export const VoiceSelectorName = ({ className, ...props }: VoiceSelectorNameProps) => (
  <span className={cn('flex-1 truncate text-left font-medium', className)} {...props} />
);

export type VoiceSelectorDescriptionProps = ComponentProps<'span'>;

export const VoiceSelectorDescription = ({
  className,
  ...props
}: VoiceSelectorDescriptionProps) => (
  <span className={cn('text-muted-foreground text-xs', className)} {...props} />
);

export type VoiceSelectorAttributesProps = ComponentProps<'div'>;

export const VoiceSelectorAttributes = ({
  className,
  children,
  ...props
}: VoiceSelectorAttributesProps) => (
  <div className={cn('flex items-center text-xs', className)} {...props}>
    {children}
  </div>
);

export type VoiceSelectorBulletProps = ComponentProps<'span'>;

export const VoiceSelectorBullet = ({ className, ...props }: VoiceSelectorBulletProps) => (
  <span aria-hidden='true' className={cn('text-border select-none', className)} {...props}>
    &bull;
  </span>
);

export type VoiceSelectorPreviewProps = Omit<ComponentProps<'button'>, 'children'> & {
  playing?: boolean;
  loading?: boolean;
  onPlay?: () => void;
};

export const VoiceSelectorPreview = ({
  className,
  playing,
  loading,
  onPlay,
  onClick,
  ...props
}: VoiceSelectorPreviewProps) => {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onClick?.(event);
      onPlay?.();
    },
    [onClick, onPlay]
  );

  let icon = <IconPlayerPlay size={12} />;

  if (loading) {
    icon = <Spinner className='size-3' />;
  } else if (playing) {
    icon = <IconPlayerPause className='size-3' />;
  }

  return (
    <Button
      aria-label={playing ? 'Pause preview' : 'Play preview'}
      className={cn('size-6', className)}
      disabled={loading}
      onClick={handleClick}
      size='icon-sm'
      type='button'
      variant='outline'
      {...props}
    >
      {icon}
    </Button>
  );
};
