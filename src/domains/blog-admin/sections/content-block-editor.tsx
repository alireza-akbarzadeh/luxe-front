'use client';

import { IconArrowDown, IconArrowUp, IconPlus, IconTrash, IconUpload } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Text } from '@/components/ui/typography';
import { uploadBlogImage } from '@/domains/blog-admin/lib/upload-blog-image';

export type BlogContentBlockDraft = Record<string, unknown>;

const BLOCK_TYPE_OPTIONS = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'heading', label: 'Heading' },
  { value: 'image', label: 'Image' },
  { value: 'quote', label: 'Quote' },
  { value: 'list', label: 'List' },
  { value: 'callout', label: 'Callout' },
  { value: 'faq', label: 'FAQ' },
  { value: 'divider', label: 'Divider' }
] as const;

function strProp(block: BlogContentBlockDraft, key: string): string {
  const value = block[key];
  return typeof value === 'string' ? value : '';
}

function createEmptyBlock(type: string): BlogContentBlockDraft {
  switch (type) {
    case 'heading':
      return { type: 'heading', level: 2, text: '' };
    case 'image':
      return { type: 'image', url: '', alt: '', caption: '' };
    case 'quote':
      return { type: 'quote', text: '', cite: '' };
    case 'list':
      return { type: 'list', style: 'unordered', items: [{ text: '' }] };
    case 'callout':
      return { type: 'callout', tone: 'info', title: '', text: '' };
    case 'faq':
      return { type: 'faq', items: [{ question: '', answer: '' }] };
    case 'divider':
      return { type: 'divider' };
    default:
      return { type: 'paragraph', text: '' };
  }
}

interface ContentBlockEditorProps {
  value: BlogContentBlockDraft[];
  onChange: (blocks: BlogContentBlockDraft[]) => void;
}

