import type { ModelsMenuItem } from '@/services/-admin-menu-items-get.schemas';

/** Build a parent-child tree for items belonging to one menu group. */
export function buildGroupItemTree(items: ModelsMenuItem[], groupId: number): ModelsMenuItem[] {
  const groupItems = items.filter((item) => item.group_id === groupId);
  const byId = new Map<number, ModelsMenuItem>();

  for (const item of groupItems) {
    if (item.id != null) {
      byId.set(item.id, { ...item, children: [] });
    }
  }

  const roots: ModelsMenuItem[] = [];

  for (const item of byId.values()) {
    const parentId = item.parent_id;
    if (parentId && byId.has(parentId)) {
      const parent = byId.get(parentId)!;
      parent.children = [...(parent.children ?? []), item];
    } else {
      roots.push(item);
    }
  }

  const sortByOrder = (nodes: ModelsMenuItem[]) =>
    [...nodes].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

  const sortTree = (nodes: ModelsMenuItem[]): ModelsMenuItem[] =>
    sortByOrder(nodes).map((node) => ({
      ...node,
      children: node.children?.length ? sortTree(node.children) : []
    }));

  return sortTree(roots);
}

/** Flatten tree for parent picker options (excludes current item and descendants). */
export function flattenMenuItems(
  items: ModelsMenuItem[],
  depth = 0,
  excludeId?: number
): Array<{ id: number; label: string; depth: number }> {
  const rows: Array<{ id: number; label: string; depth: number }> = [];

  for (const item of items) {
    if (item.id == null || item.id === excludeId) continue;
    rows.push({ id: item.id, label: item.label ?? 'Untitled', depth });
    if (item.children?.length) {
      const childExclude = isDescendant(item, excludeId) ? excludeId : undefined;
      rows.push(...flattenMenuItems(item.children, depth + 1, childExclude));
    }
  }

  return rows;
}

function isDescendant(node: ModelsMenuItem, targetId?: number): boolean {
  if (!targetId) return false;
  if (node.id === targetId) return true;
  return (node.children ?? []).some((child) => isDescendant(child, targetId));
}
