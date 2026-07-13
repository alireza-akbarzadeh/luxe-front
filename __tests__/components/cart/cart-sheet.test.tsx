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

vi.mock('@/domains/cart/hooks/use-cart-commerce-settings', () => ({
  useCartCommerceSettings: () => ({
    settings: {
      freeShippingThreshold: 100,
      defaultShippingRate: 12,
      estimatedTaxRate: 0.08,
      estimatedTaxEnabled: true
    },
    isLoading: false,
    isError: false,
    refetch: vi.fn()
  })
}));

vi.mock('@/domains/cart/hooks/use-cart-checkout-action', () => ({
  useCartCheckoutAction: () => ({
    hasIncompleteVariants: false,
    incompleteItems: [],
    proceedToCheckout: vi.fn()
  })
}));

vi.mock('@/domains/cart/components/cart-header-actions', () => ({
  CartHeaderActions: () => <div data-testid='cart-header-actions' />
}));

vi.mock('@/domains/cart/components/cart-import-dialog', () => ({
  CartImportDialog: () => null
}));

describe('CartSheet', () => {
  beforeEach(() => {
    useCartStore.setState({ isOpen: true });
    useUserMock.mockReturnValue({ isAuthenticated: false, loading: false });
    useCartControllerMock.mockReturnValue({
      increment: vi.fn(),
      decrement: vi.fn(),
      updateCartItemQuantity: vi.fn(),
      removeCartItem: vi.fn(),
      items: [],
      isLoading: false,
      itemCount: 0,
      subtotal: 0,
      error: null,
      refetch: vi.fn(),
      updatingItemId: null,
      removingItemId: null
    });
  });

  it('shows loading while auth is resolving', () => {
    useUserMock.mockReturnValue({ isAuthenticated: false, loading: true });

    render(<CartSheet />);

    expect(screen.queryByText('Sign in to view your cart')).not.toBeInTheDocument();
  });

  it('prompts guests to sign in and import', () => {
    render(<CartSheet />);

    expect(screen.getByText('Sign in to view your cart')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
      'href',
      '/login?callbackUrl=/cart'
    );
    expect(screen.getByRole('button', { name: 'Import basket' })).toBeInTheDocument();
  });

  it('shows empty state with import for authenticated users with no items', () => {
    useUserMock.mockReturnValue({ isAuthenticated: true, loading: false });

    render(<CartSheet />);

    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Continue shopping' })).toHaveAttribute(
      'href',
      '/shop'
    );
    expect(screen.getByRole('button', { name: 'Import basket' })).toBeInTheDocument();
  });

  it('renders cart items, totals, and share actions when authenticated', () => {
    useUserMock.mockReturnValue({ isAuthenticated: true, loading: false });
    useCartControllerMock.mockReturnValue({
      increment: vi.fn(),
      decrement: vi.fn(),
      updateCartItemQuantity: vi.fn(),
      removeCartItem: vi.fn(),
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
      subtotal: 598,
      error: null,
      refetch: vi.fn(),
      updatingItemId: null,
      removingItemId: null
    });

    render(<CartSheet />);

    expect(screen.getByText('Silk Blazer')).toBeInTheDocument();
    expect(screen.getAllByText('$598.00').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('$645.84').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: 'Proceed to checkout' })).toBeInTheDocument();
    expect(screen.getByTestId('cart-header-actions')).toBeInTheDocument();
  });
});
