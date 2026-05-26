// hooks/useCartController.ts
'use client';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getGetCartQueryKey, useGetCart } from '../services/-cart-get';
import { useDeleteCartItems } from '../services/-cart-items-delete';
import { usePostCartItems } from '../services/-cart-items-post';
import { useDeleteCartItemsId } from '../services/-cart-items-{id}-delete';
import { usePutCartItemsId } from '../services/-cart-items-{id}-put';

import { useUser } from './useUser';

interface CartItemPayload {
  product_id?: number | null;
  product_name?: string | null;
  price?: number | null;
  stock?: number | null;
  is_in_stock?: boolean | null;
  image_url?: string | null;
  color?: string | string[];
  size?: string | string[];
}

export const useCartController = () => {
  const { isAuthenticated } = useUser();

  const queryClient = useQueryClient();

  const {
    data: cartData,
    isLoading,
    error
  } = useGetCart({
    query: {
      enabled: isAuthenticated
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

          let updatedItems = [...currentItems];

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
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetCartQueryKey()
        });
      }
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
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetCartQueryKey()
        });
      }
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
      },

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getGetCartQueryKey()
        });
      }
    }
  });

  // =========================================================
  // CLEAR CART
  // =========================================================

  const clearCartMutation = useDeleteCartItems();

  // =========================================================
  // HELPERS
  // =========================================================

  const handleQuantityIncrement = (product: CartItemPayload) => {
    if (!product.product_id) {
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
      updateQuantityMutation.mutate({
        id: Number(cartItem.id),

        data: {
          quantity: currentQty + 1
        }
      });

      toast.success(`Added 1 × ${product.product_name}`);
    } else {
      const itemColor = Array.isArray(product.color) ? product.color[0] : product.color;

      const itemSize = Array.isArray(product.size) ? product.size[0] : product.size;

      addItemMutation.mutate({
        data: {
          product_id: product.product_id,

          quantity: 1,

          color: itemColor ?? '',

          size: itemSize ?? ''
        },

        custom_metadata: {
          name: product.product_name,

          price: product.price,

          image: product.image_url,

          stock: product.stock
        }
      });

      toast.success(`${product.product_name} added to cart`);
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

    clearCart: async () => {
      await clearCartMutation.mutateAsync();
    }
  };
};
