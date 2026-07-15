export type BlogContentBlockDraft = Record<string, unknown>;

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

/** Serialize content_blocks JSON into Markdown for the admin editor. */
export function blocksToMarkdown(blocks: BlogContentBlockDraft[]): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return '';

  const parts: string[] = [];

  for (const block of blocks) {
    const type = asString(block['type']);

    switch (type) {
      case 'heading': {
        const level = Math.min(4, Math.max(1, asNumber(block['level']) ?? 2));
        const hashes = '#'.repeat(level);
        const text = asString(block['text']).trim();
        if (text) parts.push(`${hashes} ${text}`);
        break;
      }
      case 'paragraph': {
        const text = asString(block['text']).trim();
        if (text) parts.push(text);
        break;
      }
      case 'quote': {
        const text = asString(block['text']).trim();
        const cite = asString(block['cite']).trim();
        if (!text) break;
        const quoted = text
          .split('\n')
          .map((line) => `> ${line}`)
          .join('\n');
        parts.push(cite ? `${quoted}\n>\n> — ${cite}` : quoted);
        break;
      }
      case 'list': {
        const items = Array.isArray(block['items']) ? block['items'] : [];
        const style = asString(block['style']) || 'unordered';
        const lines = items
          .map((item, index) => {
            if (typeof item === 'string') {
              return style === 'ordered' ? `${index + 1}. ${item}` : `- ${item}`;
            }
            if (item && typeof item === 'object') {
              const record = item as Record<string, unknown>;
              const text = asString(record['text']).trim();
              if (!text) return null;
              if (style === 'task') {
                const checked = Boolean(record['checked']);
                return `- [${checked ? 'x' : ' '}] ${text}`;
              }
              return style === 'ordered' ? `${index + 1}. ${text}` : `- ${text}`;
            }
            return null;
          })
          .filter((line): line is string => Boolean(line));
        if (lines.length > 0) parts.push(lines.join('\n'));
        break;
      }
      case 'image': {
        const url = asString(block['url']).trim();
        if (!url) break;
        const alt = asString(block['alt']).trim() || 'Image';
        const caption = asString(block['caption']).trim();
        parts.push(caption ? `![${alt}](${url})\n*${caption}*` : `![${alt}](${url})`);
        break;
      }
      case 'code': {
        const code = asString(block['code']);
        const language = asString(block['language']).trim();
        parts.push(`\`\`\`${language}\n${code}\n\`\`\``);
        break;
      }
      case 'divider':
        parts.push('---');
        break;
      case 'callout': {
        const title = asString(block['title']).trim();
        const text = asString(block['text']).trim();
        const tone = asString(block['tone']).trim() || 'info';
        if (!text && !title) break;
        const header = title ? `**[${tone}] ${title}**` : `**[${tone}]**`;
        parts.push(`> ${header}\n>\n> ${text.replace(/\n/g, '\n> ')}`);
        break;
      }
      case 'faq': {
        const items = Array.isArray(block['items']) ? block['items'] : [];
        for (const item of items) {
          if (!item || typeof item !== 'object') continue;
          const record = item as Record<string, unknown>;
          const question = asString(record['question']).trim();
          const answer = asString(record['answer']).trim();
          if (!question) continue;
          parts.push(`### ${question}`);
          if (answer) parts.push(answer);
        }
        break;
      }
      default:
        break;
    }
  }

  return parts.join('\n\n').trim();
}

/**
 * Parse Markdown into content_blocks JSON for API + storefront renderer.
 * Supports headings, paragraphs, lists, images, quotes, code fences, dividers.
 */
