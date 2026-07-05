import type { DtoAiProductConfiguratorSelection } from '@/services/-ai-product-configurator-post.schemas';
import type { DtoProductAttributeResponse } from '@/services/-products-get.schemas';

import { getVariantPickerAttributes } from './product-attribute.utils';

/** Maps AI selection attribute keys onto variant picker attribute names. */
export function mapConfiguratorSelections(
  selections: DtoAiProductConfiguratorSelection[],
  attributes: DtoProductAttributeResponse[] = [],
  legacy?: { colors?: string[]; sizes?: string[] }
): Record<string, string> {
  const variantAttributes = getVariantPickerAttributes(attributes, legacy);
  const nameByLower = new Map(
    variantAttributes.map((attribute) => [
      (attribute.name ?? '').toLowerCase(),
      attribute.name ?? ''
    ])
  );

  const mapped: Record<string, string> = {};
  for (const selection of selections) {
    const attributeKey =
      nameByLower.get((selection.attribute ?? '').toLowerCase()) ?? selection.attribute ?? '';
    if (attributeKey && selection.value) {
      mapped[attributeKey] = selection.value;
    }
  }

  return mapped;
}
