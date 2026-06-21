import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { FollowButton } from '@/components/buttons/follow-button';

const follow = vi.fn();
const unfollow = vi.fn();
const useStoreFollowMock = vi.fn();

vi.mock('~/src/hooks/useStoreFollow', () => ({
  useStoreFollow: (props: unknown) => useStoreFollowMock(props)
}));

describe('FollowButton', () => {
  beforeEach(() => {
    follow.mockClear();
    unfollow.mockClear();
    useStoreFollowMock.mockReturnValue({
      follow,
      unfollow,
      isLoading: false
    });
  });

  it('calls follow when not yet following', async () => {
    const user = userEvent.setup();
    render(<FollowButton slug='atelier-noir' storeName='Atelier Noir' isFollowed={false} />);

    await user.click(screen.getByRole('button', { name: 'Follow Atelier Noir' }));

    expect(follow).toHaveBeenCalledOnce();
    expect(unfollow).not.toHaveBeenCalled();
  });

  it('calls unfollow when already following', async () => {
    const user = userEvent.setup();
    render(<FollowButton slug='atelier-noir' storeName='Atelier Noir' isFollowed={true} />);

    await user.click(screen.getByRole('button', { name: 'Unfollow Atelier Noir' }));

    expect(unfollow).toHaveBeenCalledOnce();
    expect(follow).not.toHaveBeenCalled();
  });

  it('shows loading spinner and disables interaction while pending', () => {
    useStoreFollowMock.mockReturnValue({
      follow,
      unfollow,
      isLoading: true
    });

    render(<FollowButton slug='maison' isFollowed={false} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('uses slug in aria-label when store name is omitted', () => {
    render(<FollowButton slug='maison-luxe' isFollowed={false} />);

    expect(screen.getByRole('button', { name: 'Follow maison-luxe' })).toBeInTheDocument();
  });

  it('passes slug and store name to useStoreFollow', () => {
    render(<FollowButton slug='maison' storeName='Maison Luxe' isFollowed={false} />);

    expect(useStoreFollowMock).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'maison',
        storeName: 'Maison Luxe'
      })
    );
  });
});
