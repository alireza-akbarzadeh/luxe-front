export type BrandsMarqueeItem = {
  key: string;
  name: string;
};

/** Two identical sequences for a seamless -50% CSS translate loop. */
function buildMarqueeLoop(items: BrandsMarqueeItem[]): BrandsMarqueeItem[] {
  return [...items, ...items];
}

/** Decorative single-row brand marquee — GPU translate only, hidden from assistive tech. */
export function BrandsMarqueeTrack({ items }: { items: BrandsMarqueeItem[] }) {
  const visibleItems = items.filter((item) => item.name.trim().length > 0);

  if (visibleItems.length === 0) {
    return null;
  }

  const loop = buildMarqueeLoop(visibleItems);

  return (
    <div className='brands-marquee-clip w-full overflow-hidden' aria-hidden>
      <div className='brands-marquee-track'>
        {loop.map((brand, index) => (
          <span key={`${brand.key}-${index}`} className='brands-marquee-item'>
            {brand.name}
          </span>
        ))}
      </div>
    </div>
  );
}
