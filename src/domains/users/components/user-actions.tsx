import { IconMoodShare } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { GetUsers200DataUsersItem } from '~/src/services/-users-get.schemas';

interface UserActionsProps {
  user: GetUsers200DataUsersItem;
}

export function UserActions({ user }: UserActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='hover:bg-muted h-8 w-8 p-0 focus-visible:ring-0'>
          <IconMoodShare className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='border-border/50 w-72 rounded-2xl p-2 shadow-xl'>
        <ActionHeader userId={user.id as number} />

        {/* <QuickLinks user={user} />

        {user.notes && <AdminNotes notes={user.notes} />}

        <DropdownMenuSeparator className='my-2' />

        <OrgDetails organization={user.organization} manager={user.manager} />

        <DropdownMenuSeparator className='my-2' />

        <SuspendAction userId={user.id} /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ActionHeaderProps {
  userId: number;
}

export function ActionHeader({ userId }: ActionHeaderProps) {
  return (
    <div className='mb-1 flex flex-col px-2 py-2'>
      <span className='text-muted-foreground text-[10px] leading-none font-black tracking-widest uppercase'>
        Management Console
      </span>
      <span className='text-primary mt-1.5 truncate font-mono text-[11px] font-bold'>
        ID: {userId}
      </span>
    </div>
  );
}