export function markdownToBlocks(markdown: string): BlogContentBlockDraft[] {
  const source = markdown.replace(/\r\n/g, '\n').trim();
  if (!source) return [];

  const blocks: BlogContentBlockDraft[] = [];
  const fenceRegex = /^```([^\n]*)\n([\s\S]*?)^```/gm;
  const segments: Array<{ type: 'fence' | 'text'; language?: string; body: string }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(source)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', body: source.slice(lastIndex, match.index) });
    }
    segments.push({
      type: 'fence',
      language: (match[1] ?? '').trim(),
      body: match[2] ?? ''
    });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < source.length) {
    segments.push({ type: 'text', body: source.slice(lastIndex) });
  }
  if (segments.length === 0) {
    segments.push({ type: 'text', body: source });
  }

  for (const segment of segments) {
    if (segment.type === 'fence') {
      blocks.push({
        type: 'code',
        language: segment.language || undefined,
        code: segment.body.replace(/\n$/, '')
      });
      continue;
    }

    const chunks = segment.body.split(/\n{2,}/);
    for (const chunk of chunks) {
      const trimmed = chunk.trim();
      if (!trimmed) continue;

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        blocks.push({ type: 'divider' });
        continue;
      }

      const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)$/s);
      if (headingMatch) {
        const level = Math.min(4, Math.max(2, headingMatch[1]?.length ?? 2)) as 2 | 3 | 4;
        blocks.push({
          type: 'heading',
          level,
          text: (headingMatch[2] ?? '').trim()
        });
        continue;
      }

      const lines = trimmed.split('\n');
      const isQuote = lines.every((line) => line.trim() === '' || line.trimStart().startsWith('>'));
      if (isQuote) {
        const quoteLines = lines
          .map((line) => line.replace(/^\s*>\s?/, ''))
          .join('\n')
          .trim();
        const citeMatch = quoteLines.match(/\n—\s*(.+)$/);
        if (citeMatch) {
          blocks.push({
            type: 'quote',
            text: quoteLines.slice(0, citeMatch.index).trim(),
            cite: citeMatch[1]?.trim()
          });
        } else {
          const calloutMatch = quoteLines.match(/^\*\*\[(\w+)\](?:\s+(.+?))?\*\*\n+([\s\S]*)$/);
          if (calloutMatch) {
            blocks.push({
              type: 'callout',
              tone: calloutMatch[1] ?? 'info',
              title: calloutMatch[2]?.trim() || undefined,
              text: (calloutMatch[3] ?? '').trim()
            });
          } else {
            blocks.push({ type: 'quote', text: quoteLines });
          }
        }
        continue;
      }

      const nonEmpty = lines.map((line) => line.trim()).filter(Boolean);
      const isTask =
        nonEmpty.length > 0 && nonEmpty.every((line) => /^[-*+]\s+\[[ xX]\]\s+/.test(line));
      const isOrdered = nonEmpty.length > 0 && nonEmpty.every((line) => /^\d+\.\s+/.test(line));
      const isUnordered =
        nonEmpty.length > 0 && !isTask && nonEmpty.every((line) => /^[-*+]\s+/.test(line));

      if (isTask) {
        blocks.push({
          type: 'list',
          style: 'task',
          items: nonEmpty.map((line) => {
            const taskMatch = line.match(/^[-*+]\s+\[([ xX])\]\s+(.+)$/);
            return {
              text: taskMatch?.[2]?.trim() ?? line,
              checked: taskMatch?.[1]?.toLowerCase() === 'x'
            };
          })
        });
        continue;
      }

      if (isOrdered) {
        blocks.push({
          type: 'list',
          style: 'ordered',
          items: nonEmpty.map((line) => ({
            text: line.replace(/^\d+\.\s+/, '').trim()
          }))
        });
        continue;
      }

      if (isUnordered) {
        blocks.push({
          type: 'list',
          style: 'unordered',
          items: nonEmpty.map((line) => ({
            text: line.replace(/^[-*+]\s+/, '').trim()
          }))
        });
        continue;
      }

      const imageOnly = trimmed.match(/^!\[([^\]]*)\]\(([^)\s]+)\)(?:\n\*([^*]+)\*)?$/);
      if (imageOnly) {
        blocks.push({
          type: 'image',
          alt: imageOnly[1] ?? '',
          url: imageOnly[2] ?? '',
          caption: imageOnly[3]?.trim() || undefined
        });
        continue;
      }

      blocks.push({ type: 'paragraph', text: trimmed });
    }
  }

  return blocks;
}
