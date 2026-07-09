import type { ModelsCategory } from '@/services/-categories-get.schemas';

/** Collects all descendant category IDs including the root node. */
export function collectCategoryDescendantIds(category: ModelsCategory): number[] {
  const ids: number[] = [];

  function walk(node: ModelsCategory) {
    if (node.id != null) ids.push(node.id);
    node.children?.forEach(walk);
  }

  walk(category);
  return ids;
}

/** Returns true when `targetParentId` would create a cycle or self-parent. */
export function isInvalidCategoryParentMove(
  category: ModelsCategory,
  targetParentId: number | null
): boolean {
  if (targetParentId == null) return false;
  if (category.id === targetParentId) return true;
  return collectCategoryDescendantIds(category).includes(targetParentId);
}

/** Flattens a nested category tree into rows with depth for mobile display. */
export function flattenCategoryTree(
  nodes: ModelsCategory[],
  depth = 0
): Array<{ category: ModelsCategory; depth: number }> {
  const result: Array<{ category: ModelsCategory; depth: number }> = [];

  for (const node of nodes) {
    result.push({ category: node, depth });
    if (node.children?.length) {
      result.push(...flattenCategoryTree(node.children, depth + 1));
    }
  }

  return result;
}
