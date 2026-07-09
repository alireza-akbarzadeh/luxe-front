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

  for (const node of sortCategoriesByOrder(nodes)) {
    result.push({ category: node, depth });
    if (node.children?.length) {
      result.push(...flattenCategoryTree(node.children, depth + 1));
    }
  }

  return result;
}

/** Sorts categories by persisted sort_order then id. */
export function sortCategoriesByOrder(categories: ModelsCategory[]): ModelsCategory[] {
  return [...categories].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || (a.id ?? 0) - (b.id ?? 0)
  );
}

/** Returns direct siblings for a parent id (null = top-level). */
export function getCategorySiblings(
  roots: ModelsCategory[],
  parentId: number | null
): ModelsCategory[] {
  if (parentId == null) {
    return sortCategoriesByOrder(roots);
  }

  function findNode(nodes: ModelsCategory[]): ModelsCategory | undefined {
    for (const node of nodes) {
      if (node.id === parentId) return node;
      const nested = findNode(node.children ?? []);
      if (nested) return nested;
    }
    return undefined;
  }

  const parent = findNode(roots);
  return sortCategoriesByOrder(parent?.children ?? []);
}
