import type { ModelsCategory } from '@/services/-categories-get.schemas';

export function buildCategoryTree(flatList: ModelsCategory[]): ModelsCategory[] {
  const map = new Map<number, ModelsCategory>();
  const roots: ModelsCategory[] = [];

  flatList.forEach((cat) => {
    map.set(cat.id!, { ...cat, children: [] });
  });

  flatList.forEach((cat) => {
    const node = map.get(cat.id!);
    if (cat.parent_id && map.has(cat.parent_id)) {
      const parent = map.get(cat.parent_id)!;
      parent.children = parent.children || [];
      parent.children.push(node!);
    } else {
      roots.push(node!);
    }
  });

  return roots;
}
