'use client';

import { IconInfoCircle } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { AiGenerateButton } from '@/domains/ai/components/ai-generate-button';
import { AI_TASKS } from '@/domains/ai/lib/ai-tasks';
import { getBrandsFromListResponse } from '@/domains/brands/lib/brand-list';
import { useGetBrands } from '~/src/services/-brands-get';
import { useGetCategories } from '~/src/services/-categories-get';

import { productDefaultValues } from '../product-schema';

export const BasicInfoStep = withForm({
  defaultValues: productDefaultValues,
  render: function BasicInfo({ form }) {
    // Auto-generate slug from name
    const handleNameChange = (value: string) => {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      form.setFieldValue('slug', slug);
    };

    const { data: brands } = useGetBrands({ limit: 100, page: 1 });
    const { data: categories } = useGetCategories();
    const formValues = useStore(form.store, (s) => s.values);
    const brandOptions = getBrandsFromListResponse(brands);
    const categoryOptions = categories?.data?.categories ?? [];

    const brandName =
      brandOptions.find((b) => b.id?.toString() === formValues.brandId)?.name ?? '';
    const categoryName =
      categoryOptions.find((c) => c.id?.toString() === formValues.categoryId)?.name ?? '';

    return (
      <Flex direction='column' spacing={6}>
        <Grid cols={1} gap={4} className='sm:grid-cols-2'>
          {/* Name */}
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

          {/* Slug */}
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

          {/* Brand */}
          <GridItem>
            <form.AppField
              name='brandId'
              children={(field) => (
                <field.Select
                  label='Brand'
                  placeholder='Select brand'
                  required
                  options={
                    brandOptions.map((brand) => ({
                      value: brand.id?.toString() ?? '',
                      label: brand.name ?? ''
                    }))
                  }
                />
              )}
            />
          </GridItem>

          {/* Category */}
          <GridItem>
            <form.AppField
              name='categoryId'
              children={(field) => (
                <field.Select
                  label='Category'
                  placeholder='Select category'
                  required
                  options={
                    categoryOptions.map((brand) => ({
                      value: brand.id?.toString() ?? '',
                      label: brand.name ?? ''
                    })) || []
                  }
                />
              )}
            />
          </GridItem>

          {/* Description */}
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

        {/* Hint */}
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
