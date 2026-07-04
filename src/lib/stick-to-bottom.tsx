'use client';

import type { ComponentProps, ReactNode } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import { cn } from '@/lib/utils';

const BOTTOM_THRESHOLD_PX = 24;

export type StickToBottomScroll = 'smooth' | 'instant';

export type StickToBottomProps = ComponentProps<'div'> & {
  /** Scroll behavior on first mount. */
  initial?: StickToBottomScroll;
  /** Scroll when content height changes while user is pinned to bottom. */
  resize?: StickToBottomScroll;
  children?: ReactNode;
};

type StickToBottomContextValue = {
  isAtBottom: boolean;
  isAtBottomRef: React.RefObject<boolean>;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  resize: StickToBottomScroll;
};

const StickToBottomContext = createContext<StickToBottomContextValue | null>(null);

/** Drop-in replacement for the `use-stick-to-bottom` package (chat auto-scroll). */
export function useStickToBottomContext(): StickToBottomContextValue {
  const context = useContext(StickToBottomContext);
  if (!context) {
    throw new Error('useStickToBottomContext must be used within StickToBottom');
  }
  return context;
}

function StickToBottomRoot({
  className,
  initial = 'smooth',
  resize = 'smooth',
  children,
  ...props
}: StickToBottomProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const syncAtBottom = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= BOTTOM_THRESHOLD_PX;
    isAtBottomRef.current = atBottom;
    setIsAtBottom(atBottom);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }
    syncAtBottom();
    scrollToBottom(initial === 'smooth' ? 'smooth' : 'instant');
    el.addEventListener('scroll', syncAtBottom, { passive: true });
    return () => el.removeEventListener('scroll', syncAtBottom);
  }, [initial, scrollToBottom, syncAtBottom]);

  const contextValue = useMemo<StickToBottomContextValue>(
    () => ({
      isAtBottom,
      isAtBottomRef,
      resize,
      scrollToBottom
    }),
    [isAtBottom, resize, scrollToBottom]
  );

  return (
    <StickToBottomContext.Provider value={contextValue}>
      <div className={cn('relative flex min-h-0 flex-1 flex-col', className)} {...props}>
        <div ref={scrollRef} className='min-h-0 flex-1 overflow-y-auto'>
          {children}
        </div>
      </div>
    </StickToBottomContext.Provider>
  );
}

function StickToBottomContent({ className, children, ...props }: ComponentProps<'div'>) {
  const { isAtBottomRef, resize, scrollToBottom } = useStickToBottomContext();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = contentRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (isAtBottomRef.current) {
        scrollToBottom(resize === 'smooth' ? 'smooth' : 'instant');
      }
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [isAtBottomRef, resize, scrollToBottom]);

  return (
    <div ref={contentRef} className={className} {...props}>
      {children}
    </div>
  );
}

/** Compound scroll container — same API surface as shadcn AI `Conversation`. */
export const StickToBottom = Object.assign(StickToBottomRoot, {
  Content: StickToBottomContent
});
