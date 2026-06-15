import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ElementType } from 'react';
import { forwardRef } from 'react';

import { Slot } from '@/components/ui/slot';
import { cn } from '@/lib/utils';

const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
      h6: 'scroll-m-20 text-base font-semibold tracking-tight',
      p: 'leading-7',
      lead: 'text-muted-foreground text-xl leading-relaxed',
      large: 'text-lg font-semibold',
      small: 'text-sm leading-none font-medium',
      muted: 'text-muted-foreground text-sm',
      subtle: 'text-muted-foreground text-xs',
      blockquote: 'border-border text-muted-foreground mt-6 border-l-2 pl-6 italic',
      code: 'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      label: 'text-sm leading-none font-medium',
      overline: 'text-muted-foreground text-[11px] font-bold tracking-wider uppercase'
    },
    tone: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      accent: 'text-accent',
      destructive: 'text-destructive',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-amber-600 dark:text-amber-400',
      inherit: 'text-inherit'
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify'
    },
    family: {
      sans: 'font-sans',
      display: 'font-display',
      mono: 'font-mono'
    },
    balance: {
      true: 'text-balance',
      false: ''
    },
    truncate: {
      true: 'truncate',
      false: ''
    },
    numeric: {
      true: 'font-sans tabular-nums tracking-tight',
      false: ''
    },
    underline: {
      true: 'underline underline-offset-4',
      false: ''
    }
  },
  defaultVariants: {
    tone: 'default',
    weight: 'normal',
    family: 'sans',
    balance: false,
    truncate: false,
    numeric: false,
    underline: false
  }
});

type TextVariant = NonNullable<VariantProps<typeof textVariants>['variant']>;

const defaultElementMap: Record<TextVariant, ElementType> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  lead: 'p',
  large: 'p',
  small: 'small',
  muted: 'p',
  subtle: 'p',
  blockquote: 'blockquote',
  code: 'code',
  label: 'label',
  overline: 'span'
};

export interface TextProps
  extends Omit<ComponentProps<'p'>, 'color'>, VariantProps<typeof textVariants> {
  as?: ElementType;
  asChild?: boolean;
}

/** Polymorphic typography primitive — prefer this for new work. */
const Text = forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      variant = 'p',
      tone,
      weight,
      align,
      family,
      balance,
      truncate,
      numeric,
      underline,
      as,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : (as ?? defaultElementMap[variant ?? 'p']);

    return (
      <Comp
        ref={ref}
        data-slot='text'
        data-variant={variant}
        className={cn(
          textVariants({
            variant,
            tone,
            weight,
            align,
            family,
            balance,
            truncate,
            numeric,
            underline
          }),
          className
        )}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';

function createTypographyComponent(
  variant: TextVariant,
  defaultTone?: VariantProps<typeof textVariants>['tone']
) {
  const Component = forwardRef<HTMLElement, Omit<TextProps, 'variant'>>(
    ({ tone = defaultTone, ...props }, ref) => (
      <Text ref={ref} variant={variant} tone={tone} {...props} />
    )
  );
  Component.displayName = `Typography.${variant}`;
  return Component;
}

const Heading1 = createTypographyComponent('h1');
const Heading2 = createTypographyComponent('h2');
const Heading3 = createTypographyComponent('h3');
const Heading4 = createTypographyComponent('h4');
const Heading5 = createTypographyComponent('h5');
const Heading6 = createTypographyComponent('h6');
const Paragraph = createTypographyComponent('p');
const Lead = createTypographyComponent('lead', 'muted');
const Large = createTypographyComponent('large');
const Muted = createTypographyComponent('muted', 'muted');
const Subtle = createTypographyComponent('subtle', 'muted');
const Blockquote = createTypographyComponent('blockquote', 'muted');
const Code = createTypographyComponent('code');
const LabelText = createTypographyComponent('label');
const Overline = createTypographyComponent('overline', 'muted');
const Small = createTypographyComponent('small');

function Span({ className, ...props }: ComponentProps<'span'>) {
  return <Text as='span' variant='p' className={className} {...props} />;
}

function InlineCode({ className, ...props }: ComponentProps<'code'>) {
  return <Code className={className} {...props} />;
}

function List({ className, ...props }: ComponentProps<'ul'>) {
  return (
    <ul
      data-slot='typography-list'
      className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)}
      {...props}
    />
  );
}

function OrderedList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      data-slot='typography-ordered-list'
      className={cn('my-6 ml-6 list-decimal [&>li]:mt-2', className)}
      {...props}
    />
  );
}

interface LinkTextProps extends ComponentProps<'a'> {
  external?: boolean;
}

function LinkText({ className, external, href, rel, target, ...props }: LinkTextProps) {
  const isExternal = external ?? (typeof href === 'string' && /^https?:\/\//.test(href));

  return (
    <a
      data-slot='typography-link'
      href={href}
      target={isExternal ? '_blank' : target}
      rel={isExternal ? cn('noopener noreferrer', rel) : rel}
      className={cn('text-accent font-medium underline-offset-4 hover:underline', className)}
      {...props}
    />
  );
}

/** Namespace export — existing `Typography.H1` usage keeps working. */
const Typography = {
  H1: Heading1,
  H2: Heading2,
  H3: Heading3,
  H4: Heading4,
  H5: Heading5,
  H6: Heading6,
  P: Paragraph,
  S: Span,
  Lead,
  Large,
  Muted,
  Subtle,
  Blockquote,
  Code,
  Label: LabelText,
  Overline,
  Small,
  List,
  OrderedList,
  Link: LinkText,
  Text
};

export {
  Blockquote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  InlineCode,
  LabelText,
  Large,
  Lead,
  LinkText,
  List,
  Muted,
  OrderedList,
  Overline,
  Paragraph,
  Small,
  Span,
  Subtle,
  Text,
  textVariants,
  Typography};
