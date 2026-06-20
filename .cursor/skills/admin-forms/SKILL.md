---
name: admin-forms
description: Builds admin forms with useAppForm, Zod, and Orval mutations. Use when adding or editing form fields, validation, or submit handlers in src/domains/ or src/components/forms/.
paths:
  - "src/domains/**/schemas/**/*.ts"
  - "src/domains/**/*form*.tsx"
  - "src/components/forms/**/*.ts"
  - "src/components/forms/**/*.tsx"
---

# Luxe Front — Admin forms

## Stack

- Hook: `src/components/forms/useAppForm.ts` (never raw `@tanstack/react-form`)
- Validation: Zod v4 + `@tanstack/zod-adapter`
- Submit: Orval `useMutation` hooks
- Feedback: `sonner` toast; inline field errors from form state

## Pattern

```tsx
const form = useAppForm({
  defaultValues: schema.parse({}),
  validators: { onSubmit: schema },
  onSubmit: async ({ value }) => {
    await mutation.mutateAsync({ data: value });
    toast.success('Saved');
    await queryClient.invalidateQueries({ queryKey: getGetItemsQueryKey() });
  },
});
```

Use shared field components from `src/components/forms/` (Input, Select, etc.) — not raw `<input>`.

## Schema location

- Form validation only → `src/domains/<domain>/schemas/` or `src/schemas/`
- API request/response types → Orval `*.schemas.ts` (generated)

## Validation tips

- Prefer `safeParse` in `validators.onChange` for live feedback (see `discount-form.tsx`)
- Map API validation errors to field errors when the backend returns structured errors
- Show `isPending` / `isSubmitting` on the submit button

## JSON / rich fields

For structured JSON config fields, use `src/components/editor/json-field.tsx` when appropriate.

## Checklist

- [ ] Schema infers type with `z.infer<typeof schema>`
- [ ] Mutation invalidates relevant `get*QueryKey()`
- [ ] Loading and error states handled
- [ ] `pnpm check` passes
