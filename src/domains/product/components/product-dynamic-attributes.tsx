'use client';

import { Badge } from '@/components/ui/badge';
import type { DtoProductAttributeResponse } from '@/services/-products-get.schemas';

import {
  formatAttributeLabel,
  formatAttributeValue,
  resolveProductAttributeKind
} from '../lib/product-attribute.utils';

interface ProductDynamicAttributesProps {
  attributes?: DtoProductAttributeResponse[];
}

function AttributeTextRow({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex justify-between gap-4 py-3 text-sm'>
      <dt className='text-muted-foreground shrink-0'>{label}</dt>
      <dd className='text-right font-medium'>{value}</dd>
    </div>
  );
}

function AttributeListRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className='py-3'>
      <dt className='text-muted-foreground mb-2 text-sm'>{label}</dt>
      <dd className='flex flex-wrap gap-2'>
        {values.map((value) => (
          <Badge key={value} variant='secondary' className='rounded-full font-normal'>
            {formatAttributeValue(value)}
          </Badge>
        ))}
      </dd>
    </div>
  );
}

function AttributeColorRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className='py-3'>
      <dt className='text-muted-foreground mb-2 text-sm'>{label}</dt>
      <dd className='flex flex-wrap gap-2'>
        {values.map((value) => (
          <span
            key={value}
            className='border-border inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium'
          >
            <span
              className='border-border h-4 w-4 rounded-full border'
              style={{ backgroundColor: value.startsWith('#') ? value : undefined }}
              aria-hidden
            />
            {formatAttributeValue(value)}
          </span>
        ))}
      </dd>
    </div>
  );
}

function AttributeMeasurementRow({ label, values }: { label: string; values: string[] }) {
  return (
    <div className='py-3'>
      <dt className='text-muted-foreground mb-2 text-sm'>{label}</dt>
      <dd className='grid gap-2 sm:grid-cols-2'>
        {values.map((value, index) => (
          <div
            key={`${value}-${index}`}
            className='bg-muted/40 rounded-xl px-3 py-2 text-sm font-medium'
          >
            {formatAttributeValue(value)}
          </div>
        ))}
      </dd>
    </div>
  );
}

/** Renders product.attributes with type-specific UI blocks. */
export function ProductDynamicAttributes({ attributes = [] }: ProductDynamicAttributesProps) {
  if (!attributes.length) {
    return (
      <p className='text-muted-foreground text-sm'>
        No additional product attributes are listed for this item.
      </p>
    );
  }

  return (
    <dl className='divide-border divide-y'>
      {attributes.map((attribute) => {
        const label = formatAttributeLabel(attribute.name);
        const values = (attribute.values ?? []).filter(Boolean);
        const kind = resolveProductAttributeKind(attribute);

        if (!values.length) return null;

        switch (kind) {
          case 'list':
          case 'size':
            return <AttributeListRow key={label} label={label} values={values} />;
          case 'color':
            return <AttributeColorRow key={label} label={label} values={values} />;
          case 'measurement':
            return <AttributeMeasurementRow key={label} label={label} values={values} />;
          case 'boolean':
          case 'text':
          default:
            return (
              <AttributeTextRow
                key={label}
                label={label}
                value={values.map(formatAttributeValue).join(', ')}
              />
            );
        }
      })}
    </dl>
  );
}
