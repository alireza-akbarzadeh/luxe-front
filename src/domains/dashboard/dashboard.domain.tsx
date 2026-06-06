'use client';
import { IconArrowDownRight, IconArrowUpRight, IconPackage } from '@tabler/icons-react';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis
} from 'recharts';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  categoryConfig,
  categoryData,
  channelConfig,
  channelData,
  goals,
  recentOrders,
  revenueConfig,
  revenueData,
  stats,
  topProducts,
  trafficConfig,
  trafficData
} from '@/domains/dashboard/dashboard-config';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Fulfilled: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Refunded: 'bg-rose-500/10 text-rose-600 border-rose-500/20'
  };
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

export function DashboardDomain() {
  return (
    <main className='bg-muted/30 min-h-screen p-2 md:p-3'>
      <div className='mx-auto w-full max-w-7xl space-y-8'>
        <header className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
          <div>
            <Badge variant='secondary' className='mb-3'>
              Live overview
            </Badge>
            <h1 className='text-3xl font-semibold tracking-tight md:text-4xl'>
              Commerce dashboard
            </h1>
            <p className='text-muted-foreground mt-1 text-sm'>
              Real-time pulse on revenue, fulfilment, and customer behaviour across all storefronts.
            </p>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-sm'>
            <span className='inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
            Updated just now · Period: last 30 days
          </div>
        </header>

        <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
          {stats.map((s) => (
            <Card key={s.label} className='overflow-hidden'>
              <CardHeader className='pb-2'>
                <div className='flex items-center justify-between'>
                  <CardDescription className='text-xs tracking-widest uppercase'>
                    {s.label}
                  </CardDescription>
                  <div className='bg-muted flex h-8 w-8 items-center justify-center rounded-lg'>
                    <s.icon className='text-muted-foreground h-4 w-4' />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-semibold tracking-tight'>{s.value}</div>
                <div className='mt-2 flex items-center gap-2 text-xs'>
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium ${
                      s.up ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                    }`}
                  >
                    {s.up ? (
                      <IconArrowUpRight className='h-3 w-3' />
                    ) : (
                      <IconArrowDownRight className='h-3 w-3' />
                    )}
                    {Math.abs(s.delta)}%
                  </span>
                  <span className='text-muted-foreground'>{s.hint}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className='grid gap-4 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <CardTitle>Revenue & orders</CardTitle>
                  <CardDescription>Monthly performance across the last 12 months</CardDescription>
                </div>
                <Tabs defaultValue='12m' className='hidden md:block'>
                  <TabsList>
                    <TabsTrigger value='7d'>7d</TabsTrigger>
                    <TabsTrigger value='30d'>30d</TabsTrigger>
                    <TabsTrigger value='12m'>12m</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueConfig} className='h-75 w-full'>
                <AreaChart data={revenueData} margin={{ left: 4, right: 12, top: 8 }}>
                  <defs>
                    <linearGradient id='fillRevenue' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stopColor='var(--color-revenue)' stopOpacity={0.4} />
                      <stop offset='100%' stopColor='var(--color-revenue)' stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id='fillOrders' x1='0' y1='0' x2='0' y2='1'>
                      <stop offset='0%' stopColor='var(--color-orders)' stopOpacity={0.3} />
                      <stop offset='100%' stopColor='var(--color-orders)' stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray='3 3' />
                  <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} width={40} />
                  <ChartTooltip content={<ChartTooltipContent indicator='dot' />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type='monotone'
                    dataKey='revenue'
                    stroke='var(--color-revenue)'
                    fill='url(#fillRevenue)'
                    strokeWidth={2}
                  />
                  <Area
                    type='monotone'
                    dataKey='orders'
                    stroke='var(--color-orders)'
                    fill='url(#fillOrders)'
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sales by category</CardTitle>
              <CardDescription>Share of revenue · last 30 days</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col items-center'>
              <ChartContainer config={categoryConfig} className='mx-auto h-55 w-full'>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={categoryData}
                    dataKey='value'
                    nameKey='name'
                    innerRadius={55}
                    outerRadius={85}
                    strokeWidth={2}
                  />
                </PieChart>
              </ChartContainer>
              <div className='grid w-full grid-cols-2 gap-2 pt-2 text-sm'>
                {categoryData.map((c) => (
                  <div key={c.name} className='flex items-center gap-2'>
                    <span className='h-2.5 w-2.5 rounded-sm' style={{ background: c.fill }} />
                    <span className='text-muted-foreground'>{c.name}</span>
                    <span className='ml-auto font-medium'>{c.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className='grid gap-4 lg:grid-cols-3'>
          <Card>
            <CardHeader>
              <CardTitle>Traffic this week</CardTitle>
              <CardDescription>Visitors vs. sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={trafficConfig} className='h-55 w-full'>
                <BarChart data={trafficData} margin={{ left: 4, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray='3 3' />
                  <XAxis dataKey='day' tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} width={36} />
                  <ChartTooltip content={<ChartTooltipContent indicator='dashed' />} />
                  <Bar dataKey='visitors' fill='var(--color-visitors)' radius={[6, 6, 0, 0]} />
                  <Bar dataKey='sessions' fill='var(--color-sessions)' radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Refunds trend</CardTitle>
              <CardDescription>Lower is better · 12-month view</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueConfig} className='h-55 w-full'>
                <LineChart data={revenueData} margin={{ left: 4, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray='3 3' />
                  <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} width={36} />
                  <ChartTooltip content={<ChartTooltipContent indicator='line' />} />
                  <Line
                    type='monotone'
                    dataKey='refunds'
                    stroke='var(--color-refunds)'
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acquisition channels</CardTitle>
              <CardDescription>Sessions share by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={channelConfig} className='h-55 w-full'>
                <RadialBarChart
                  data={channelData}
                  innerRadius='30%'
                  outerRadius='100%'
                  startAngle={90}
                  endAngle={-270}
                >
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <RadialBar dataKey='value' background cornerRadius={8} />
                </RadialBarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </section>

        <section className='grid gap-4 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Top selling products</CardTitle>
                  <CardDescription>Best performers in the last 30 days</CardDescription>
                </div>
                <Badge variant='outline' className='gap-1'>
                  <IconPackage className='h-3 w-3' /> Inventory live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className='text-right'>Sold</TableHead>
                    <TableHead className='text-right'>Revenue</TableHead>
                    <TableHead className='text-right'>Stock</TableHead>
                    <TableHead className='text-right'>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((p) => (
                    <TableRow key={p.sku}>
                      <TableCell>
                        <div className='font-medium'>{p.name}</div>
                        <div className='text-muted-foreground text-xs'>{p.sku}</div>
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>{p.sold}</TableCell>
                      <TableCell className='text-right tabular-nums'>
                        ${p.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className='text-right'>
                        <span className={p.stock < 30 ? 'text-amber-600' : 'text-muted-foreground'}>
                          {p.stock}
                        </span>
                      </TableCell>
                      <TableCell className='text-right'>
                        <span
                          className={`inline-flex items-center gap-0.5 text-xs font-medium ${p.trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                        >
                          {p.trend > 0 ? (
                            <IconArrowUpRight className='h-3 w-3' />
                          ) : (
                            <IconArrowDownRight className='h-3 w-3' />
                          )}
                          {Math.abs(p.trend)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quarterly goals</CardTitle>
              <CardDescription>Progress toward Q-end targets</CardDescription>
            </CardHeader>
            <CardContent className='space-y-5'>
              {goals.map((g) => (
                <div key={g.label} className='space-y-2'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='font-medium'>{g.label}</span>
                    <span className='text-muted-foreground'>{g.target}</span>
                  </div>
                  <Progress value={g.value} className='h-2' />
                </div>
              ))}
              <Separator />
              <div className='bg-muted/60 text-muted-foreground rounded-lg p-3 text-xs'>
                Targets recalibrate weekly based on rolling 28-day performance.
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <div>
                  <CardTitle>Recent orders</CardTitle>
                  <CardDescription>Latest activity across all checkouts</CardDescription>
                </div>
                <div className='flex items-center'>
                  <Link
                    href='/dashboard/orders'
                    className='text-xs font-semibold transition-all duration-75 hover:underline'
                  >
                    View All
                  </Link>
                  <Badge variant='secondary'>{recentOrders.length} new</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className='text-right'>Total</TableHead>
                    <TableHead className='text-right'>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className='font-mono text-xs'>{o.id}</TableCell>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-8 w-8'>
                            <AvatarFallback className='text-xs'>
                              {o.customer
                                .split(' ')
                                .map((p) => p[0])
                                .join('')
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-medium'>{o.customer}</div>
                            <div className='text-muted-foreground text-xs'>{o.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='text-right tabular-nums'>
                        ${o.total.toFixed(2)}
                      </TableCell>
                      <TableCell className='text-right'>
                        <StatusBadge status={o.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
