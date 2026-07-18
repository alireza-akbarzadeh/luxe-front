'use client';

import { IconInfoCircle } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { useState } from 'react';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { AiGenerateButton } from '@/domains/ai/components/ai-generate-button';
import { AI_TASKS } from '@/domains/ai/lib/ai-tasks';
import { BrandPicker } from '@/domains/brands/components/brand-picker';
import { CategoryPicker } from '@/domains/categories/components/category-picker';

import { productDefaultValues } from '../product-schema';

function fieldError(errors: unknown): string | undefined {
  if (!Array.isArray(errors) || errors.length === 0) return undefined;
  const first = errors[0];
  if (typeof first === 'string') return first;
  if (first && typeof first === 'object' && 'message' in first) {
    const message = (first as { message?: unknown }).message;
    return typeof message === 'string' ? message : undefined;
  }
  return undefined;
}

export const BasicInfoStep = withForm({
  defaultValues: productDefaultValues,
  render: function BasicInfo({ form }) {
    const handleNameChange = (value: string) => {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      form.setFieldValue('slug', slug);
    };

    const formValues = useStore(form.store, (s) => s.values);
    const [brandName, setBrandName] = useState('');
    const [categoryName, setCategoryName] = useState('');

    return (
      <Flex direction='column' spacing={6}>
        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
          <GridItem colSpan={1} className='sm:col-span-2'>
            <form.AppField
              name='name'
              children={(field) => (
                <field.TextField
                  label='Product name'
                  placeholder='e.g. Classic Running Shoe'
                  required
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    handleNameChange(e.target.value);
                  }}
                />
              )}
            />
          </GridItem>

          <GridItem colSpan={1} className='sm:col-span-2'>
            <form.AppField
              name='slug'
              children={(field) => (
                <Flex direction='column' spacing={1}>
                  <field.TextField
                    label='URL slug'
                    placeholder='classic-running-shoe'
                    required
                    detail='Auto-generated from name. Lowercase letters, numbers and hyphens only.'
                  />
                </Flex>
              )}
            />
          </GridItem>

          <GridItem>
            <form.AppField
              name='brandId'
              children={(field) => (
                <BrandPicker
                  value={field.state.value ?? ''}
                  onChange={(id, brand) => {
                    field.handleChange(id ?? '');
                    setBrandName(brand?.name ?? '');
                  }}
                  label='Brand'
                  placeholder='Select brand'
                  error={fieldError(field.state.meta.errors)}
                />
              )}
            />
          </GridItem>

          <GridItem>
            <form.AppField
              name='categoryId'
              children={(field) => (
                <CategoryPicker
                  value={field.state.value ?? ''}
                  onChange={(id, category) => {
                    field.handleChange(id ?? '');
                    setCategoryName(category?.name ?? '');
                  }}
                  label='Category'
                  placeholder='Select category'
                  error={fieldError(field.state.meta.errors)}
                />
              )}
            />
          </GridItem>

          <GridItem colSpan={1} className='sm:col-span-2'>
            <Flex direction='column' spacing={2}>
              <Flex direction='row' align='center' justify='between'>
                <Typography.Label>Description</Typography.Label>
                <AiGenerateButton
                  label='Generate description'
                  task={AI_TASKS.productDescription}
                  buildContext={() => ({
                    name: formValues.name,
                    brand: brandName,
                    category: categoryName
                  })}
                  onResult={(result) => {
                    if (result.text) {
                      form.setFieldValue('description', result.text);
                    }
                  }}
                  disabled={!formValues.name?.trim()}
                />
              </Flex>
              <form.AppField
                name='description'
                children={(field) => (
                  <field.TextArea
                    label=''
                    placeholder='Describe the product in detail…'
                    required
                    rows={5}
                  />
                )}
              />
            </Flex>
          </GridItem>
        </Grid>

        <Flex direction='row' align='center' spacing={2} className='bg-muted rounded-md p-3'>
          <IconInfoCircle className='text-muted-foreground size-4 shrink-0' />
          <p className='text-muted-foreground text-xs'>
            A clear name and description improve search visibility and help customers find your
            product.
          </p>
        </Flex>
      </Flex>
    );
  }
});
