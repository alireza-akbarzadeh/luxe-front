'use client';

import { IconCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { Select as SelectPrimitive } from 'radix-ui';
import * as React from 'react';
import { Children, isValidElement, type ReactElement, type ReactNode, use } from 'react';

import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useControllableState } from '@/hooks/useControllableState';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';

type SelectItemRegistration = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

type ParsedMobileSelect = {
  trigger: ReactNode;
  items: SelectItemRegistration[];
  placeholder?: ReactNode;
  groupLabel?: string;
};

type MobileSelectContextValue = {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled?: boolean;
  items: SelectItemRegistration[];
  placeholder?: ReactNode;
  groupLabel?: string;
};

const MobileSelectContext = React.createContext<MobileSelectContextValue | null>(null);

function useMobileSelectContext() {
  return use(MobileSelectContext);
}

const triggerClassName =
  "border-input [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-xl border bg-background px-3.5 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-11 data-[size=sm]:h-9 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

function isComponentType(type: unknown, target: { displayName?: string; name?: string }): boolean {
  if (type === target) return true;
  if (typeof type !== 'function' && typeof type !== 'object') return false;
  const typed = type as { displayName?: string; name?: string };
  return typed.displayName === target.displayName || typed.name === target.name;
}

function walkSelectTree(node: ReactNode, parsed: ParsedMobileSelect) {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) return;

    const element = child as ReactElement<{
      children?: ReactNode;
      value?: string;
      disabled?: boolean;
      placeholder?: ReactNode;
    }>;

    if (isComponentType(element.type, SelectTrigger)) {
      parsed.trigger = element;
      return;
    }

    if (isComponentType(element.type, SelectValue)) {
      parsed.placeholder = element.props.placeholder;
      return;
    }

    if (isComponentType(element.type, SelectLabel)) {
      const label = element.props.children;
      if (typeof label === 'string') parsed.groupLabel = label;
      return;
    }

    if (isComponentType(element.type, SelectItem)) {
      const { value, disabled, children: label } = element.props;
      if (value && !parsed.items.some((item) => item.value === value)) {
        parsed.items.push({ value, label, disabled });
      }
      return;
    }

    if (element.props.children) {
      walkSelectTree(element.props.children, parsed);
    }
  });
}

function parseMobileSelectChildren(children: ReactNode): ParsedMobileSelect {
  const parsed: ParsedMobileSelect = {
    trigger: null,
    items: [],
    placeholder: undefined,
    groupLabel: undefined
  };

  walkSelectTree(children, parsed);
  return parsed;
}

function MobileSelectRoot({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  disabled,
  name,
  children
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const parsed = parseMobileSelectChildren(children);

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange
  });
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange
  });

  const context: MobileSelectContextValue = {
    value,
    onValueChange: setValue,
    open,
    setOpen,
    disabled,
    items: parsed.items,
    placeholder: parsed.placeholder,
    groupLabel: parsed.groupLabel
  };

  return (
    <MobileSelectContext value={context}>
      {name ? <input type='hidden' name={name} value={value ?? ''} /> : null}
      {parsed.trigger}
    </MobileSelectContext>
  );
}

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  const isMobile = useMediaQuery('(max-width: 1023px)');

  if (isMobile) {
    return <MobileSelectRoot {...props} />;
  }

  return (
    <MobileSelectContext value={null}>
      <SelectPrimitive.Root data-slot='select' {...props} />
    </MobileSelectContext>
  );
}

function SelectGroup({ ...props }: React.ComponentProps<typeof SelectPrimitive.Group>) {
  const mobile = useMobileSelectContext();
  if (mobile) return null;
  return <SelectPrimitive.Group data-slot='select-group' {...props} />;
}

