'use client';

const zones = [
  { zone: 'United States', standard: '3–5 days', express: '1–2 days', free: '$150+' },
  { zone: 'Canada', standard: '4–7 days', express: '2–3 days', free: '$200+' },
  { zone: 'United Kingdom', standard: '4–7 days', express: '2–3 days', free: '£150+' },
  { zone: 'European Union', standard: '5–8 days', express: '2–4 days', free: '€175+' },
  { zone: 'Asia & Pacific', standard: '6–10 days', express: '3–5 days', free: '$250+' },
  { zone: 'Rest of World', standard: '7–14 days', express: '4–7 days', free: '$300+' }
];

export function EstimateDeliveryRegion() {
  return (
    <div className='border-border/60 bg-card/40 overflow-hidden rounded-3xl border backdrop-blur'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-muted/40 text-muted-foreground text-xs tracking-wider uppercase'>
            <tr>
              <th className='px-6 py-4 text-left font-semibold'>Region</th>
              <th className='px-6 py-4 text-left font-semibold'>Standard</th>
              <th className='px-6 py-4 text-left font-semibold'>Express</th>
              <th className='px-6 py-4 text-left font-semibold'>Free over</th>
            </tr>
          </thead>
          <tbody className='divide-border/60 divide-y'>
            {zones.map((z) => (
              <tr key={z.zone} className='hover:bg-muted/30 transition-colors'>
                <td className='px-6 py-4 font-medium'>{z.zone}</td>
                <td className='text-muted-foreground px-6 py-4'>{z.standard}</td>
                <td className='text-muted-foreground px-6 py-4'>{z.express}</td>
                <td className='text-muted-foreground px-6 py-4'>{z.free}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
