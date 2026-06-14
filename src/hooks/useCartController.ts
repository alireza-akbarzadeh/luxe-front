// FIXME: find correct types and remove any
/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useCartController.ts
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getGetCartQueryKey, useGetCart } from '../services/-cart-get';
import { useDeleteCartItemsId } from '../services/-cart-items-{id}-delete';
import { usePutCartItemsId } from '../services/-cart-items-{id}-put';
import { useDeleteCartItems } from '../services/-cart-items-delete';
import { usePostCartItems } from '../services/-cart-items-post';
import { useCartStore } from '../store/card.store';
import { useUser } from './useUser';

export interface CartItemPayload {
  product_id?: number | null;
  product_name?: string | null;
  price?: number | null;
  stock?: number | null;
  is_in_stock?: boolean | null;
  image_url?: string | null;
  color?: string;
  size?: string;
}

export const useCartController = () => {
  const { isAuthenticated } = useUser();
  const openCart = useCartStore((state) => state.openCart);

  const queryClient = useQueryClient();

  const {
    data: cartData,
    isLoading,
    error
  } = useGetCart({
    query: {
      enabled: isAuthenticated,
      // ✅ Sort items by ID (stable order, prevents jumping)
      select: (data) => {
        const items = data?.data?.items ?? [];
        return {
          ...data,
          data: {
            ...data?.data,
            items: [...items].sort((a, b) => Number(a.id) - Number(b.id))
          }
        };
      },
      // ✅ Cross‑tab / background sync without breaking optimistic updates
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5
    }
  });

  const items = cartData?.data?.items ?? [];

  const itemCount = items.reduce((sum, item) => {
    return sum + Number(item.quantity ?? 0);
  }, 0);

  const subtotal = items.reduce((sum, item) => {
    return sum + Number(item.price ?? 0) * Number(item.quantity ?? 0);
  }, 0);

  // =========================================================
  // CACHE HELPER
  // =========================================================

  const updateCartCache = (updater: (old: any) => any) => {
    queryClient.setQueryData(getGetCartQueryKey(), (old: any) => {
      if (!old) {
        return {
          success: true,
          data: {
            items: []
          }
        };
      }

      return updater(old);
    });
  };

  // =========================================================
  // ADD ITEM
  // =========================================================

  const addItemMutation = usePostCartItems({
    mutation: {
      mutationKey: ['cart-update'],
      onMutate: async (newItem: any) => {
        await queryClient.cancelQueries({
          queryKey: getGetCartQueryKey()
        });

        const previousCart = queryClient.getQueryData(getGetCartQueryKey());

        updateCartCache((old: any) => {
          const currentItems = old?.data?.items ?? [];

          const existingIndex = currentItems.findIndex(
            (item: any) =>
              item.product_id === newItem.data.product_id &&
              item.selected_color === newItem.data.color &&
              item.selected_size === newItem.data.size
          );

          const updatedItems = [...currentItems];

          if (existingIndex !== -1) {
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],

              quantity:
                Number(updatedItems[existingIndex].quantity ?? 0) +
                Number(newItem.data.quantity ?? 1)
            };
          } else {
            const meta = newItem.custom_metadata;

            updatedItems.push({
              id: Date.now(),

              product_id: newItem.data.product_id,

              product_name: meta?.name ?? '',

              quantity: Number(newItem.data.quantity ?? 1),

              selected_color: newItem.data.color ?? '',

              selected_size: newItem.data.size ?? '',

              price: Number(meta?.price ?? 0),

              image: meta?.image ? [meta.image] : [],

              stock: meta?.stock ?? 999,

              is_in_stock: true
            });
          }

          return {
            ...old,

            data: {
              ...old.data,

              items: updatedItems
            }
          };
        });

        return { previousCart };
      },

      onError: (_error, _variables, context: any) => {
        if (context?.previousCart) {
          queryClient.setQueryData(getGetCartQueryKey(), context.previousCart);
        }

        toast.error('Failed to add item to cart');
      }

      // ✅ REMOVED – no invalidation, optimistic cache is enough
      // onSuccess: () => {
      //   queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      // }
    }
  });

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================

  const updateQuantityMutation = usePutCartItemsId({
    mutation: {
      mutationKey: ['cart-update'],
      onMutate: async ({ id, data }: any) => {
        await queryClient.cancelQueries({
          queryKey: getGetCartQueryKey()
        });

        const previousCart = queryClient.getQueryData(getGetCartQueryKey());

        updateCartCache((old: any) => {
          const currentItems = old?.data?.items ?? [];

          const updatedItems = currentItems.map((item: any) => {
            if (Number(item.id) !== Number(id)) {
              return item;
            }

            return {
              ...item,

              quantity: Number(data.quantity)
            };
          });

          return {
            ...old,

            data: {
              ...old.data,

              items: updatedItems
            }
          };
        });

        return { previousCart };
      },

      onError: (_error, _variables, context: any) => {
        if (context?.previousCart) {
          queryClient.setQueryData(getGetCartQueryKey(), context.previousCart);
        }

        toast.error('Failed to update quantity');
      }

      // ✅ REMOVED invalidation
    }
  });

  // =========================================================
  // REMOVE ITEM
  // =========================================================

  const removeItemMutation = useDeleteCartItemsId({
    mutation: {
      mutationKey: ['cart-update'],
      onMutate: async ({ id }: any) => {
        await queryClient.cancelQueries({
          queryKey: getGetCartQueryKey()
        });

        const previousCart = queryClient.getQueryData(getGetCartQueryKey());

        updateCartCache((old: any) => {
          const currentItems = old?.data?.items ?? [];

          const updatedItems = currentItems.filter((item: any) => Number(item.id) !== Number(id));

          return {
            ...old,

            data: {
              ...old.data,

              items: updatedItems
            }
          };
        });

        return { previousCart };
      },

      onError: (_error, _variables, context: any) => {
        if (context?.previousCart) {
          queryClient.setQueryData(getGetCartQueryKey(), context.previousCart);
        }

        toast.error('Failed to remove item');
      }

      // ✅ REMOVED invalidation
    }
  });

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCartMutation = useDeleteCartItems();

  // =========================================================
  // UPDATE VARIANT (color/size)
  // =========================================================
  const updateVariantMutation = usePutCartItemsId({
    mutation: {
      mutationKey: ['cart-update-variant'],
      onMutate: async ({ id, data }: any) => {
        await queryClient.cancelQueries({ queryKey: getGetCartQueryKey() });
        const previousCart = queryClient.getQueryData(getGetCartQueryKey());

        updateCartCache((old: any) => {
          const currentItems = old?.data?.items ?? [];
          const updatedItems = currentItems.map((item: any) => {
            if (Number(item.id) !== Number(id)) return item;
            return {
              ...item,
              selected_color: data.color ?? item.selected_color,
              selected_size: data.size ?? item.selected_size
            };
          });
          return { ...old, data: { ...old.data, items: updatedItems } };
        });

        return { previousCart };
      },
      onError: (_error, _variables, context: any) => {
        if (context?.previousCart) {
          queryClient.setQueryData(getGetCartQueryKey(), context.previousCart);
        }
        toast.error('Failed to update color/size');
      }
      // ✅ REMOVED invalidation
    }
  });

  // =========================================================
  // HELPERS
  // =========================================================

  const handleQuantityIncrement = (product: CartItemPayload) => {
    if (!product.product_id) {
      return;
    }

    if (!isAuthenticated) {
      toast.error('Sign in to add items to your cart');
      openCart();
      return;
    }

    const cartItem = items.find((item) => item.product_id === product.product_id);

    const currentQty = Number(cartItem?.quantity ?? 0);

    const maxStock = Number(product.stock ?? 10);

    if (currentQty >= maxStock) {
      toast.error(`Only ${maxStock} units left in stock`);

      return;
    }

    if (cartItem) {
      updateQuantityMutation.mutate(
        {
          id: Number(cartItem.id),
          data: {
            quantity: currentQty + 1
          }
        },
        {
          onSuccess: () => {
            toast.success(`Added 1 × ${product.product_name}`);
            openCart();
          }
        }
      );
    } else {
      const itemColor = Array.isArray(product.color) ? product.color[0] : product.color;

      const itemSize = Array.isArray(product.size) ? product.size[0] : product.size;

      addItemMutation.mutate(
        {
          data: {
            product_id: product.product_id,
            quantity: 1,
            color: itemColor ?? '',
            size: itemSize ?? ''
          },
          // @ts-expect-error find out about this problem
          custom_metadata: {
            name: product.product_name,
            price: product.price,
            image: product.image_url,
            stock: product.stock
          }
        },
        {
          onSuccess: () => {
            toast.success(`${product.product_name} added to cart`);
            openCart();
          }
        }
      );
    }
  };

  const handleQuantityDecrement = (product: CartItemPayload) => {
    if (!product.product_id) {
      return;
    }

    const cartItem = items.find((item) => item.product_id === product.product_id);

    if (!cartItem) {
      return;
    }

    const currentQty = Number(cartItem.quantity ?? 0);

    if (currentQty <= 1) {
      removeItemMutation.mutate({
        id: Number(cartItem.id)
      });

      toast.info(`${product.product_name} removed`);
    } else {
      updateQuantityMutation.mutate({
        id: Number(cartItem.id),

        data: {
          quantity: currentQty - 1
        }
      });

      toast.info(`Removed 1 × ${product.product_name}`);
    }
  };

  const getProductQuantity = (productId?: number | null) => {
    if (!productId) {
      return 0;
    }

    const found = items.find((item) => item.product_id === productId);

    return Number(found?.quantity ?? 0);
  };

  const updateCartItemVariant = (itemId: number, color: string, size: string) => {
    updateVariantMutation.mutate({ id: itemId, data: { color, size } });
  };
  // =========================================================
  // UPDATE QUANTITY BY CART ITEM ID (public)
  // =========================================================
  const updateCartItemQuantity = (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    updateQuantityMutation.mutate({ id: itemId, data: { quantity } });
  };

  // =========================================================
  // REMOVE CART ITEM BY ID (public)
  // =========================================================
  const removeCartItem = (itemId: number) => {
    removeItemMutation.mutate({ id: itemId });
  };

  // =========================================================
  // LOADING STATES
  // =========================================================

  const isAdding = addItemMutation.isPending;

  const isUpdating = updateQuantityMutation.isPending;

  const isRemoving = removeItemMutation.isPending;

  const isClearing = clearCartMutation.isPending;

  // =========================================================
  // RETURN
  // =========================================================

  return {
    items,
    itemCount,
    subtotal,
    isLoading,
    isAdding,
    isUpdating,
    isRemoving,
    isClearing,
    error,
    getProductQuantity,
    increment: handleQuantityIncrement,
    decrement: handleQuantityDecrement,
    updateCartItemVariant,
    updateCartItemQuantity,
    removeCartItem,
    clearCart: async () => {
      await clearCartMutation.mutateAsync();
      // Also clear the cache optimistically
      updateCartCache((old: any) => ({ ...old, data: { ...old.data, items: [] } }));
    }
  };
};