function SelectValue({
  placeholder,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  const mobile = useMobileSelectContext();
  if (mobile) return null;

  return <SelectPrimitive.Value data-slot='select-value' placeholder={placeholder} {...props} />;
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default';
}) {
  const mobile = useMobileSelectContext();

  if (mobile) {
    const selected = mobile.items.find((item) => item.value === mobile.value);
    const hasValue = Boolean(selected);
    const display = selected?.label ?? mobile.placeholder ?? 'Choose an option';

    return (
      <Drawer open={mobile.open} onOpenChange={mobile.setOpen}>
        <DrawerTrigger asChild>
          <button
            type='button'
            data-slot='select-trigger'
            data-size={size}
            disabled={mobile.disabled || props.disabled}
            className={cn(triggerClassName, className)}
          >
            <span
              className={cn(
                'line-clamp-1 min-w-0 flex-1 text-start',
                hasValue ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}
            >
              {display}
            </span>
            <IconChevronDown className='size-4 shrink-0 opacity-50' />
          </button>
        </DrawerTrigger>
        <DrawerContent variant='ios' radius='full' showHandle className='max-h-[min(72dvh,560px)]'>
          <DrawerTitle className='px-4 pt-1 text-center text-base font-semibold'>
            {mobile.groupLabel ?? 'Select an option'}
          </DrawerTitle>
          <div className='mt-2 max-h-[min(56dvh,480px)] overflow-y-auto px-2 pb-[max(1rem,env(safe-area-inset-bottom))]'>
            {mobile.items.map((item, index) => {
              const isSelected = mobile.value === item.value;
              return (
                <button
                  key={`${item.value}-${index}`}
                  type='button'
                  disabled={item.disabled}
                  onClick={() => {
                    mobile.onValueChange?.(item.value);
                    mobile.setOpen(false);
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-start text-sm transition-colors',
                    isSelected ? 'bg-accent/10 text-foreground font-medium' : 'hover:bg-muted/60',
                    item.disabled && 'pointer-events-none opacity-50'
                  )}
                >
                  <IconCheck
                    className={cn('size-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')}
                  />
                  <span className='min-w-0 flex-1'>{item.label}</span>
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <SelectPrimitive.Trigger
      data-slot='select-trigger'
      data-size={size}
      className={cn(
        "border-input data-placeholder:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <IconChevronDown className='size-4 opacity-50' />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const mobile = useMobileSelectContext();
  if (mobile) return null;

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot='select-content'
        className={cn(
          'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative z-[110] max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'p-1',
            position === 'popper' &&
              'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  const mobile = useMobileSelectContext();
  if (mobile) return null;

  return (
    <SelectPrimitive.Label
      data-slot='select-label'
      className={cn('text-muted-foreground px-2 py-1.5 text-xs', className)}
      {...props}
    >
      {children}
    </SelectPrimitive.Label>
  );
}

function SelectItem({
  className,
  children,
  value,
  disabled,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  const mobile = useMobileSelectContext();
  if (mobile) return null;

  return (
    <SelectPrimitive.Item
      data-slot='select-item'
      value={value}
      disabled={disabled}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className='absolute right-2 flex size-3.5 items-center justify-center'>
        <SelectPrimitive.ItemIndicator>
          <IconCheck className='size-4' />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  const mobile = useMobileSelectContext();
  if (mobile) return null;

  return (
    <SelectPrimitive.Separator
      data-slot='select-separator'
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot='select-scroll-up-button'
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <IconChevronUp className='size-4' />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot='select-scroll-down-button'
      className={cn('flex cursor-default items-center justify-center py-1', className)}
      {...props}
    >
      <IconChevronDown className='size-4' />
    </SelectPrimitive.ScrollDownButton>
  );
}

SelectTrigger.displayName = 'SelectTrigger';
SelectContent.displayName = 'SelectContent';
SelectValue.displayName = 'SelectValue';
SelectLabel.displayName = 'SelectLabel';
SelectItem.displayName = 'SelectItem';
SelectGroup.displayName = 'SelectGroup';

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue
};
