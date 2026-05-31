import type { Metadata } from 'next';

import { SectionHeading, SectionShell } from '@/domains/support/components/section-shell';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';

export const metadata: Metadata = {
  title: 'Size Guide — Luxe Marketplace',
  description: 'International size conversions for women, men, footwear and accessories.'
};
const women = [
  ['XS', '0', '4', '32', '36'],
  ['S', '2–4', '6–8', '34–36', '38–40'],
  ['M', '6–8', '10–12', '38–40', '42–44'],
  ['L', '10–12', '14–16', '42–44', '46–48'],
  ['XL', '14–16', '18–20', '46–48', '50–52']
] as const;
const men = [
  ['XS', '34', '34', '44'],
  ['S', '36', '36', '46'],
  ['M', '38–40', '38–40', '48–50'],
  ['L', '42–44', '42–44', '52–54'],
  ['XL', '46–48', '46–48', '56–58'],
  ['XXL', '50–52', '50–52', '60–62']
] as const;
const shoes = [
  ['5', '35', '2.5', '22.5'],
  ['6', '36', '3.5', '23.5'],
  ['7', '37–38', '4.5', '24.5'],
  ['8', '38–39', '5.5', '25.5'],
  ['9', '39–40', '6.5', '26.5'],
  ['10', '40–41', '7.5', '27.5'],
  ['11', '42', '8.5', '28.5'],
  ['12', '43', '9.5', '29.5']
] as const;

interface SizeTableProps {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
}

function SizeTable({ headers, rows }: SizeTableProps) {
  return (
    <div className='border-border/60 bg-card/40 overflow-hidden rounded-3xl border backdrop-blur'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-muted/40 text-muted-foreground text-xs tracking-wider uppercase'>
            <tr>
              {headers.map((h) => (
                <th key={h} className='px-6 py-4 text-left font-semibold'>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='divide-border/60 divide-y'>
            {rows.map((row, i) => (
              <tr key={i} className='hover:bg-muted/30 transition-colors'>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={
                      j === 0 ? 'px-6 py-4 font-medium' : 'text-muted-foreground px-6 py-4'
                    }
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default function SizeGuidePage() {
  return (
    <main className='pb-24'>
      <SupportPageHero
        eyebrow='Size Guide'
        title='Find your perfect fit'
        description='Universal conversions across US, UK, EU and JP sizing. When in doubt, size up — most pieces are designed for a relaxed fit.'
        breadcrumbs={[
          { name: 'Home', href: '/' },
          { name: 'Help', href: '/help' },
          { name: 'Size Guide' }
        ]}
      />
      <SectionShell size='md' className='mt-16'>
        <SectionHeading eyebrow='Women' title="Women's apparel" />
        <SizeTable headers={['Size', 'US', 'UK', 'EU', 'IT']} rows={women} />
      </SectionShell>
      <SectionShell size='md' className='mt-16'>
        <SectionHeading eyebrow='Men' title="Men's apparel" />
        <SizeTable headers={['Size', 'US', 'UK', 'EU']} rows={men} />
      </SectionShell>
      <SectionShell size='md' className='mt-16'>
        <SectionHeading eyebrow='Footwear' title='Shoes — unisex conversion' />
        <SizeTable headers={['US Women', 'EU', 'UK', 'JP (cm)']} rows={shoes} />
      </SectionShell>
      <SectionShell size='md' className='mt-16'>
        <div className='border-border/60 from-card via-card to-muted/40 rounded-3xl border bg-linear-to-br p-8 md:p-10'>
          <h3 className='text-xl font-semibold tracking-tight md:text-2xl'>How to measure</h3>
          <ul className='text-muted-foreground mt-5 space-y-3 text-sm leading-relaxed'>
            <li>
              <strong className='text-foreground'>Bust / Chest:</strong> Measure around the fullest
              part, keeping the tape parallel to the floor.
            </li>
            <li>
              <strong className='text-foreground'>Waist:</strong> Around the narrowest part of your
              natural waistline.
            </li>
            <li>
              <strong className='text-foreground'>Hips:</strong> Around the fullest part of your
              hips, about 20cm below the waist.
            </li>
            <li>
              <strong className='text-foreground'>Inseam:</strong> From the top of the inner thigh
              down to your ankle bone.
            </li>
          </ul>
        </div>
      </SectionShell>
    </main>
  );
}
