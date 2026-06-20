# Skill description eval queries

Test whether skill descriptions trigger correctly in Cursor Agent.

## Files

- `eval-queries.json` — labeled prompts with `should_trigger`, `split` (train/validation), and optional `note` for near-misses

## Manual sanity check

In Agent chat, try 2–3 **should_trigger** and 2–3 **should_not_trigger** prompts from the JSON. In **Cursor Settings → Rules**, confirm the expected skill appears under active context, or type `/skill-name` to force-load and compare behavior.

## Optimization loop (from agentskills.io)

1. Run train-set queries; note false positives/negatives
2. Revise only the `description` field in `SKILL.md` — generalize, don't copy query keywords
3. Re-run validation set to check generalization
4. Keep descriptions under **1024 characters**

## Boundaries to protect

| Skill | Should not steal from |
|-------|----------------------|
| `api-gen` | `new-admin-domain`, backend swagger authoring |
| `layout-typography` | `admin-forms`, DataTable |
| `new-admin-domain` | storefront routes, `api-gen` alone |
| `admin-forms` | `layout-typography`, backend DTOs |
| `new-api-entity` | `add-api-endpoint` |
| `add-api-endpoint` | `new-api-entity`, frontend Orval |

## Split usage

- **train (~60%)** — use failures to edit descriptions
- **validation (~40%)** — hold out until an iteration is done; score pass rate before merging description changes
