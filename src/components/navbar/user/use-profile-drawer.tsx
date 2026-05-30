import { UserProfileContent } from '@/components/navbar/user/user-profile-content';
import { UserProfileHeader } from '@/components/navbar/user/user-profile-header';
import { UserProfileTrigger } from '@/components/navbar/user/user-profile-trigger';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

export function UserProfileDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <UserProfileTrigger />
      </DrawerTrigger>

      <DrawerContent variant='ios' radius='full' showHandle>
        <UserProfileHeader />
        <UserProfileContent />
      </DrawerContent>
    </Drawer>
  );
}
