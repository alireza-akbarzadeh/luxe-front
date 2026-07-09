'use client';

import { IconPlus, IconTruck, IconX } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { useState } from 'react';

import { withForm } from '@/components/forms/useAppForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';

import { productDefaultValues } from '../product-schema';

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42'];
const COMMON_COLORS = ['Black', 'White', 'Navy', 'Gray', 'Beige', 'Red', 'Blue', 'Green'];

function StringListEditor({
  label,
  description,
  placeholder,
  suggestions,
  values,
  onChange
}: {
  label: string;
  description?: string;
  placeholder: string;
  suggestions?: string[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState('');

  const addValue = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed || values.includes(trimmed)) return;
    onChange([...values, trimmed]);
    setDraft('');
  };

  return (
    <Flex direction='column' spacing={3}>
      <Flex direction='column' spacing={0.5}>
        <Label>{label}</Label>
        {description ? (
          <Typography.Muted className='text-xs'>{description}</Typography.Muted>
        ) : null}
      </Flex>

      {values.length > 0 ? (
        <Flex direction='row' wrap='wrap' spacing={2}>
          {values.map((value) => (
            <Badge key={value} variant='secondary' className='gap-1 pr-1'>
              {value}
              <button
                type='button'
                className='hover:bg-muted rounded-sm p-0.5'
                aria-label={`Remove ${value}`}
                onClick={() => onChange(values.filter((v) => v !== value))}
              >
                <IconX className='size-3' />
              </button>
            </Badge>
          ))}
        </Flex>
      ) : null}

      <Flex direction='row' spacing={2}>
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addValue(draft);
            }
          }}
        />
        <Button type='button' variant='outline' size='icon' onClick={() => addValue(draft)}>
          <IconPlus className='size-4' />
        </Button>
      </Flex>

      {suggestions?.length ? (
        <Flex direction='row' wrap='wrap' spacing={2}>
          {suggestions
            .filter((s) => !values.includes(s))
            .map((suggestion) => (
              <Button
                key={suggestion}
                type='button'
                variant='ghost'
                size='sm'
                className='h-7 px-2 text-xs'
                onClick={() => addValue(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
        </Flex>
      ) : null}
    </Flex>
  );
}

export const ShippingStep = withForm({
  defaultValues: productDefaultValues,

  render: function ShippingRender({ form }) {
    const isDigital = useStore(form.store, (s) => s.values.isDigital);

    return (
      <Flex direction='column' spacing={8}>
        <Flex direction='column' spacing={4}>
          <Flex direction='row' align='center' spacing={2}>
            <IconTruck className='text-muted-foreground size-4' />
            <h3 className='text-foreground text-sm font-medium'>Fulfillment</h3>
          </Flex>

          <Grid cols={1} gap={4} className='sm:grid-cols-2'>
            <GridItem>
              <form.AppField
                name='isDigital'
                children={(field) => (
                  <field.Switch
                    label='Digital product'
                    description='No physical shipping — weight and size options are hidden'
                  />
                )}
              />
            </GridItem>
            <GridItem>
              <form.AppField
                name='isNew'
                children={(field) => (
                  <field.Switch
                    label='Mark as new arrival'
                    description='Shows a “New” badge on the storefront'
                  />
                )}
              />
            </GridItem>
          </Grid>
        </Flex>

        {!isDigital ? (
          <>
            <Separator />

            <Flex direction='column' spacing={4}>
              <h3 className='text-foreground text-sm font-medium'>Shipping weight</h3>
              <Grid cols={1} gap={4} className='sm:grid-cols-2'>
                <GridItem>
                  <form.AppField
                    name='weight'
                    children={(field) => (
                      <field.NumberField
                        label='Weight (kg)'
                        min={0}
                        step={0.01}
                        placeholder='0.00'
                        detail='Used for shipping rate calculations'
                      />
                    )}
                  />
                </GridItem>
              </Grid>
            </Flex>

            <Separator />

            <Flex direction='column' spacing={6}>
              <form.AppField name='sizes'>
                {(field) => (
                  <StringListEditor
                    label='Available sizes'
                    description='Optional size options shown on the product page'
                    placeholder='e.g. M, 42, One size'
                    suggestions={COMMON_SIZES}
                    values={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </form.AppField>

              <form.AppField name='colors'>
                {(field) => (
                  <StringListEditor
                    label='Available colors'
                    description='Color names or swatch labels for this product'
                    placeholder='e.g. Black, Navy'
                    suggestions={COMMON_COLORS}
                    values={field.state.value}
                    onChange={field.handleChange}
                  />
                )}
              </form.AppField>
            </Flex>
          </>
        ) : null}
      </Flex>
    );
  }
});
