---
name: admin-forms
description: >
  Use when implementing or changing luxe-front forms — useAppForm, Zod schemas,
  field validation, submit handlers, create/edit flows, mappers to API payloads,
  or json-field config editors. Apply when the user mentions saving, editing records,
  required fields, or validation errors, even without saying useAppForm. Do not use
  for list/table pages, layout-only JSX changes, backend DTOs, or Orval regeneration.
paths:
  - "src/domains/**/schemas/**/*.ts"
  - "src/domains/**/*form*.tsx"
  - "src/components/forms/**/*.ts"
  - "src/components/forms/**/*.tsx"
---

# Admin forms

**Default reference:** `src/domains/discounts/sections/discount-form.tsx` (validation + mapper + mutation).

## Pattern

```tsx
const form = useAppForm({
  defaultValues: schema.parse({}),
  validators: { onChange: schema, onSubmit: schema },
  onSubmit: async ({ value }) => {
    await mutation.mutateAsync({ data: mapFormToRequest(value) });
    toast.success('Saved');
    void queryClient.invalidateQueries({ queryKey: getGetItemsQueryKey() });
  },
});

return (
  <form.AppForm>
    <form.Root onSubmit={(e) => { e.preventDefault(); void form.handleSubmit(); }}>
      <form.AppField name="name" children={(field) => (
        <field.TextField label="Name" required />
      )} />
    </form.Root>
  </form.AppForm>
);
```

Use `field.TextField`, `field.NumberField`, `field.TextArea`, etc. — not raw `<input>`.

## Gotchas

- **Never `useForm` from `@tanstack/react-form` directly** — always `useAppForm`.
- **Zod schemas are form-only.** Map to Orval request types via `lib/*-mapper.ts` (see `brand-mapper.ts`, `coupon-mapper`).
- **Edit mode:** fetch with Orval `useGet*Id`, reset form in `useEffect` when entity loads (see `brand-form.tsx`).
- **JSON config fields:** use `src/components/editor/json-field.tsx`.
- **Layout around fields:** `/layout-typography` — Flex/Grid, not div flex/grid.
- **Errors:** toast via `sonner` for submit failures; field errors from form validators.

## Validate

```bash
pnpm check
```

- [ ] `z.infer<typeof schema>` for form values
- [ ] Mutation invalidates `get*QueryKey()`
- [ ] Submit button reflects `isPending`
