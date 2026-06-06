import React from 'react';

export interface MonthlyDataPoint {
  month: string;
  revenue: number;
  orders: number;
  returns: number;
}

export interface StatusDistPoint {
  name: string;
  value: number;
  fill: string;
}

export interface TopProductItem {
  name: string;
  revenue: number;
  trend: number;
}

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className='bg-card border-border/40 rounded-2xl border p-6 shadow-sm'>
      <div className='mb-5'>
        <h3 className='text-muted-foreground text-[10px] font-black tracking-widest uppercase'>
          {title}
        </h3>
        {subtitle && <p className='text-muted-foreground mt-0.5 text-xs font-medium'>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
