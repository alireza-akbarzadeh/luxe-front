'use client';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { AiGenerateButton } from '@/domains/ai/components/ai-generate-button';
import { AI_TASKS } from '@/domains/ai/lib/ai-tasks';
import type { BlogContentBlockDraft } from '@/domains/blog-admin/sections/content-block-editor';
import type { DtoAiGenerateResponse } from '@/services/-admin-ai-generate-post.schemas';

interface BlogAiPanelProps {
  title: string;
  excerpt: string;
  sectionType: string;
  disabled?: boolean;
  onBlocksGenerated: (blocks: BlogContentBlockDraft[]) => void;
  onExcerptGenerated: (excerpt: string) => void;
  onSeoGenerated: (metaTitle: string, metaDescription: string) => void;
}

function parseContentBlocks(result: DtoAiGenerateResponse): BlogContentBlockDraft[] {
  const raw = result.fields?.['content_blocks'] || result.text || '';
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is BlogContentBlockDraft =>
        Boolean(item) && typeof item === 'object' && !Array.isArray(item)
    );
  } catch {
    return [];
  }
}

/** AI assist actions for blog drafting (article blocks, excerpt, SEO). */
export function BlogAiPanel({
  title,
  excerpt,
  sectionType,
  disabled,
  onBlocksGenerated,
  onExcerptGenerated,
  onSeoGenerated
}: BlogAiPanelProps) {
  const canGenerate = Boolean(title.trim()) && !disabled;

  return (
    <Flex
      direction='column'
      spacing={3}
      className='border-border/50 bg-muted/30 rounded-lg border p-4'
    >
      <Text className='text-sm font-medium'>AI writing assistant</Text>
      <Text variant='muted' className='text-xs'>
        Generate a first draft of blocks, excerpt, or SEO from the article title.
      </Text>
      <Flex direction='row' wrap='wrap' spacing={2}>
        <AiGenerateButton
          label='Generate article'
          task={AI_TASKS.blogArticle}
          disabled={!canGenerate}
          buildContext={() => ({
            title: title.trim(),
            topic: title.trim(),
            section_type: sectionType
          })}
          onResult={(result) => {
            const blocks = parseContentBlocks(result);
            if (blocks.length > 0) onBlocksGenerated(blocks);
          }}
        />
        <AiGenerateButton
          label='Generate excerpt'
          task={AI_TASKS.blogExcerpt}
          disabled={!canGenerate}
          buildContext={() => ({
            title: title.trim(),
            topic: title.trim(),
            section_type: sectionType
          })}
          onResult={(result) => {
            if (result.text) onExcerptGenerated(result.text);
          }}
        />
        <AiGenerateButton
          label='Generate SEO'
          task={AI_TASKS.blogSeo}
          disabled={!canGenerate}
          buildContext={() => ({
            title: title.trim(),
            excerpt: excerpt.trim(),
            section_type: sectionType
          })}
          onResult={(result) => {
            onSeoGenerated(
              result.fields?.['meta_title'] ?? '',
              result.fields?.['meta_description'] ?? ''
            );
          }}
        />
      </Flex>
    </Flex>
  );
}
