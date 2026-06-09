import { Skeleton } from '../ui/skeleton';

export const TableLoading = ({
  columnsCount,
  rowsCount = 5
}: {
  columnsCount: number;
  rowsCount?: number;
}) => {
  const safeColumns = Math.max(1, columnsCount);
  const safeRows = Math.max(1, rowsCount);
  const gridTemplate = `repeat(${safeColumns}, minmax(0, 1fr))`;

  return (
    <div className='border-border bg-background w-full overflow-hidden rounded-lg border'>
      {/* Header */}
      <div
        className='border-border bg-muted/30 border-b px-4 py-3'
        style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '1rem' }}
      >
        {Array.from({ length: safeColumns }).map((_, i) => (
          <Skeleton key={`h-${i}`} className='h-4 w-24' />
        ))}
      </div>

      {/* Rows */}
      <div className='divide-border divide-y'>
        {Array.from({ length: safeRows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className='px-4 py-3'
            style={{ display: 'grid', gridTemplateColumns: gridTemplate, gap: '1rem' }}
          >
            {Array.from({ length: safeColumns }).map((_, colIdx) => (
              <Skeleton key={`c-${rowIdx}-${colIdx}`} className='h-5 w-full' />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
