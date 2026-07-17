'use client';

import { withForm } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { collectionDefaultValues } from '@/domains/collections-admin/collection.schema';
import { CollectionConditionBuilder } from '@/domains/collections-admin/components/collection-condition-builder';
import { CollectionProductOverridesEditor } from '@/domains/collections-admin/components/collection-product-overrides-editor';
import { CollectionProductPicker } from '@/domains/collections-admin/components/collection-product-picker';
import { CollectionRulesPreview } from '@/domains/collections-admin/components/collection-rules-preview';
import type { DtoCollectionProductOverrideInput } from '@/services/-collections-get.schemas';

export const CollectionMerchandisingFields = withForm({
  defaultValues: collectionDefaultValues,
  props: {
    collectionId: undefined as number | undefined,
    productOverrides: [] as DtoCollectionProductOverrideInput[],
    onProductOverridesChange: (_next: DtoCollectionProductOverrideInput[]) => {}
  },
  render: function CollectionMerchandisingFieldsRender({
    form,
    collectionId,
    productOverrides,
    onProductOverridesChange
  }) {
    const rulesFields = (
      <>
        <form.AppField
          name='rules'
          children={(field) => (
            <CollectionConditionBuilder
              value={field.state.value}
              onChange={(next) => field.handleChange(next)}
            />
          )}
        />
        <form.Subscribe
          selector={(state) => ({
            mode: state.values.mode,
            rules: state.values.rules
          })}
          children={(preview) => (
            <CollectionRulesPreview
              mode={preview.mode}
              rules={preview.rules}
              collectionId={collectionId}
            />
          )}
        />
      </>
    );

    return (
      <form.Subscribe
        selector={(state) => state.values.mode}
        children={(mode) =>
          mode === 'manual' || mode === 'hybrid' ? (
            <Flex direction='column' spacing={4}>
              <Typography.H3 className='text-base'>Manual merchandising</Typography.H3>
              <Typography.Muted className='text-sm'>
                Choose the exact products included in the collection and optionally override their
                storefront priority.
              </Typography.Muted>
              <form.AppField
                name='product_ids'
                children={(field) => <CollectionProductPicker field={field} />}
              />
              <form.Subscribe
                selector={(state) => state.values.product_ids}
                children={(selectedIds) => (
                  <CollectionProductOverridesEditor
                    selectedIds={selectedIds}
                    overrides={productOverrides}
                    onChange={onProductOverridesChange}
                  />
                )}
              />
              {mode === 'hybrid' ? (
                <Flex direction='column' spacing={4}>
                  <Typography.H3 className='text-base'>Dynamic rules</Typography.H3>
                  {rulesFields}
                </Flex>
              ) : null}
            </Flex>
          ) : (
            <Flex direction='column' spacing={4}>
              <Typography.H3 className='text-base'>Dynamic rules</Typography.H3>
              <Typography.Muted className='text-sm'>
                Build a living product set with AND/OR conditions. Validate against the same
                resolver the storefront uses.
              </Typography.Muted>
              {rulesFields}
            </Flex>
          )
        }
      />
    );
  }
});
