import { z } from 'zod';

const money = z
  .number({
    error: 'Please enter a valid number.'
  })
  .nonnegative('Amount cannot be negative.')
  .multipleOf(0.01, 'Maximum precision is 2 decimal places.');

const slug = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only');

export { money, slug };
