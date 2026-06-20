---
name: layout-typography
description: >
  Use when building or editing luxe-front JSX layout or text — page sections, form
  shells, toolbars, columns, stacks, headings, labels, or helper copy. Apply when
  the user would otherwise use div/span with flex, grid, gap, items-center, text-sm,
  text-muted-foreground, or font-* classes; prefer Grid, Flex, Typography, Box from
  @/components/ui/. Apply even for "make this section look better" or spacing fixes.
  Do not use for form validation, Orval/api:gen, or DataTable column wiring.
paths:
  - "src/domains/**/*.tsx"
  - "src/components/**/*.tsx"
  - "src/app/**/*.tsx"
---

# Layout & typography

**Default:** copy layout/text patterns from the nearest domain file, then apply the rules below.

## Rules (prescriptive)

1. **1D layout** → `Flex` + `FlexItem` — not `<div className="flex …">`
2. **2D layout** → `Grid` + `GridItem` — not `<div className="grid …">`
3. **Text** → `Typography.*` or `Text` — not `<h*>` / `<p>` / `<span>` with `text-*` / `font-*` classes
4. **Gap/padding** → `gap={4}`, `spacing={6}`, `p={4}` props — not `className="gap-4"` when the component supports it
5. **Block shell** (position/overflow/margin only) → `Box` — not `Box display="flex"` or `display="grid"`; use Flex/Grid

## Default example

```tsx
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';

<Flex direction="column" spacing={6}>
  <Typography.H3>Section title</Typography.H3>
  <Grid template="form" gap={4}>
    <GridItem>…</GridItem>
  </Grid>
</Flex>
```

Canonical references: `src/domains/brands/sections/brand-form.tsx`, `src/domains/discounts/sections/discount-form.tsx`.

## Gotchas

- **`Grid template` vs `cols`:** `template`, `autoFit`, and `autoFill` disable `cols`. Pick one approach.
- **Responsive columns:** prefer `template="form"` | `"sidebar"` | `"stats"`. If no preset fits, keep `<Grid>` and add `className="sm:grid-cols-2"` — still not a raw div.
- **`Flex` default direction is `column`**, not row. Set `direction="row"` explicitly for toolbars.
- **`spacing` and `gap` are aliases** on Flex; both map to SpacingKey (`src/components/theme/spacing.ts`).
- **Form field labels** come from `field.TextField label=…` — do not duplicate with Typography unless it's a section heading outside the field.
- **Legacy code** still has `<h3 className="text-sm font-medium">` — replace when touching that file; don't copy the pattern into new code.

## Allowed (do not refactor away)

- shadcn: `Card`, `CardTitle`, `CardDescription`, `Button`, `Input`, …
- Semantic/third-party: `<form>`, `<table>`, Next `<Image>`, hidden file inputs
- One-off bordered preview shells (logo box in `brand-form.tsx`)
- `domains/*/components/ui/` vendor/home primitives

## Validate before done

```bash
pnpm check
```

Self-check on changed files:

- [ ] No new `className="flex|grid|inline-flex|inline-grid"` on `<div>`
- [ ] No new headings/body text with manual `text-*` / `font-*` Tailwind
- [ ] Layout gaps use SpacingKey props where available

## More detail

Read [references/components.md](references/components.md) when choosing Grid templates, Typography variants, or Box vs Flex/Grid.
