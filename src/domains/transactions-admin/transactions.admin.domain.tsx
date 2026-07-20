'use client';

import { Flex } from '@/components/ui/flex';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text, Typography } from '@/components/ui/typography';
import { useTransactionsQueryState } from '@/domains/transactions-admin/hooks/use-transactions-query';
import { PaymentsTable } from '@/domains/transactions-admin/sections/payments-table';
import { TransactionsKPICards } from '@/domains/transactions-admin/sections/transactions-kpi-cards';
import { WalletTransactionsTable } from '@/domains/transactions-admin/sections/wallet-table';
import type { TransactionsTab } from '@/domains/transactions-admin/transactions.schema';

export function TransactionsAdminDomain() {
  const { tab, setTab } = useTransactionsQueryState();

  return (
    <Flex direction='column' className='gap-6'>
      <div>
        <Typography.H3>Transactions</Typography.H3>
        <Text variant='muted' className='mt-1'>
          Monitor order payments and wallet ledger activity across the platform.
        </Text>
      </div>

      <TransactionsKPICards />

      <Tabs
        value={tab}
        onValueChange={(value) => void setTab(value as TransactionsTab)}
        className='gap-4'
      >
        <TabsList>
          <TabsTrigger value='payments'>Order payments</TabsTrigger>
          <TabsTrigger value='wallet'>Wallet ledger</TabsTrigger>
        </TabsList>

        <TabsContent value='payments'>
          <PaymentsTable />
        </TabsContent>

        <TabsContent value='wallet'>
          <WalletTransactionsTable />
        </TabsContent>
      </Tabs>
    </Flex>
  );
}
