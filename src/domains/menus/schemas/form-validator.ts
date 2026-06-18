import { z } from 'zod';

/**
 * TanStack Form adapter for Zod schemas.
 * Must return `string | undefined` — returning a ZodError leaves canSubmit stuck false.
 */
export function zodFormValidator<T>(schema: z.ZodType<T>) {
  return (value: unknown) => {
    const result = schema.safeParse(value);
    if (!result.success) {
      const first = result.error.issues[0];
      return first?.message ?? 'Validation failed';
    }
    return undefined;
  };
}

/** Standard validators object for dialog forms (mount + change + submit). */
export function zodFormValidators<T>(schema: z.ZodType<T>) {
  const validate = zodFormValidator(schema);
  return {
    onMount: validate,
    onChange: validate,
    onSubmit: validate
  };
}