/** Controlled editor for blog content_blocks JSON used by the storefront renderer. */
export function ContentBlockEditor({ value, onChange }: ContentBlockEditorProps) {
  const [addType, setAddType] = useState<string>('paragraph');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const updateBlock = (index: number, next: BlogContentBlockDraft) => {
    const copy = [...value];
    copy[index] = next;
    onChange(copy);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const copy = [...value];
    const [item] = copy.splice(index, 1);
    if (!item) return;
    copy.splice(target, 0, item);
    onChange(copy);
  };

  const removeBlock = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const url = await uploadBlogImage(file);
      const block = value[index] ?? createEmptyBlock('image');
      updateBlock(index, { ...block, type: 'image', url });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image', {
        description: error instanceof Error ? error.message : 'Something went wrong'
      });
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <Flex direction='column' spacing={4}>
      <Flex direction='row' align='end' spacing={2} wrap='wrap'>
        <Flex direction='column' spacing={1} className='min-w-[160px]'>
          <Label>Add block</Label>
          <Select value={addType} onValueChange={setAddType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BLOCK_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Flex>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() => onChange([...value, createEmptyBlock(addType)])}
        >
          <IconPlus className='size-4' />
          Add
        </Button>
      </Flex>

      {value.length === 0 ? (
        <Text variant='muted' className='text-sm'>
          No content blocks yet. Add a paragraph or generate an article with AI.
        </Text>
      ) : null}

      {value.map((block, index) => {
        const type = strProp(block, 'type') || 'paragraph';
        const items = block['items'];
        return (
          <Flex
            key={`${type}-${index}`}
            direction='column'
            spacing={3}
            className='border-border/50 rounded-lg border p-3'
          >
            <Flex direction='row' align='center' justify='between' spacing={2}>
              <Text className='text-sm font-medium capitalize'>{type.replaceAll('_', ' ')}</Text>
              <Flex direction='row' spacing={1}>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-sm'
                  onClick={() => moveBlock(index, -1)}
                  disabled={index === 0}
                >
                  <IconArrowUp className='size-4' />
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-sm'
                  onClick={() => moveBlock(index, 1)}
                  disabled={index === value.length - 1}
                >
                  <IconArrowDown className='size-4' />
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-sm'
                  onClick={() => removeBlock(index)}
                >
                  <IconTrash className='size-4' />
                </Button>
              </Flex>
            </Flex>

            {type === 'heading' ? (
              <Flex direction='column' spacing={2}>
                <Select
                  value={String(block['level'] ?? 2)}
                  onValueChange={(v) => updateBlock(index, { ...block, level: Number(v) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Level' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='2'>H2</SelectItem>
                    <SelectItem value='3'>H3</SelectItem>
                    <SelectItem value='4'>H4</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={strProp(block, 'text')}
                  onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                  placeholder='Heading text'
                />
              </Flex>
            ) : null}

            {type === 'paragraph' || type === 'quote' ? (
              <Flex direction='column' spacing={2}>
                <Textarea
                  rows={3}
                  value={strProp(block, 'text')}
                  onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                  placeholder={type === 'quote' ? 'Quote text' : 'Paragraph text'}
                />
                {type === 'quote' ? (
                  <Input
                    value={strProp(block, 'cite')}
                    onChange={(e) => updateBlock(index, { ...block, cite: e.target.value })}
                    placeholder='Citation (optional)'
                  />
                ) : null}
              </Flex>
            ) : null}

            {type === 'callout' ? (
              <Flex direction='column' spacing={2}>
                <Select
                  value={strProp(block, 'tone') || 'info'}
                  onValueChange={(v) => updateBlock(index, { ...block, tone: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='info'>Info</SelectItem>
                    <SelectItem value='tip'>Tip</SelectItem>
                    <SelectItem value='success'>Success</SelectItem>
                    <SelectItem value='warning'>Warning</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={strProp(block, 'title')}
                  onChange={(e) => updateBlock(index, { ...block, title: e.target.value })}
                  placeholder='Title (optional)'
                />
                <Textarea
                  rows={3}
                  value={strProp(block, 'text')}
                  onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                  placeholder='Callout text'
                />
              </Flex>
            ) : null}

            {type === 'image' ? (
              <Flex direction='column' spacing={2}>
                <Input
                  value={strProp(block, 'url')}
                  onChange={(e) => updateBlock(index, { ...block, url: e.target.value })}
                  placeholder='Image URL'
                />
                <Input
                  value={strProp(block, 'alt')}
                  onChange={(e) => updateBlock(index, { ...block, alt: e.target.value })}
                  placeholder='Alt text'
                />
                <Input
                  value={strProp(block, 'caption')}
                  onChange={(e) => updateBlock(index, { ...block, caption: e.target.value })}
                  placeholder='Caption (optional)'
                />
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleImageUpload(index, file);
                    e.target.value = '';
                  }}
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  disabled={uploadingIndex === index}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IconUpload className='size-4' />
                  {uploadingIndex === index ? 'Uploading…' : 'Upload image'}
                </Button>
              </Flex>
            ) : null}

            {type === 'list' ? (
              <Textarea
                rows={4}
                value={
                  Array.isArray(items)
                    ? items
                        .map((item) =>
                          typeof item === 'object' && item && 'text' in item
                            ? String((item as { text?: string }).text ?? '')
                            : String(item)
                        )
                        .join('\n')
                    : ''
                }
                onChange={(e) =>
                  updateBlock(index, {
                    ...block,
                    style: block['style'] ?? 'unordered',
                    items: e.target.value
                      .split('\n')
                      .filter((line) => line.trim().length > 0)
                      .map((text) => ({ text }))
                  })
                }
                placeholder='One list item per line'
              />
            ) : null}

            {type === 'faq' ? (
              <Textarea
                rows={5}
                value={
                  Array.isArray(items)
                    ? items
                        .map((item) => {
                          if (typeof item !== 'object' || !item) return '';
                          const q = String((item as { question?: string }).question ?? '');
                          const a = String((item as { answer?: string }).answer ?? '');
                          return `${q}|${a}`;
                        })
                        .join('\n')
                    : ''
                }
                onChange={(e) =>
                  updateBlock(index, {
                    ...block,
                    items: e.target.value
                      .split('\n')
                      .filter((line) => line.trim().length > 0)
                      .map((line) => {
                        const parts = line.split('|');
                        const question = (parts[0] ?? '').trim();
                        const answer = parts.slice(1).join('|').trim();
                        return { question, answer };
                      })
                  })
                }
                placeholder={'Question|Answer (one FAQ per line)'}
              />
            ) : null}

            {type === 'divider' ? (
              <Text variant='muted' className='text-xs'>
                Horizontal rule
              </Text>
            ) : null}
          </Flex>
        );
      })}
    </Flex>
  );
}
