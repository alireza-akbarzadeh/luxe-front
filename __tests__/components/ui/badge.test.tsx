import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('renders badge text', () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders destructive variant', () => {
    render(<Badge variant='destructive'>Out of stock</Badge>);

    const badge = screen.getByText('Out of stock');
    expect(badge).toHaveAttribute('data-slot', 'badge');
    expect(badge.className).toContain('text-destructive');
  });

  it('supports custom class names', () => {
    render(
      <Badge variant='accent' className='uppercase'>
        Limited
      </Badge>
    );

    expect(screen.getByText('Limited')).toHaveClass('uppercase');
  });
});
