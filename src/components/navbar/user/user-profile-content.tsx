import { AuthMenuItem } from './auth-menu-item';
import { MenuRow } from './menu-row';
import { ThemeMenuItem } from './theme-menu-item';
import { profileMenuItems } from './user-menu-data';

export function UserProfileContent() {
  return (
    <div className='p-2'>
      {profileMenuItems.map((item) => {
        const Icon = item.icon;

        return (
          <MenuRow
            key={item.title}
            icon={<Icon size={18} />}
            title={item.title}
            subtitle={item.subtitle}
          />
        );
      })}

      <ThemeMenuItem />
      <AuthMenuItem />
    </div>
  );
}
