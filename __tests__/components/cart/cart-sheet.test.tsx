import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CartSheet } from '@/components/cart/cart-sheet';
import { useCartStore } from '~/src/store/card.store';

const useCartControllerMock = vi.fn();
const useUserMock = vi.fn();

vi.mock('@/hooks/useCartController', () => ({
  useCartController: () => useCartControllerMock()
}));

vi.mock('@/hooks/useUser', () => ({
  useUser: () => useUserMock()
}));

describe('CartSheet', () => {
  beforeEach(() => {
    useCartStore.setState({ isOpen: true });
    useUserMock.mockReturnValue({ isAuthenticated: false });
    useCartControllerMock.mockReturnValue({
      increment: vi.fn(),
      decrement: vi.fn(),
      items: [],
      isLoading: false,
      itemCount: 0,
      subtotal: 0
    });
  });

  it('prompts guests to sign in', () => {
    render(<CartSheet />);

    expect(screen.getByText('Sign in to view your cart')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login');
  });

  it('shows empty state for authenticated users with no items', () => {
    useUserMock.mockReturnValue({ isAuthenticated: true });

    render(<CartSheet />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue shopping' })).toHaveAttribute(
      'href',
      '/shop'
    );
  });

  it('renders cart items and totals when authenticated', () => {
    useUserMock.mockReturnValue({ isAuthenticated: true });
    useCartControllerMock.mockReturnValue({
      increment: vi.fn(),
      decrement: vi.fn(),
      items: [
        {
          id: 1,
          product_id: 42,
          name: 'Silk Blazer',
          price: 299,
          quantity: 2,
          image: '/blazer.jpg'
        }
      ],
      isLoading: false,
      itemCount: 2,
      subtotal: 598
    });

    render(<CartSheet />);

    expect(screen.getByText('Silk Blazer')).toBeInTheDocument();
    expect(screen.getAllByText('$598').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('link', { name: 'Proceed to checkout' })).toHaveAttribute(
      'href',
      '/checkout'
    );
  });
});
