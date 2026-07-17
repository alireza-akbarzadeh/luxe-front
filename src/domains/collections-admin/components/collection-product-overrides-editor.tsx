'use client';

import { useMemo } from 'react';

import { FieldContainer } from '@/components/forms/form';
import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Text } from '@/components/ui/typography';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoCollectionProductOverrideInput } from '@/services/-collections-get.schemas';
import { useGetProducts } from '@/services/-products-get';

interface CollectionProductOverridesEditorProps {
  selectedIds: string[];
  overrides: DtoCollectionProductOverrideInput[];
  onChange: (overrides: DtoCollectionProductOverrideInput[]) => void;
}

function ensureOverride(
  overrides: DtoCollectionProductOverrideInput[],
  productId: number,
  position: number
): DtoCollectionProductOverrideInput {
  return (
    overrides.find((item) => item.product_id === productId) ?? {
      product_id: productId,
      position,
      boost_score: 0,
      is_hidden: false,
      is_pinned: false
    }
  );
}

/** Manual merchandising controls for selected collection products. */
export function CollectionProductOverridesEditor({
  selectedIds,
  overrides,
  onChange
}: CollectionProductOverridesEditorProps) {
  const ids = useMemo(
    () => selectedIds.map((id) => Number(id)).filter((id) => Number.isFinite(id) && id > 0),
    [selectedIds]
  );

  const { data } = useGetProducts(
    {
      ids,
      limit: ids.length || 1,
      offset: 0,
      status: 'active'
    },
    {
      query: {
        enabled: ids.length > 0
      }
    }
  );

  const products = data?.data?.products ?? [];

  const setOverride = (next: DtoCollectionProductOverrideInput) => {
    const filtered = overrides.filter((item) => item.product_id !== next.product_id);
    onChange([...filtered, next].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)));
  };

  return (
    <FieldContainer
      label='Merchandising overrides'
      detail='Pin, hide, or reorder selected products for manual and hybrid collections.'
    >
      <Flex direction='column' spacing={4}>
        {ids.length === 0 ? (
          <Text variant='muted' className='text-sm'>
            Select products above to configure overrides.
          </Text>
        ) : (
          products.map((product, index) => {
            const productId = Number(product.id);
            const override = ensureOverride(overrides, productId, index);

            return (
              <Grid
                key={productId}
                cols={1}
                gap={4}
                className='border-border/60 rounded-2xl border p-4 sm:grid-cols-[72px_1fr]'
              >
                <GridItem>
                  <div className='bg-muted relative h-[72px] w-[72px] overflow-hidden rounded-xl border'>
                    <AppImage
                      src={product.images?.[0] ?? IMAGE_FALLBACK}
                      alt={product.name ?? ''}
                      fill
                      sizes='72px'
                      className='object-cover'
                    />
                  </div>
                </GridItem>
                <GridItem>
                  <Flex direction='column' spacing={3}>
                    <div>
                      <Text className='text-sm font-medium'>
                        {product.name ?? `Product #${productId}`}
                      </Text>
                      <Text variant='muted' className='text-xs'>
                        {product.sku ?? `ID ${productId}`}
                      </Text>
                    </div>
                    <Grid cols={1} gap={3} className='sm:grid-cols-4'>
                      <GridItem>
                        <label className='block text-xs font-medium'>Position</label>
                        <input
                          type='number'
                          value={override.position ?? index}
                          onChange={(event) =>
                            setOverride({
                              ...override,
                              position: Number(event.target.value)
                            })
                          }
                          className='border-input bg-background mt-1 h-9 w-full rounded-md border px-3 text-sm'
                        />
                      </GridItem>
                      <GridItem>
                        <label className='block text-xs font-medium'>Boost score</label>
                        <input
                          type='number'
                          value={override.boost_score ?? 0}
                          onChange={(event) =>
                            setOverride({
                              ...override,
                              boost_score: Number(event.target.value)
                            })
                          }
                          className='border-input bg-background mt-1 h-9 w-full rounded-md border px-3 text-sm'
                        />
                      </GridItem>
                      <GridItem>
                        <label className='flex h-full items-end gap-2 text-sm'>
                          <input
                            type='checkbox'
                            checked={override.is_pinned ?? false}
                            onChange={(event) =>
                              setOverride({
                                ...override,
                                is_pinned: event.target.checked
                              })
                            }
                          />
                          Pin
                        </label>
                      </GridItem>
                      <GridItem>
                        <label className='flex h-full items-end gap-2 text-sm'>
                          <input
                            type='checkbox'
                            checked={override.is_hidden ?? false}
                            onChange={(event) =>
                              setOverride({
                                ...override,
                                is_hidden: event.target.checked
                              })
                            }
                          />
                          Hide
                        </label>
                      </GridItem>
                    </Grid>
                  </Flex>
                </GridItem>
              </Grid>
            );
          })
        )}
      </Flex>
    </FieldContainer>
  );
}
