'use client';

import React, {
  createContext,
  type HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { cn } from '@/lib/utils';

type StepperOrientation = 'horizontal' | 'vertical';
type StepState = 'active' | 'completed' | 'inactive' | 'loading';

type StepIndicators = {
  active?: React.ReactNode;
  completed?: React.ReactNode;
  inactive?: React.ReactNode;
  loading?: React.ReactNode;
};

export type StepDefinition = {
  id: string;
  title?: string;
  description?: string;
  icon?: React.ReactElement;
};

interface StepperNav {
  goTo: (id: string) => void;
  goNext: () => void;
  goPrev: () => void;
}

interface StepperState {
  currentId: string;
  currentIndex: number;
  isFirst: boolean;
  isLast: boolean;
  navigation: StepperNav;
  getIndex: (id: string) => number;
}

function useStepperState(steps: StepDefinition[], initialStep?: string): StepperState {
  const ids = useMemo(() => steps.map((s) => s.id), [steps]);
  const [currentId, setCurrentId] = useState<string>(
    initialStep && ids.includes(initialStep) ? initialStep : (ids[0] ?? '')
  );

  const currentIndex = ids.indexOf(currentId);

  const navigation = useMemo<StepperNav>(
    () => ({
      goTo: (id: string) => {
        if (ids.includes(id)) setCurrentId(id);
      },
      goNext: () =>
        setCurrentId((prev) => {
          const idx = ids.indexOf(prev);
          return idx < ids.length - 1 ? ids[idx + 1]! : prev;
        }),
      goPrev: () =>
        setCurrentId((prev) => {
          const idx = ids.indexOf(prev);
          return idx > 0 ? ids[idx - 1]! : prev;
        })
    }),
    [ids]
  );

  const getIndex = useCallback((id: string) => ids.indexOf(id), [ids]);

  return {
    currentId,
    currentIndex,
    isFirst: currentIndex === 0,
    isLast: currentIndex === ids.length - 1,
    navigation,
    getIndex
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface StepperContextValue {
  state: StepperState;
  steps: StepDefinition[];
  orientation: StepperOrientation;
  configOrientation: StepperOrientation;
  responsive: boolean;
  indicators: StepIndicators;
  registerTrigger: (node: HTMLButtonElement | null, remove?: boolean) => void;
  triggerNodes: HTMLButtonElement[];
  focusNext: (currentIdx: number) => void;
  focusPrev: (currentIdx: number) => void;
  focusFirst: () => void;
  focusLast: () => void;
}

interface StepItemContextValue {
  step: StepDefinition;
  index: number;
  state: StepState;
  isDisabled: boolean;
  isLoading: boolean;
}

const StepperContext = createContext<StepperContextValue | undefined>(undefined);
const StepItemContext = createContext<StepItemContextValue | undefined>(undefined);

function useStepper(): StepperContextValue {
  const ctx = useContext(StepperContext);
  if (!ctx) throw new Error('useStepper must be used within a <Stepper>');
  return ctx;
}

function useStepItem(): StepItemContextValue {
  const ctx = useContext(StepItemContext);
  if (!ctx) throw new Error('useStepItem must be used within a <StepperItem>');
  return ctx;
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  steps: StepDefinition[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  orientation?: StepperOrientation;
  responsive?: boolean;
  indicators?: StepIndicators;
}

function Stepper({
  steps,
  defaultValue,
  value,
  onValueChange,
  orientation = 'horizontal',
  responsive = false,
  indicators = {},
  className,
  children,
  ...props
}: StepperProps) {
  const state = useStepperState(steps, defaultValue ?? steps[0]?.id);

  // Controlled support
  useEffect(() => {
    if (typeof value === 'string' && value !== state.currentId) {
      state.navigation.goTo(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    onValueChange?.(state.currentId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentId]);

  // Responsive orientation
  const [isMdUp, setIsMdUp] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : true
  );

  useEffect(() => {
    if (!responsive) return;
    const mql = window.matchMedia('(min-width: 768px)');
    const handler = (e: MediaQueryListEvent) => setIsMdUp(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [responsive]);

  const effectiveOrientation: StepperOrientation = useMemo(() => {
    if (responsive && orientation === 'horizontal') return isMdUp ? 'horizontal' : 'vertical';
    return orientation;
  }, [responsive, orientation, isMdUp]);

  // Trigger registry for keyboard navigation
  const [triggerNodes, setTriggerNodes] = useState<HTMLButtonElement[]>([]);

  const registerTrigger = useCallback((node: HTMLButtonElement | null, remove = false) => {
    setTriggerNodes((prev) => {
      if (!node) return prev;
      if (remove) return prev.filter((n) => n !== node);
      return prev.includes(node) ? prev : [...prev, node];
    });
  }, []);

  const focusNext = useCallback(
    (idx: number) => triggerNodes[(idx + 1) % triggerNodes.length]?.focus(),
    [triggerNodes]
  );
  const focusPrev = useCallback(
    (idx: number) => triggerNodes[(idx - 1 + triggerNodes.length) % triggerNodes.length]?.focus(),
    [triggerNodes]
  );
  const focusFirst = useCallback(() => triggerNodes[0]?.focus(), [triggerNodes]);
  const focusLast = useCallback(
    () => triggerNodes[triggerNodes.length - 1]?.focus(),
    [triggerNodes]
  );

  const contextValue = useMemo<StepperContextValue>(
    () => ({
      state,
      steps,
      orientation: effectiveOrientation,
      configOrientation: orientation,
      responsive,
      indicators,
      registerTrigger,
      triggerNodes,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast
    }),
    [
      state,
      steps,
      effectiveOrientation,
      orientation,
      responsive,
      indicators,
      registerTrigger,
      triggerNodes,
      focusNext,
      focusPrev,
      focusFirst,
      focusLast
    ]
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        role='tablist'
        aria-orientation={effectiveOrientation}
        data-slot='stepper'
        data-orientation={effectiveOrientation}
        className={cn('w-full', className)}
        {...props}
      >
        {children}
      </div>
    </StepperContext.Provider>
  );
}

// ─── StepperItem ──────────────────────────────────────────────────────────────

interface StepperItemProps extends HTMLAttributes<HTMLDivElement> {
  stepId: string;
  completed?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

function StepperItem({
  stepId,
  completed = false,
  disabled = false,
  loading = false,
  className,
  children,
  ...props
}: StepperItemProps) {
  const { state, steps } = useStepper();
  const stepIndex = state.getIndex(stepId);
  const step = steps.find((s) => s.id === stepId)!;

  const resolvedState: StepState =
    completed || stepIndex < state.currentIndex
      ? 'completed'
      : stepIndex === state.currentIndex
        ? 'active'
        : 'inactive';

  const isLoading = loading && stepIndex === state.currentIndex;

  return (
    <StepItemContext.Provider
      value={{ step, index: stepIndex, state: resolvedState, isDisabled: disabled, isLoading }}
    >
      <div
        data-slot='stepper-item'
        data-state={resolvedState}
        className={cn(
          'group/step flex items-center justify-center not-last:flex-1',
          'group-data-[orientation=horizontal]/stepper-nav:flex-row',
          'group-data-[orientation=vertical]/stepper-nav:flex-col',
          className
        )}
        {...(isLoading ? { 'data-loading': true } : {})}
        {...props}
      >
        {children}
      </div>
    </StepItemContext.Provider>
  );
}

// ─── StepperTrigger ───────────────────────────────────────────────────────────

interface StepperTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

function StepperTrigger({
  asChild = false,
  className,
  children,
  tabIndex,
  ...props
}: StepperTriggerProps) {
  const { state, registerTrigger, triggerNodes, focusNext, focusPrev, focusFirst, focusLast } =
    useStepper();
  const { step, isDisabled, state: stepState, isLoading } = useStepItem();

  const isSelected = state.currentId === step.id;
  const [btnNode, setBtnNode] = useState<HTMLButtonElement | null>(null);

  const callbackRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (node) {
        setBtnNode(node);
        registerTrigger(node);
      } else if (btnNode) {
        registerTrigger(btnNode, true);
        setBtnNode(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [registerTrigger]
  );

  const myIdx = useMemo(
    () => (btnNode ? triggerNodes.findIndex((n) => n === btnNode) : -1),
    [triggerNodes, btnNode]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        if (myIdx !== -1) focusNext(myIdx);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        if (myIdx !== -1) focusPrev(myIdx);
        break;
      case 'Home':
        e.preventDefault();
        focusFirst();
        break;
      case 'End':
        e.preventDefault();
        focusLast();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        state.navigation.goTo(step.id);
        break;
    }
  };

  if (asChild) {
    return (
      <span data-slot='stepper-trigger' data-state={stepState} className={className}>
        {children}
      </span>
    );
  }

  return (
    <button
      ref={callbackRef}
      role='tab'
      id={`stepper-tab-${step.id}`}
      aria-selected={isSelected}
      aria-controls={`stepper-panel-${step.id}`}
      tabIndex={typeof tabIndex === 'number' ? tabIndex : isSelected ? 0 : -1}
      data-slot='stepper-trigger'
      data-state={stepState}
      data-loading={isLoading || undefined}
      disabled={isDisabled}
      className={cn(
        'inline-flex cursor-pointer items-center gap-2.5 rounded-full outline-none',
        'disabled:pointer-events-none disabled:opacity-60',
        className
      )}
      onClick={() => state.navigation.goTo(step.id)}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── StepperIndicator ─────────────────────────────────────────────────────────

interface StepperIndicatorProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'outline';
}

function StepperIndicator({ children, className, variant = 'default' }: StepperIndicatorProps) {
  const { state: stepState, isLoading, step } = useStepItem();
  const { indicators } = useStepper();

  const base =
    'relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md text-sm font-medium transition-all duration-300';

  const variantClasses =
    variant === 'outline'
      ? cn(
          'bg-transparent border border-primary/20 text-muted-foreground',
          'data-[state=completed]:border-foreground data-[state=completed]:text-foreground',
          'data-[state=active]:border-primary data-[state=active]:text-foreground'
        )
      : cn(
          'border-background bg-muted',
          'data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground',
          'data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
          'ring-offset-background group-data-[state=active]/step:ring-2 group-data-[state=active]/step:ring-primary/30 group-data-[state=active]/step:ring-offset-3'
        );

  const content =
    (isLoading ? indicators?.loading : indicators?.[stepState]) ??
    (step?.icon ? <span className='*:[svg]:size-4'>{step.icon}</span> : children);

  return (
    <div
      data-slot='stepper-indicator'
      data-state={stepState}
      className={cn(base, variantClasses, className)}
    >
      <div className='absolute'>{content}</div>
    </div>
  );
}

// ─── StepperSeparator ─────────────────────────────────────────────────────────

function StepperSeparator({ className }: React.ComponentProps<'div'>) {
  const { state } = useStepItem();

  return (
    <div
      data-slot='stepper-separator'
      data-state={state}
      className={cn(
        'bg-muted m-2 rounded-sm transition-colors duration-500',
        'group-data-[state=completed]/step:bg-primary',
        'group-data-[orientation=horizontal]/stepper-nav:h-0.5 group-data-[orientation=horizontal]/stepper-nav:flex-1',
        'group-data-[orientation=vertical]/stepper-nav:h-12 group-data-[orientation=vertical]/stepper-nav:w-0.5',
        className
      )}
    />
  );
}

// ─── StepperTitle / StepperDescription ───────────────────────────────────────

function StepperTitle({ children, className }: React.ComponentProps<'h3'>) {
  const { state } = useStepItem();
  return (
    <h3
      data-slot='stepper-title'
      data-state={state}
      className={cn('text-sm font-medium', className)}
    >
      {children}
    </h3>
  );
}

function StepperDescription({ children, className }: React.ComponentProps<'div'>) {
  const { state } = useStepItem();
  return (
    <div
      data-slot='stepper-description'
      data-state={state}
      className={cn('text-muted-foreground text-xs font-medium', className)}
    >
      {children}
    </div>
  );
}

// ─── StepperNav ───────────────────────────────────────────────────────────────

function StepperNav({ children, className }: React.ComponentProps<'nav'>) {
  const { state, orientation, configOrientation, responsive } = useStepper();

  const responsiveClasses =
    responsive && configOrientation === 'horizontal' ? 'flex-col md:flex-row md:w-full' : '';

  return (
    <nav
      data-slot='stepper-nav'
      data-state={state.currentId}
      data-orientation={orientation}
      className={cn(
        'group/stepper-nav inline-flex',
        'data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row',
        'data-[orientation=vertical]:flex-col',
        responsiveClasses,
        className
      )}
    >
      {children}
    </nav>
  );
}

// ─── StepperPanel ─────────────────────────────────────────────────────────────

function StepperPanel({ children, className }: React.ComponentProps<'div'>) {
  const { state } = useStepper();
  return (
    <div data-slot='stepper-panel' data-state={state.currentId} className={cn('w-full', className)}>
      {children}
    </div>
  );
}

// ─── StepperContent ───────────────────────────────────────────────────────────

interface StepperContentProps extends React.ComponentProps<'div'> {
  value: string;
  forceMount?: boolean;
}

function StepperContent({ value, forceMount, children, className }: StepperContentProps) {
  const { state } = useStepper();
  const isActive = value === state.currentId;

  if (!forceMount && !isActive) return null;

  return (
    <div
      role='tabpanel'
      id={`stepper-panel-${value}`}
      aria-labelledby={`stepper-tab-${value}`}
      data-slot='stepper-content'
      data-state={state.currentId}
      hidden={!isActive && forceMount}
      className={cn('w-full', className, !isActive && forceMount && 'hidden')}
    >
      {children}
    </div>
  );
}

// ─── Exports ─────────────────────────────────────────────────────────────────

export {
  Stepper,
  StepperContent,
  type StepperContentProps,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  type StepperItemProps,
  StepperNav,
  StepperPanel,
  type StepperProps,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
  type StepperTriggerProps,
  useStepItem,
  useStepper
};
