'use client';

import { IconSettingsAutomation } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { DtoAiProductConfiguratorResponse } from '@/services/-ai-product-configurator-post.schemas';
import type { DtoProductAttributeResponse } from '@/services/-products-get.schemas';

import { mapConfiguratorSelections } from '../../lib/configurator-selection.utils';
import {
  getVariantPickerAttributes,
  resolveProductAttributeKind
} from '../../lib/product-attribute.utils';
import { ProductConfiguratorDialog } from './product-configurator-dialog';

interface ProductConfiguratorTriggerProps {
  productId: number;
  productName?: string;
  attributes?: DtoProductAttributeResponse[];
  colors?: string[];
  sizes?: string[];
  currentPreferences?: Record<string, string>;
  onApplySelections: (selections: Record<string, string>) => void;
}

/** PDP button that opens the AI product configurator when variants exist. */
export function ProductConfiguratorTrigger({
  productId,
  productName,
  attributes = [],
  colors,
  sizes,
  currentPreferences,
  onApplySelections
}: ProductConfiguratorTriggerProps) {
  const t = useTranslations('pdp.configurator');
  const [open, setOpen] = useState(false);

  const hasConfigurableOptions = getVariantPickerAttributes(attributes, { colors, sizes }).some(
    (attribute) => {
      const kind = resolveProductAttributeKind(attribute);
      return (kind === 'color' || kind === 'size') && (attribute.values?.length ?? 0) > 1;
    }
  );

  if (!productId || !hasConfigurableOptions) {
    return null;
  }

  const handleApply = (result: DtoAiProductConfiguratorResponse) => {
    const mapped = mapConfiguratorSelections(result.selections ?? [], attributes, {
      colors,
      sizes
    });
    if (Object.keys(mapped).length > 0) {
      onApplySelections(mapped);
    }
  };

  return (
    <>
      <Button
        type='button'
        variant='outline'
        className='border-gold/30 bg-gold/5 hover:bg-gold/10 h-11 w-full justify-start gap-2 rounded-full px-4 text-sm font-medium'
        onClick={() => setOpen(true)}
      >
        <IconSettingsAutomation className='text-gold-strong size-4 shrink-0' />
        {t('button')}
      </Button>
      <ProductConfiguratorDialog
        open={open}
        onOpenChange={setOpen}
        productId={productId}
        productName={productName}
        currentPreferences={currentPreferences}
        onApplyConfiguration={handleApply}
      />
    </>
  );
}
