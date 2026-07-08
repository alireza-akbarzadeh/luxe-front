import { cn } from '@/lib/utils';

interface DashboardSparklineProps {
  data: number[];
  color?: string;
  className?: string;
}

/** Minimal SVG sparkline for KPI cards. */
export function DashboardSparkline({
  data,
  color = 'var(--dashboard-teal)',
  className
}: DashboardSparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 32;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio='none'
      className={cn('h-8 w-full', className)}
      aria-hidden
    >
      <polyline
        fill='none'
        stroke={color}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        points={points}
      />
    </svg>
  );
}
