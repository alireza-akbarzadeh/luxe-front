import { beforeEach, describe, expect, it } from 'vitest';

import { useCartStore } from '~/src/store/card.store';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ isOpen: false });
  });

  it('starts closed', () => {
    expect(useCartStore.getState().isOpen).toBe(false);
  });

  it('opens the cart sheet', () => {
    useCartStore.getState().openCart();
    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it('closes the cart sheet', () => {
    useCartStore.setState({ isOpen: true });
    useCartStore.getState().closeCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });

  it('sets open state directly', () => {
    useCartStore.getState().setOpen(true);
    expect(useCartStore.getState().isOpen).toBe(true);

    useCartStore.getState().setOpen(false);
    expect(useCartStore.getState().isOpen).toBe(false);
  });
});
