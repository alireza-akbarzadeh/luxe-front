'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className='bg-muted/40 text-muted-foreground flex h-[420px] items-center justify-center rounded-xl border text-sm'>
      Loading editor…
    </div>
  )
});

interface PrivacyRuleMarkdownEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  className?: string;
}

function useColorMode(): 'light' | 'dark' {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const sync = () => {
      const root = document.documentElement;
      const inDashboard = Boolean(document.querySelector('.dashboard-shell'));
      setMode(inDashboard || root.classList.contains('dark') ? 'dark' : 'light');
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return mode;
}

/**
 * Markdown editor for privacy rule bodies.
 * Persists raw markdown so storefront and other apps can parse content_markdown later.
 */
export function PrivacyRuleMarkdownEditor({
  value,
  onChange,
  className
}: PrivacyRuleMarkdownEditorProps) {
  const colorMode = useColorMode();

  return (
    <Flex direction='column' spacing={2} className={cn('w-full', className)}>
      <Text variant='muted' className='text-xs'>
        Write the rule in Markdown. Apps fetch this as <code>content_markdown</code> and parse it
        client-side.
      </Text>
      <div
        data-color-mode={colorMode}
        className={cn(
          'privacy-md-editor overflow-hidden rounded-xl border',
          '[&_.w-md-editor]:!border-border [&_.w-md-editor]:!bg-card [&_.w-md-editor]:!text-foreground [&_.w-md-editor]:!shadow-none',
          '[&_.w-md-editor-toolbar]:!border-border [&_.w-md-editor-toolbar]:!bg-muted/40',
          '[&_.w-md-editor-toolbar_button]:!text-muted-foreground',
          '[&_.w-md-editor-content]:!bg-card',
          '[&_.w-md-editor-text-input]:!text-foreground [&_.w-md-editor-text-pre]:!bg-transparent',
          '[&_.wmde-markdown]:!bg-card [&_.wmde-markdown]:!text-foreground'
        )}
      >
        <MDEditor
          value={value}
          height={480}
          preview='live'
          visibleDragbar={false}
          onChange={(next) => onChange(next ?? '')}
        />
      </div>
    </Flex>
  );
}
