import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders with default variant', () => {
    render(<Button>Checkout</Button>);

    const button = screen.getByRole('button', { name: 'Checkout' });
    expect(button).toHaveAttribute('data-variant', 'default');
    expect(button).toBeEnabled();
  });

  it('applies variant and size data attributes', () => {
    render(
      <Button variant='outline' size='lg'>
        Save
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('disables the button while loading', () => {
    render(<Button loading>Processing</Button>);

    expect(screen.getByRole('button', { name: /Processing/i })).toBeDisabled();
  });

  it('calls onClick when enabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Add to cart</Button>);
    await user.click(screen.getByRole('button', { name: 'Add to cart' }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
