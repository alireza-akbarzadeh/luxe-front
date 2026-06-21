import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LikeButton } from '@/components/buttons/like-button';

const mutate = vi.fn();
const useLikeProductMock = vi.fn();

vi.mock('@/components/buttons/useUpdateLike', () => ({
  useLikeProduct: (productName: string) => useLikeProductMock(productName)
}));

describe('LikeButton', () => {
  beforeEach(() => {
    mutate.mockClear();
    useLikeProductMock.mockReturnValue({
      mutate,
      isPending: false,
      variables: undefined
    });
  });

  it('toggles like state via mutation', async () => {
    const user = userEvent.setup();
    render(
      <LikeButton productId={42} productName='Silk Blazer' isLiked={false} />
    );

    await user.click(screen.getByRole('button', { name: 'Wishlist' }));

    expect(mutate).toHaveBeenCalledWith({
      id: 42,
      data: { like: true }
    });
  });

  it('sends unlike when already liked', async () => {
    const user = userEvent.setup();
    render(
      <LikeButton productId={7} productName='Pearl Necklace' isLiked={true} />
    );

    await user.click(screen.getByRole('button', { name: 'Wishlist' }));

    expect(mutate).toHaveBeenCalledWith({
      id: 7,
      data: { like: false }
    });
  });

  it('shows optimistic liked styling while mutation is in flight', () => {
    useLikeProductMock.mockReturnValue({
      mutate,
      isPending: true,
      variables: { id: 42, data: { like: true } }
    });

    render(
      <LikeButton productId={42} productName='Silk Blazer' isLiked={false} />
    );

    const icon = screen.getByRole('button', { name: 'Wishlist' }).querySelector('svg');
    expect(icon).toHaveClass('fill-red-500');
    expect(screen.getByRole('button', { name: 'Wishlist' })).toBeDisabled();
  });

  it('wires product name into the like hook', () => {
    render(
      <LikeButton productId={1} productName='Cashmere Coat' isLiked={false} />
    );

    expect(useLikeProductMock).toHaveBeenCalledWith('Cashmere Coat');
  });
});
