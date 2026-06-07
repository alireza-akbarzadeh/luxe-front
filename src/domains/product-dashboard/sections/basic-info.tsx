'use client';

import { IconInfoCircle } from '@tabler/icons-react';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';

import { mockBrands, mockCategories, productDefaultValues } from '../prodcut-schema';

export const BasicInfoStep = withForm({
  defaultValues: productDefaultValues,
  render: ({ form }) => {
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
                    description='Auto-generated from name. Lowercase letters, numbers and hyphens only.'
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
                  options={mockBrands}
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
                  options={mockCategories}
                />
              )}
            />
          </GridItem>

          {/* Description */}
          <GridItem colSpan={1} className='sm:col-span-2'>
            <form.AppField
              name='description'
              children={(field) => (
                <field.TextArea
                  label='Description'
                  placeholder='Describe the product in detail…'
                  required
                  rows={5}
                />
              )}
            />
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
