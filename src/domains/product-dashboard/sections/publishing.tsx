'use client';

import { IconDeviceDesktop, IconUsers, IconWorldWww } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';

import { withForm } from '@/components/forms/useAppForm';
import { Badge } from '@/components/ui/badge';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import { productDefaultValues } from '../product-schema';

const STATUS_OPTIONS = [
  {
    value: 'draft',
    label: 'Draft',
    description: 'Not visible to customers',
    className: 'border-border',
    badgeVariant: 'secondary' as const
  },
  {
    value: 'active',
    label: 'Active',
    description: 'Published and visible',
    className: 'border-green-500/60 bg-green-50/50 dark:bg-green-950/20',
    badgeVariant: 'default' as const
  },
  {
    value: 'archived',
    label: 'Archived',
    description: 'Hidden from store',
    className: 'border-border',
    badgeVariant: 'outline' as const
  }
] as const;

const CHANNEL_OPTIONS = [
  { value: 'online_store', label: 'Online store', icon: IconWorldWww },
  { value: 'pos', label: 'Point of sale', icon: IconDeviceDesktop },
  { value: 'wholesale', label: 'Wholesale', icon: IconUsers }
] as const;

export const PublishingStep = withForm({
  defaultValues: productDefaultValues,
  render: function PublishingStepRender({ form }) {
    const name = useStore(form.store, (s) => s.values.name);
    const seoTitle = useStore(form.store, (s) => s.values.seoTitle);
    const seoDescription = useStore(form.store, (s) => s.values.seoDescription);

    return (
      <Flex direction='column' spacing={8}>
        {/* ── Status ────────────────────────────────────────────────── */}
        <Flex direction='column' spacing={4}>
          <h3 className='text-foreground text-sm font-medium'>Product status</h3>

          <form.AppField name='status'>
            {(field) => (
              <Grid cols={3} gap={3}>
                {STATUS_OPTIONS.map((opt) => (
                  <GridItem key={opt.value}>
                    <button
                      type='button'
                      onClick={() => field.handleChange(opt.value)}
                      className={cn(
                        'w-full rounded-lg border p-3 text-left transition-all',
                        field.state.value === opt.value
                          ? opt.className + ' ring-primary ring-2 ring-offset-1'
                          : 'border-border hover:border-primary/40'
                      )}
                    >
                      <Flex direction='column' spacing={1}>
                        <Flex direction='row' align='center' justify='between'>
                          <span className='text-sm font-medium'>{opt.label}</span>
                          {field.state.value === opt.value && (
                            <Badge variant={opt.badgeVariant} className='text-[10px]'>
                              Selected
                            </Badge>
                          )}
                        </Flex>
                        <span className='text-muted-foreground text-xs'>{opt.description}</span>
                      </Flex>
                    </button>
                  </GridItem>
                ))}
              </Grid>
            )}
          </form.AppField>
        </Flex>

        <Separator />

        {/* ── Visibility ────────────────────────────────────────────── */}
        <Flex direction='column' spacing={4}>
          <h3 className='text-foreground text-sm font-medium'>Visibility</h3>
          <form.AppField name='visibility'>
            {(field) => (
              <Grid cols={2} gap={3}>
                {[
                  {
                    value: 'public' as const,
                    label: 'Public',
                    description: 'Visible in catalog and search'
                  },
                  {
                    value: 'private' as const,
                    label: 'Private',
                    description: 'Hidden from storefront listings'
                  }
                ].map((opt) => (
                  <GridItem key={opt.value}>
                    <button
                      type='button'
                      onClick={() => field.handleChange(opt.value)}
                      className={cn(
                        'w-full rounded-lg border p-3 text-left transition-all',
                        field.state.value === opt.value
                          ? 'border-primary/50 bg-primary/5 ring-primary ring-2 ring-offset-1'
                          : 'border-border hover:border-primary/40'
                      )}
                    >
                      <Flex direction='column' spacing={1}>
                        <span className='text-sm font-medium'>{opt.label}</span>
                        <span className='text-muted-foreground text-xs'>{opt.description}</span>
                      </Flex>
                    </button>
                  </GridItem>
                ))}
              </Grid>
            )}
          </form.AppField>

          <form.AppField name='publishedAt'>
            {(field) => (
              <field.DatePicker
                label='Publish date'
                detail='Optional schedule — leave empty to publish immediately when active'
              />
            )}
          </form.AppField>
        </Flex>

        <Separator />

        {/* ── Visibility & channels ─────────────────────────────────── */}
        <Flex direction='column' spacing={4}>
          <h3 className='text-foreground text-sm font-medium'>Sales channels</h3>
          <p className='text-muted-foreground text-xs'>
            Choose where this product will be available.
          </p>

          <form.AppField name='channels'>
            {(field) => (
              <Flex direction='column' spacing={2}>
                {CHANNEL_OPTIONS.map(({ value, label, icon: Icon }) => {
                  const selected = field.state.value.includes(value);
                  return (
                    <button
                      key={value}
                      type='button'
                      onClick={() => {
                        const next = selected
                          ? field.state.value.filter((v) => v !== value)
                          : [...field.state.value, value];
                        field.handleChange(next as typeof field.state.value);
                      }}
                      className={cn(
                        'flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all',
                        selected
                          ? 'border-primary/50 bg-primary/5'
                          : 'border-border hover:border-primary/30'
                      )}
                    >
                      <div
                        className={cn(
                          'flex size-8 shrink-0 items-center justify-center rounded-md',
                          selected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <Icon className='size-4' />
                      </div>
                      <span className='text-sm font-medium'>{label}</span>
                      {selected && (
                        <Badge variant='secondary' className='ml-auto text-[10px]'>
                          Enabled
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </Flex>
            )}
          </form.AppField>
        </Flex>

        <Separator />

        {/* ── Tags ──────────────────────────────────────────────────── */}
        <Flex direction='column' spacing={4}>
          <h3 className='text-foreground text-sm font-medium'>Tags</h3>
          <form.AppField name='tags'>
            {(field) => (
              <field.MultiSelect
                label='Tags'
                placeholder='Add tags…'
                detail='Tags help customers find your product via search and filters'
                props={{
                  options: [
                    { value: 'new-arrival', label: 'New arrival' },
                    { value: 'sale', label: 'Sale' },
                    { value: 'featured', label: 'Featured' },
                    { value: 'best-seller', label: 'Best seller' }
                  ],
                  getOptionValue: (opt) => opt.value,
                  getOptionLabel: (opt) => opt.label
                }}
              />
            )}
          </form.AppField>
        </Flex>

        <Separator />

        {/* ── SEO ───────────────────────────────────────────────────── */}
        <Flex direction='column' spacing={4}>
          <Flex direction='column' spacing={0.5}>
            <h3 className='text-foreground text-sm font-medium'>Search engine preview</h3>
            <p className='text-muted-foreground text-xs'>
              Customize how this product appears in search results.
            </p>
          </Flex>

          {/* Live SEO preview */}
          <div className='bg-muted/30 rounded-lg border p-4'>
            <Flex direction='column' spacing={0.5}>
              <p className='text-muted-foreground text-xs'>example.com › products › ...</p>
              <p className='line-clamp-1 text-sm font-medium text-blue-600 dark:text-blue-400'>
                {seoTitle || name || 'Product title'}
              </p>
              <p className='text-muted-foreground line-clamp-2 text-xs'>
                {seoDescription ||
                  'Add a meta description to improve click-through rate from search results.'}
              </p>
            </Flex>
          </div>

          <form.AppField name='seoTitle'>
            {(field) => (
              <Flex direction='column' spacing={1}>
                <field.TextField
                  label='SEO title'
                  placeholder={name || 'Product title'}
                  maxLength={70}
                  detail={`${(seoTitle ?? '').length}/70 characters`}
                />
              </Flex>
            )}
          </form.AppField>

          <form.AppField name='seoDescription'>
            {(field) => (
              <Flex direction='column' spacing={1}>
                <field.TextArea
                  label='Meta description'
                  placeholder='Brief description for search engines…'
                  maxLength={160}
                  rows={3}
                  description={`${(seoDescription ?? '').length}/160 characters`}
                />
              </Flex>
            )}
          </form.AppField>
        </Flex>
      </Flex>
    );
  }
});
