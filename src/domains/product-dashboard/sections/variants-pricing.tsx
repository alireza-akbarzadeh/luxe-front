'use client';

import { IconPlus, IconTag, IconTrash, IconX } from '@tabler/icons-react';
import { useState } from 'react';

import { withForm } from '@/components/forms/useAppForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { FlexItem } from '@/components/ui/flex-item';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

import { productDefaultValues } from '../product-schema';

export const VariantsPricingStep = withForm({
  defaultValues: productDefaultValues,

  render: function PriceStepRender({ form }) {
    const [newAttrName, setNewAttrName] = useState('');
    const [newAttrValue, setNewAttrValue] = useState<Record<number, string>>({});

    return (
      <Flex direction='column' spacing={8}>
        <Flex direction='column' spacing={4}>
          <h3 className='text-foreground text-sm font-medium'>Pricing</h3>
          <Grid cols={1} gap={4} className='sm:grid-cols-3'>
            <GridItem>
              <form.AppField
                name='price'
                children={(field) => (
                  <field.NumberField
                    label='Price'
                    min={0}
                    step={0.01}
                    placeholder='0.00'
                    prefix='$'
                    required
                    detail='Price of product'
                  />
                )}
              />
            </GridItem>

            <GridItem>
              <form.AppField
                name='compareAtPrice'
                children={(field) => (
                  <field.NumberField
                    label='Compare-at price'
                    min={0}
                    step={0.01}
                    placeholder='0.00'
                    prefix='$'
                    detail='Show a strikethrough price'
                  />
                )}
              />
            </GridItem>

            <GridItem>
              <form.AppField
                name='costPerItem'
                children={(field) => (
                  <field.NumberField
                    label='Cost per item'
                    min={0}
                    step={0.01}
                    placeholder='0.00'
                    prefix='$'
                    detail='Not shown to customers'
                  />
                )}
              />
            </GridItem>
          </Grid>
          <form.AppField
            name='taxable'
            children={(field) => <field.Switch label='Charge tax on this product' />}
          />
        </Flex>
        <Separator />

        {/* ── Attributes / Variants ─────────────────────────────────── */}
        <Flex direction='column' spacing={4}>
          <Flex direction='row' align='center' justify='between'>
            <Flex direction='column' spacing={0.5}>
              <h3 className='text-foreground text-sm font-medium'>Product attributes</h3>
              <p className='text-muted-foreground text-xs'>
                Add attributes like Size or Color and their available values.
              </p>
            </Flex>
          </Flex>

          <form.AppField name='attributes' mode='array'>
            {(field) => (
              <Flex direction='column' spacing={3}>
                {field.state.value.map((_, attrIdx) => (
                  <div key={attrIdx} className='bg-muted/30 rounded-lg border p-4'>
                    <Flex direction='column' spacing={3}>
                      {/* Attribute name row */}
                      <Flex direction='row' align='center' justify='between' spacing={2}>
                        <form.AppField name={`attributes[${attrIdx}].name`}>
                          {(nameField) => (
                            <nameField.TextField
                              label='Attribute name'
                              placeholder='e.g. Size, Color, Material'
                              className='flex-1'
                            />
                          )}
                        </form.AppField>

                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='text-muted-foreground hover:text-destructive mt-5 shrink-0'
                          onClick={() => field.removeValue(attrIdx)}
                        >
                          <IconTrash className='size-4' />
                        </Button>
                      </Flex>

                      {/* Values */}
                      <form.AppField name={`attributes[${attrIdx}].values`} mode='array'>
                        {(valuesField) => (
                          <Flex direction='column' spacing={2}>
                            <Label className='text-muted-foreground text-xs'>Values</Label>

                            {/* Existing values as badges */}
                            {valuesField.state.value.length > 0 && (
                              <Flex direction='row' wrap='wrap' spacing={1.5}>
                                {valuesField.state.value.map((val, valIdx) => (
                                  <Badge key={valIdx} variant='secondary' className='gap-1 pr-1'>
                                    <IconTag className='size-3' />
                                    {val}
                                    <button
                                      type='button'
                                      onClick={() => valuesField.removeValue(valIdx)}
                                      className='ml-0.5 rounded-sm opacity-60 hover:opacity-100'
                                    >
                                      <IconX className='size-3' />
                                    </button>
                                  </Badge>
                                ))}
                              </Flex>
                            )}

                            {/* Add value input */}
                            <Flex direction='row' spacing={2}>
                              <Input
                                placeholder='e.g. Cotton, Wool…'
                                value={newAttrValue[attrIdx] ?? ''}
                                onChange={(e) =>
                                  setNewAttrValue((prev) => ({
                                    ...prev,
                                    [attrIdx]: e.target.value
                                  }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && newAttrValue[attrIdx]?.trim()) {
                                    e.preventDefault();
                                    valuesField.pushValue(newAttrValue[attrIdx]!.trim());
                                    setNewAttrValue((prev) => ({ ...prev, [attrIdx]: '' }));
                                  }
                                }}
                                className='h-8 text-sm'
                              />
                              <Button
                                type='button'
                                variant='outline'
                                size='sm'
                                onClick={() => {
                                  const v = newAttrValue[attrIdx]?.trim();
                                  if (v) {
                                    valuesField.pushValue(v);
                                    setNewAttrValue((prev) => ({ ...prev, [attrIdx]: '' }));
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </Flex>

                            <form.AppField name={`attributes[${attrIdx}].values`}>
                              {(vf) =>
                                vf.state.meta.errors.length > 0 ? (
                                  <p className='text-destructive text-xs'>
                                    {vf.state.meta.errors.join(', ')}
                                  </p>
                                ) : null
                              }
                            </form.AppField>
                          </Flex>
                        )}
                      </form.AppField>
                    </Flex>
                  </div>
                ))}

                {/* Add attribute section with input for name */}
                <Flex direction='row' spacing={2} align='end'>
                  <FlexItem grow={1}>
                    <Label htmlFor='new-attr-name' className='text-muted-foreground mb-1 text-xs'>
                      New attribute name
                    </Label>
                    <Input
                      id='new-attr-name'
                      placeholder='e.g. Size, Color, Material'
                      value={newAttrName}
                      onChange={(e) => setNewAttrName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newAttrName.trim()) {
                          e.preventDefault();
                          field.pushValue({ name: newAttrName.trim(), values: [] });
                          setNewAttrName('');
                        }
                      }}
                      className='h-8 rounded-[5px] text-sm'
                    />
                  </FlexItem>
                  <Button
                    type='button'
                    variant='outline'
                    className='rounded-[5px]'
                    onClick={() => {
                      if (newAttrName.trim()) {
                        field.pushValue({ name: newAttrName.trim(), values: [] });
                        setNewAttrName('');
                      }
                    }}
                  >
                    <IconPlus className='size-4' />
                    Add attribute
                  </Button>
                </Flex>
              </Flex>
            )}
          </form.AppField>
        </Flex>
      </Flex>
    );
  }
});
