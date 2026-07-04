/**
 * Barrel re-exports — prefer direct imports:
 * - `schemas/checkout.schema` — Zod + default values
 * - `lib/checkout-validation` — step/payment validation helpers
 * - `types/checkout.types` — TypeScript types
 */
export {
  CHECKOUT_PAYMENT_FIELD_KEYS,
  checkoutStepFields,
  getCheckoutPaymentErrors,
  getCheckoutStepErrors,
  getCheckoutStepFields
} from './lib/checkout-validation';
export {
  checkoutDefaultValues,
  checkoutSchema,
  createCheckoutSchema
} from './schemas/checkout.schema';
export type { CheckoutFormValues, CheckoutStepId } from './types/checkout.types';
export { CHECKOUT_STEP_IDS } from './types/checkout.types';
