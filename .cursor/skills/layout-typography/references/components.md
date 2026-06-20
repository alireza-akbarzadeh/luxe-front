# Layout & typography — component reference

Load when you need prop names, templates, or variant mapping.

## Flex

```tsx
import { Flex } from '@/components/ui/flex';
import { FlexItem } from '@/components/ui/flex-item';
```

| Need | Prop |
|------|------|
| Row / column | `direction="row"` \| `"column"` (default: column) |
| Gap | `gap`, `spacing`, `gapX`, `gapY` |
| Align / justify | `align`, `justify`, or `center` |
| Full width / height | `fullWidth`, `fullHeight` |
| Wrap | `wrap="wrap"` |
| Child flex | `FlexItem grow={1} shrink={0} basis="1/2"` |

## Grid

```tsx
import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
```

| Need | Prop |
|------|------|
| Fixed columns | `cols={1}` … `cols={12}` |
| Presets | `template="form"` \| `"sidebar"` \| `"stats"` \| `"1-2"` \| `"1-3"` \| `"2-4"` |
| Auto columns | `autoFit="md"` \| `autoFill="lg"` |
| Span | `GridItem colSpan={2}` `rowSpan={2}` `colStart={3}` |

## Typography

```tsx
import { Typography, Text } from '@/components/ui/typography';
```

| Need | Component |
|------|-----------|
| Headings | `Typography.H1`–`H6` |
| Body | `Typography.P` |
| Secondary | `Typography.Muted`, `Subtle`, `Lead` |
| Label (non-field) | `Typography.Label` |
| Link | `Typography.Link` |
| Custom | `Text variant="small" tone="muted" truncate numeric` |

Tone/weight/align via props — not `className="text-muted-foreground"`.

## Box

For position/overflow/margin/padding wrappers only:

```tsx
<Box position="relative" overflow="hidden" p={4} mb={6}>…</Box>
```

Do not use `Box display="flex"` or `display="grid"`.

## Do / don't matrix

| Avoid | Use |
|-------|-----|
| `<div className="flex …">` | `<Flex …>` |
| `<div className="grid …">` | `<Grid …>` |
| `<div className="col-span-2">` | `<GridItem colSpan={2}>` |
| `<h3 className="text-sm font-medium">` | `<Typography.H3>` or `<Text variant="small" weight="medium">` |
| `<p className="text-muted-foreground text-sm">` | `<Typography.Muted>` |
