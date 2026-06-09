'use client';

import { json } from '@codemirror/lang-json';
import CodeMirror from '@uiw/react-codemirror';
import { useMemo, useState } from 'react';

import { FieldContainer } from '@/components/forms/form';
import { useFieldContext } from '@/components/forms/useFormContext';

import { JsonStatus } from './json-status';
import { JsonToolbar } from './json-toolbar';
import { formatJson, minifyJson, safeParse, toJson } from './json-utils';
import type { JsonFieldProps } from './types';

export function JsonField({ label, height = 220 }: JsonFieldProps) {
  const field = useFieldContext<string>();

  if (!field) {
    throw new Error('JsonField must be used inside AppField');
  }

  const value = useMemo(() => {
    return toJson(field.state.value);
  }, [field.state.value]);

  const [error, setError] = useState<string | null>(null);

  const onChange = (val: string) => {
    const res = safeParse(val);
    setError(res.ok ? null : res.error);

    field.handleChange(val);
  };

  const handleFormat = () => {
    try {
      field.handleChange(formatJson(value));
    } catch {}
  };

  const handleMinify = () => {
    try {
      field.handleChange(minifyJson(value));
    } catch {}
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
  };

  const handleReset = () => {
    field.handleChange('{}');
    setError(null);
  };

  return (
    <FieldContainer label={label}>
      <div className='overflow-hidden rounded-md border'>
        <JsonToolbar
          onFormat={handleFormat}
          onMinify={handleMinify}
          onCopy={handleCopy}
          onReset={handleReset}
          hasError={!!error}
        />

        <CodeMirror
          value={value}
          height={`${height}px`}
          extensions={[json()]}
          onChange={onChange}
        />

        <JsonStatus error={error} />
      </div>
    </FieldContainer>
  );
}
