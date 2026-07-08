'use client';

import { IconCheck } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';

import { cn } from '@/lib/utils';
import type { DtoProductAttributeResponse } from '@/services/-products-get.schemas';

import {
  formatAttributeLabel,
  getVariantPickerAttributes,
  resolveProductAttributeKind
} from '../lib/product-attribute.utils';
import { resolveColorToken } from '../lib/product-color.utils';

interface ProductVariantAttributesProps {
  attributes?: DtoProductAttributeResponse[];
  colors?: string[];
  sizes?: string[];
  presetSelections?: Record<string, string>;
  onSelectionChange?: (selections: Record<string, string>) => void;
}

function buildDefaultSelections(
  variantAttributes: DtoProductAttributeResponse[]
): Record<string, string> {
  const defaults: Record<string, string> = {};
  for (const attribute of variantAttributes) {
    const key = attribute.name ?? '';
    if (key && attribute.values?.[0]) {
      defaults[key] = attribute.values[0];
    }
  }
  return defaults;
}

/** Color and size pickers driven by product.attributes (not legacy colors/sizes columns). */
export function ProductVariantAttributes({
  attributes = [],
  colors,
  sizes,
  presetSelections,
  onSelectionChange
}: ProductVariantAttributesProps) {
  const variantAttributes = useMemo(() => {
    const merged = getVariantPickerAttributes(attributes, { colors, sizes });
    return merged.filter((attribute) => {
      const kind = resolveProductAttributeKind(attribute);
      return (kind === 'color' || kind === 'size') && (attribute.values?.length ?? 0) > 0;
    });
  }, [attributes, colors, sizes]);

  const variantKey = variantAttributes.map((attribute) => attribute.name ?? '').join('|');
  const presetKey = JSON.stringify(presetSelections ?? {});
  const defaultSelections = useMemo(
    () => buildDefaultSelections(variantAttributes),
    [variantAttributes]
  );

  const [userOverrides, setUserOverrides] = useState<Record<string, string>>({});
  const [lastVariantKey, setLastVariantKey] = useState(variantKey);
  const [lastPresetKey, setLastPresetKey] = useState<string | null>(null);

  // Render-time state adjustments instead of effects
  // (react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  if (lastVariantKey !== variantKey) {
    setLastVariantKey(variantKey);
    setLastPresetKey(null);
    setUserOverrides({});
  } else if (
    presetSelections &&
    Object.keys(presetSelections).length > 0 &&
    presetKey !== lastPresetKey
  ) {
    setLastPresetKey(presetKey);
    setUserOverrides((prev) => ({ ...prev, ...presetSelections }));
  }

  const selections = useMemo(
    () => ({ ...defaultSelections, ...userOverrides }),
    [defaultSelections, userOverrides]
  );

  useEffect(() => {
    onSelectionChange?.(selections);
  }, [onSelectionChange, selections]);

  if (!variantAttributes.length) return null;

  return (
    <div className='space-y-6'>
      {variantAttributes.map((attribute) => {
        const key = attribute.name ?? '';
        const kind = resolveProductAttributeKind(attribute);
        const values = attribute.values ?? [];
        const selected = selections[key] ?? values[0] ?? '';
        const label = formatAttributeLabel(attribute.name);
        const selectedLabel = kind === 'color' ? resolveColorToken(selected).label : selected;

        if (kind === 'color') {
          return (
            <div key={key}>
              <div className='mb-3 flex items-center justify-between gap-3'>
                <p className='text-sm font-medium'>{label}</p>
                <p className='text-muted-foreground text-sm'>{selectedLabel}</p>
              </div>
              <div className='flex flex-wrap gap-2.5'>
                {values.map((value) => {
                  const token = resolveColorToken(value);
                  const isSelected = selected === value;

                  return (
                    <button
                      key={value}
                      type='button'
                      onClick={() => setUserOverrides((prev) => ({ ...prev, [key]: value }))}
                      aria-pressed={isSelected}
                      className={cn(
                        'inline-flex items-center gap-2.5 rounded-full border px-3 py-2 transition-all',
                        isSelected
                          ? 'border-foreground bg-foreground/[0.03] ring-foreground/10 ring-2'
                          : 'border-border hover:border-foreground/35 bg-background'
                      )}
                    >
                      <span
                        className={cn(
                          'relative h-7 w-7 shrink-0 rounded-full border shadow-inner',
                          token.hex === '#F5F5F5' || token.hex === '#C8C8C8'
                            ? 'border-border'
                            : 'border-black/10'
                        )}
                        style={{
                          background: `linear-gradient(145deg, ${token.hex} 0%, color-mix(in srgb, ${token.hex} 75%, black) 100%)`
                        }}
                      >
                        {isSelected && (
                          <IconCheck className='absolute inset-0 m-auto h-3.5 w-3.5 text-white drop-shadow-sm' />
                        )}
                      </span>
                      <span className='text-sm font-medium'>{token.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        return (
          <div key={key}>
            <div className='mb-3 flex items-center justify-between gap-3'>
              <p className='text-sm font-medium'>{label}</p>
              {selected ? <p className='text-muted-foreground text-sm'>{selected}</p> : null}
            </div>
            <div className='flex flex-wrap gap-2'>
              {values.map((value) => (
                <button
                  key={value}
                  type='button'
                  onClick={() => setUserOverrides((prev) => ({ ...prev, [key]: value }))}
                  aria-pressed={selected === value}
                  className={cn(
                    'h-11 min-w-11 rounded-full border px-4 text-sm font-medium transition-all',
                    selected === value
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border hover:border-foreground'
                  )}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
