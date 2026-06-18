import type { FormValidateFn } from '@tanstack/react-form';
import { z } from 'zod';

/**
 * TanStack Form adapter for Zod schemas.
 * Validators receive `{ value, formApi }` — not the raw form value.
 */
export function zodFormValidator<T>(schema: z.ZodType<T>): FormValidateFn<T> {
  return ({ value }) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      const first = result.error.issues[0];
      return first?.message ?? 'Validation failed';
    }
    return undefined;
  };
}

/** Standard validators for dialog forms (change + blur + submit). */
export function zodFormValidators<T>(schema: z.ZodType<T>) {
  const validate = zodFormValidator(schema);
  return {
    onChange: validate,
    onBlur: validate,
    onSubmit: validate
  };
}
