'use client';

import { IconTrash } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/typography';
import type { CollectionRuleConditionForm } from '@/domains/collections-admin/collection.schema';
import {
  COLLECTION_RULE_FIELD_OPTIONS,
  COLLECTION_RULE_OPERATOR_OPTIONS
} from '@/domains/collections-admin/collection.schema';

const BOOLEAN_FIELDS = new Set(['is_new', 'in_stock', 'on_sale']);
const NUMBER_FIELDS = new Set(['category_id', 'brand_id', 'min_price', 'max_price', 'min_rating']);

function operatorsForField(field: CollectionRuleConditionForm['field']) {
  if (BOOLEAN_FIELDS.has(field)) {
    return COLLECTION_RULE_OPERATOR_OPTIONS.filter((item) => item.value === 'eq');
  }
  if (field === 'search') {
    return COLLECTION_RULE_OPERATOR_OPTIONS.filter(
      (item) => item.value === 'eq' || item.value === 'contains'
    );
  }
  if (field === 'category_id' || field === 'brand_id') {
    return COLLECTION_RULE_OPERATOR_OPTIONS.filter(
      (item) => item.value === 'eq' || item.value === 'neq' || item.value === 'in'
    );
  }
  return COLLECTION_RULE_OPERATOR_OPTIONS.filter(
    (item) => item.value === 'eq' || item.value === 'gte' || item.value === 'lte'
  );
}

function defaultValueForField(
  field: CollectionRuleConditionForm['field']
): CollectionRuleConditionForm['value'] {
  if (BOOLEAN_FIELDS.has(field)) return true;
  if (NUMBER_FIELDS.has(field)) return 0;
  return '';
}

interface CollectionConditionRowProps {
  condition: CollectionRuleConditionForm;
  onChange: (next: CollectionRuleConditionForm) => void;
  onRemove: () => void;
  canRemove: boolean;
}

/** Single field/operator/value row for the collection rule builder. */
export function CollectionConditionRow({
  condition,
  onChange,
  onRemove,
  canRemove
}: CollectionConditionRowProps) {
  const operators = operatorsForField(condition.field);
  const isBoolean = BOOLEAN_FIELDS.has(condition.field);
  const isNumber = NUMBER_FIELDS.has(condition.field);

  return (
    <Flex direction='row' spacing={2} align='center' className='flex-wrap'>
      <Select
        value={condition.field}
        onValueChange={(field) => {
          const nextField = field as CollectionRuleConditionForm['field'];
          const nextOperators = operatorsForField(nextField);
          onChange({
            field: nextField,
            operator: nextOperators[0]?.value ?? 'eq',
            value: defaultValueForField(nextField)
          });
        }}
      >
        <SelectTrigger className='w-[140px]'>
          <SelectValue placeholder='Field' />
        </SelectTrigger>
        <SelectContent>
          {COLLECTION_RULE_FIELD_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={condition.operator}
        onValueChange={(operator) =>
          onChange({
            ...condition,
            operator: operator as CollectionRuleConditionForm['operator']
          })
        }
      >
        <SelectTrigger className='w-[150px]'>
          <SelectValue placeholder='Operator' />
        </SelectTrigger>
        <SelectContent>
          {operators.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isBoolean ? (
        <Flex direction='row' align='center' spacing={2} className='min-w-[120px]'>
          <Switch
            checked={Boolean(condition.value)}
            onCheckedChange={(checked) => onChange({ ...condition, value: checked })}
          />
          <Text variant='muted' className='text-xs'>
            {condition.value ? 'True' : 'False'}
          </Text>
        </Flex>
      ) : (
        <Input
          className='min-w-[140px] flex-1'
          type={isNumber ? 'number' : 'text'}
          value={
            typeof condition.value === 'boolean'
              ? ''
              : Array.isArray(condition.value)
                ? condition.value.join(',')
                : String(condition.value ?? '')
          }
          onChange={(event) => {
            const raw = event.target.value;
            if (isNumber) {
              onChange({ ...condition, value: Number(raw) || 0 });
              return;
            }
            onChange({ ...condition, value: raw });
          }}
          placeholder={isNumber ? '0' : 'Value'}
        />
      )}

      <Button
        type='button'
        variant='ghost'
        size='icon'
        disabled={!canRemove}
        onClick={onRemove}
        aria-label='Remove condition'
      >
        <IconTrash className='size-4' />
      </Button>
    </Flex>
  );
}
