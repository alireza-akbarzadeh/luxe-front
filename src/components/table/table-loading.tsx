// table-loading.tsx
import { Skeleton } from '../ui/skeleton';

export const TableLoading = ({
  columnsCount,
  rowsCount = 8
}: {
  columnsCount: number;
  rowsCount?: number;
}) => {
  const safeColumns = Math.max(1, columnsCount);
  const safeRows = Math.max(1, rowsCount);
  const gridTemplate = `repeat(${safeColumns}, minmax(0, 1fr))`;

  return (
    <div className='border-border/40 bg-card/20 w-full overflow-hidden rounded-xl border backdrop-blur-2xl'>
      {/* Header */}
      <div
        className='border-border/40 bg-muted/50 border-b px-5 py-4'
        style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '1rem' }}
      >
        {Array.from({ length: safeColumns }).map((_, i) => (
          <Skeleton key={`h-${i}`} className='h-3 w-20 rounded-full' />
        ))}
      </div>

      {/* Rows */}
      <div className='divide-border/10 divide-y'>
        {Array.from({ length: safeRows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className='px-5 py-4'
            style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '1rem' }}
          >
            {Array.from({ length: safeColumns }).map((_, colIdx) => (
              <Skeleton
                key={`c-${rowIdx}-${colIdx}`}
                className='h-4 w-full rounded-md'
                style={{ animationDelay: `${(rowIdx * safeColumns + colIdx) * 30}ms` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
