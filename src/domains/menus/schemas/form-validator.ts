import { z } from 'zod';

/** TanStack Form adapter for Zod schemas. */
export function zodFormValidator<T>(schema: z.ZodType<T>) {
  return (value: unknown) => {
    const result = schema.safeParse(value);
    if (!result.success) return result.error;
    return undefined;
  };
}
