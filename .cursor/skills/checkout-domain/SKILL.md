---
name: checkout-domain
description: Refactor or extend the storefront checkout domain — thin components, hooks for logic, Zod in schemas/, types in types/, form via useTypedAppFormContext, Zustand for wizard UI state.
---

# Checkout domain layout

Use this skill when touching `src/domains/checkout/` — shipping, review, payment, coupons, mobile action bar.

## Folder roles

| Path | Role |
|------|------|
| `types/checkout.types.ts` | **Single** types file per domain (props, step ids, form value type) |
| `schemas/checkout.schema.ts` | Main wizard Zod + `checkoutDefaultValues` |
| `schemas/checkout-address-edit.schema.ts` | Sub-form schemas |
| `lib/checkout-validation.ts` | Step/payment error helpers (no React) |
| `lib/*.ts` | Mappers, cache, pure utils |
| `hooks/use-*.ts` | API calls, mutations, form orchestration, wizard actions |
| `sections/` | Field groups / step panels (JSX + `form.AppField`) |
| `components/` | Presentational UI only — **≤ ~200 lines** |
| `containers/` | Step shells wiring hooks + sections |
| `checkout.domain.tsx` | Route entry: cart gate, `useCheckoutForm`, `form.AppForm` wrapper |
| `store/checkout.store.ts` | Zustand: steps, terms, coupon UI, submit error (not server data) |

## Hard rules

1. **No API calls in `components/`** — use hooks (`use-payment-providers`, `use-checkout-shipping-providers`, `use-checkout-summary-coupons`).
2. **No `form={form}` prop drilling** — children inside `form.AppForm` use `useTypedAppFormContext({ defaultValues: checkoutDefaultValues })`.
3. **No `withForm` in checkout** — prefer explicit function components + form context.
4. **Wizard actions** — `useCheckoutWizardActions({ form, isPending, submitOrder })` only in `checkout.domain.tsx` (needs form instance before/without context for top-level orchestration).
5. **Zustand** for cross-step UI: `currentStep`, `agreedToTerms`, `appliedCouponCode`, `submitError` — not cart/items (TanStack Query).
6. **Schemas** stay in `schemas/`; **never** inline `z.object` in components.
7. **Types** in `types/checkout.types.ts` — one file per domain; sub-features don't get separate type files.
8. **Images** — `AppImage` + `IMAGE_FALLBACK`, not raw `next/image` for catalog URLs.

## Form context pattern

```tsx
// checkout.domain.tsx
const form = useCheckoutForm({ onSubmit: submitOrder });
return (
  <form.AppForm>
    <form.Root>...</form.Root>
    <CheckoutMobileActionBar ... />
  </form.AppForm>
);

// Any child inside AppForm
const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
```

## Adding a checkout feature

1. Types → `types/checkout.types.ts`
2. Zod (if form) → `schemas/`
3. Pure logic → `lib/`
4. Hook (API + state) → `hooks/use-<feature>.ts`
5. Fields → `sections/`
6. UI shell → `components/` or `containers/`
7. i18n → `messages/{en,fa,es}.json` under `checkout.*`
8. `pnpm check`

## Reference implementation (address edit)

```
types/checkout.types.ts          # CheckoutAddressEditDialogProps, etc.
schemas/checkout-address-edit.schema.ts
lib/checkout-address-edit.ts
hooks/use-checkout-address-edit.ts
sections/checkout-address-edit-form.tsx
components/checkout-address-edit-dialog.tsx   # thin
```

## Imports

Prefer direct paths (not barrel) for new code:

```ts
import { checkoutDefaultValues } from '@/domains/checkout/schemas/checkout.schema';
import type { CheckoutFormValues } from '@/domains/checkout/types/checkout.types';
import { getCheckoutStepErrors } from '@/domains/checkout/lib/checkout-validation';
```

Legacy `checkout.schema.ts` at domain root re-exports for backward compatibility.

## Before done

- `pnpm check` on touched files
- No file > ~200 lines without split
- Manual smoke: shipping → review → place order, mobile drawer, address pick/edit/delete
