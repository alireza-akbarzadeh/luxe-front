import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CartButton } from '@/components/cart/cart-button';

const openCart = vi.fn();
const useCartControllerMock = vi.fn();

vi.mock('@/hooks/useCartController', () => ({
  useCartController: () => useCartControllerMock()
}));

vi.mock('~/src/store/card.store', () => ({
  useCartStore: (selector: (state: { openCart: () => void }) => unknown) => selector({ openCart })
}));

describe('CartButton', () => {
  beforeEach(() => {
    openCart.mockClear();
    useCartControllerMock.mockReturnValue({ itemCount: 0 });
  });

  it('opens the cart when clicked', async () => {
    const user = userEvent.setup();
    render(<CartButton />);

    await user.click(screen.getByRole('button', { name: 'Open cart' }));
    expect(openCart).toHaveBeenCalledOnce();
  });

  it('shows item count in aria-label and badge', () => {
    useCartControllerMock.mockReturnValue({ itemCount: 5 });
    render(<CartButton />);

    expect(screen.getByRole('button', { name: 'Open cart, 5 items' })).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('caps badge display at 99+', () => {
    useCartControllerMock.mockReturnValue({ itemCount: 120 });
    render(<CartButton />);

    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('shows label when showLabel is true', () => {
    render(<CartButton showLabel />);

    expect(screen.getByRole('button', { name: /Open cart/i })).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });
});
