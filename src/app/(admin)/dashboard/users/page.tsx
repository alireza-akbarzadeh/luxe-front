'use client';

import { UserManagementTable } from '~/src/domains/users/sections/user-table';

export default function UserManagementPage() {
  return (
    <div className='relative min-h-screen space-y-6'>
      {/* 2. Quick Summary Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4'>
        {/* <UserStatCard label='Total Users' value={stats.totalUsers.toLocaleString()} change='+12%' />
        <UserStatCard label='Active Users' value={stats.activeUsers.toLocaleString()} pulse />
        <UserStatCard
          label='Premium Users'
          value={stats.premiumUsers.toLocaleString()}
          color='text-emerald-500'
        />
        <UserStatCard
          label='New This Month'
          value={stats.newUsersThisMonth.toLocaleString()}
          color='text-blue-500'
        /> */}
      </div>

      {/* 3. The Main Table Area */}
      <div className='border-border/40 bg-card/30 overflow-hidden rounded-[2.5rem] border shadow-2xl shadow-black/5 backdrop-blur-xl'>
        <UserManagementTable />
      </div>
    </div>
  );
}
