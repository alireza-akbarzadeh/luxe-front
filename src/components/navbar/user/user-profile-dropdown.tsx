import { UserProfileContent } from '@/components/navbar/user/user-profile-content';
import { UserProfileHeader } from '@/components/navbar/user/user-profile-header';
import { UserProfileTrigger } from '@/components/navbar/user/user-profile-trigger';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function UserProfileDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserProfileTrigger />
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end' sideOffset={14} className='w-85 rounded-3xl p-0'>
        <UserProfileHeader />
        <UserProfileContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
