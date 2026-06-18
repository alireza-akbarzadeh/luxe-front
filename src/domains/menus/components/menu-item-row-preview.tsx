import { Badge } from '@/components/ui/badge';
import { ICON_MAP } from '@/domains/admin/data';
import type { ModelsMenuItem } from '@/services/-admin-menu-items-get.schemas';

export function MenuItemRowPreview({ item, depth }: { item: ModelsMenuItem; depth: number }) {
  const Icon = item.icon ? ICON_MAP[item.icon as keyof typeof ICON_MAP] : null;

  return (
    <div className='flex min-w-0 flex-1 items-center gap-3' style={{ paddingLeft: depth * 16 }}>
      {Icon ? <Icon className='text-muted-foreground h-4 w-4 shrink-0' /> : null}
      <div className='min-w-0'>
        <p className='truncate text-sm font-medium'>{item.label}</p>
        <p className='text-muted-foreground truncate text-[11px]'>{item.href || 'No route'}</p>
      </div>
      {item.permission ? (
        <Badge variant='outline' className='hidden text-[10px] sm:inline-flex'>
          {item.permission}
        </Badge>
      ) : null}
    </div>
  );
}
