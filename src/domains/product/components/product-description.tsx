import { IconCheck } from '@tabler/icons-react';

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription(props: ProductDescriptionProps) {
  const { description } = props;
  return (
    <>
      <p>{description}</p>
      <p>
        Crafted with meticulous attention to detail, this product represents the pinnacle of modern
        design and functionality. Each piece undergoes rigorous quality control.
      </p>
      <h3 className='font-display text-foreground mt-6 text-xl'>Key features</h3>
      <ul className='space-y-2'>
        {[
          'Premium materials sourced from trusted suppliers',
          'Designed for durability and everyday use',
          'Timeless aesthetic that complements any wardrobe',
          'Eco-friendly packaging and sustainable practices'
        ].map((f) => (
          <li key={f} className='flex gap-2'>
            <IconCheck className='text-accent mt-0.5 h-4 w-4' />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
