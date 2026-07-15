'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import {
  blocksToMarkdown,
  type BlogContentBlockDraft,
  markdownToBlocks
} from '@/domains/blog-admin/lib/markdown-content-blocks';
import { cn } from '@/lib/utils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
  loading: () => (
    <div className='bg-muted/40 text-muted-foreground flex h-[420px] items-center justify-center rounded-xl border text-sm'>
      Loading editor…
    </div>
  )
});

interface BlogMarkdownEditorProps {
  value: BlogContentBlockDraft[];
  onChange: (blocks: BlogContentBlockDraft[]) => void;
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
 * Themeable Markdown editor for blog body content.
 * Remount via `key` when loading a post or applying AI-generated blocks.
 * Persists as content_blocks JSON so the storefront block renderer keeps working.
 */
export function BlogMarkdownEditor({ value, onChange, className }: BlogMarkdownEditorProps) {
  const colorMode = useColorMode();
  const [markdown, setMarkdown] = useState(() => blocksToMarkdown(value));

  return (
    <Flex direction='column' spacing={2} className={cn('w-full', className)}>
      <Text variant='muted' className='text-xs'>
        Write in Markdown. Saved as structured content blocks for the public article page.
      </Text>
      <div
        data-color-mode={colorMode}
        className={cn(
          'blog-md-editor overflow-hidden rounded-xl border',
          '[&_.w-md-editor]:!border-border [&_.w-md-editor]:!bg-card [&_.w-md-editor]:!text-foreground [&_.w-md-editor]:!shadow-none',
          '[&_.w-md-editor-toolbar]:!border-border [&_.w-md-editor-toolbar]:!bg-muted/40',
          '[&_.w-md-editor-toolbar_button]:!text-muted-foreground',
          '[&_.w-md-editor-content]:!bg-card',
          '[&_.w-md-editor-text-input]:!text-foreground [&_.w-md-editor-text-pre]:!bg-transparent',
          '[&_.wmde-markdown]:!bg-card [&_.wmde-markdown]:!text-foreground'
        )}
      >
        <MDEditor
          value={markdown}
          height={480}
          preview='live'
          visibleDragbar={false}
          onChange={(next) => {
            const text = next ?? '';
            setMarkdown(text);
            onChange(markdownToBlocks(text));
          }}
        />
      </div>
    </Flex>
  );
}

export type { BlogContentBlockDraft };
