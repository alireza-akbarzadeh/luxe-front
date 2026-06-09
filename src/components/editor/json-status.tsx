export function JsonStatus({ error }: { error: string | null }) {
  if (!error) {
    return <div className='px-2 py-1 text-xs text-green-600'>✓ Valid JSON</div>;
  }

  return <div className='px-2 py-1 text-xs text-red-600'>✕ {error}</div>;
}
