// hooks/useCart.ts
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getGetCartQueryKey, useGetCart } from '../services/-cart-get';
import { useDeleteCartItems } from '../services/-cart-items-delete';
import { usePostCartItems } from '../services/-cart-items-post';
import { useDeleteCartItemsId } from '../services/-cart-items-{id}-delete';
import { usePutCartItemsId } from '../services/-cart-items-{id}-put';
import { useUser } from './useUser';

interface AddCartItem {
  productId: number;
  quantity: number;
  color?: string;
  size?: string;
  image?: string;
}

export const useCartController = () => {
  const { isAuthenticated } = useUser();
  const queryClient = useQueryClient();

  const {
    data: cartData,
    isLoading,
    error
  } = useGetCart({
    query: { enabled: isAuthenticated }
  });

  const items = cartData?.data?.items ?? [];
  const itemCount = items.reduce((sum, i) => sum + Number(i.quantity), 0);
  const subtotal = items.reduce((sum, i) => sum + (i.price ?? 0) * Number(i.quantity), 0);

  const updateCartCache = (
    updater: (old: typeof cartData | undefined) => typeof cartData | undefined
  ) => {
    queryClient.setQueryData(getGetCartQueryKey(), updater);
  };

  const addItemMutation = usePostCartItems({
    mutation: {
      onMutate: async (newItem) => {
        await queryClient.cancelQueries({ queryKey: getGetCartQueryKey() });

        const previousCart = queryClient.getQueryData(getGetCartQueryKey());

        updateCartCache((old) => {
          const items = old?.data?.items ?? [];

          const existingIndex = items.findIndex(
            (i) =>
              i.product_id === newItem.data.product_id &&
              i.selected_color === (newItem.data.color || '') &&
              i.selected_size === (newItem.data.size || '')
          );

          let newItems;
          if (existingIndex !== -1) {
            newItems = [...items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity:
                Number(newItems?.[existingIndex]?.quantity ?? 0) +
                Number(newItem.data.quantity ?? 0)
            };
          } else {
            newItems = [
              ...items,
              {
                id: Date.now(),
                product_id: newItem.data.product_id,
                quantity: newItem.data.quantity,
                selected_color: newItem.data.color || '',
                selected_size: newItem.data.size || '',
                price: 0,
                name: '',
                image: ''
              }
            ];
          }

          return {
            ...(old ?? {}),
            data: {
              ...(old?.data ?? {}),
              items: newItems
            }
          } as typeof cartData;
        });

        return { previousCart };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousCart) {
          queryClient.setQueryData(getGetCartQueryKey(), context.previousCart);
        }
        toast.error('Failed to add item');
      },
      onSuccess: (response) => {
        if (response?.data) {
          queryClient.setQueryData(getGetCartQueryKey(), response);
        } else {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        }
        toast.success('Item added to cart');
      }
    }
  });

  const updateQuantityMutation = usePutCartItemsId({
    mutation: {
      onMutate: async ({ id, data }) => {
        await queryClient.cancelQueries({ queryKey: getGetCartQueryKey() });
        const previousCart = queryClient.getQueryData(getGetCartQueryKey());
        console.log('Previous Cart State:', previousCart);

        updateCartCache((old) => {
          const items = old?.data?.items ?? [];
          const updatedItems = items.map((item) =>
            item.id === id ? { ...item, quantity: data.quantity } : item
          );

          return {
            ...(old ?? {}),
            data: {
              ...(old?.data ?? {}),
              items: updatedItems
            }
          } as typeof cartData;
        });

        return { previousCart };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousCart) {
          queryClient.setQueryData(getGetCartQueryKey(), context.previousCart);
        }
        toast.error('Failed to update quantity');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      }
    }
  });

  const removeItemMutation = useDeleteCartItemsId({
    mutation: {
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries({ queryKey: getGetCartQueryKey() });
        const previousCart = queryClient.getQueryData(getGetCartQueryKey());

        updateCartCache((old) => {
          const items = old?.data?.items ?? [];
          const filtered = items.filter((item) => item.id !== id);

          return {
            ...(old ?? {}),
            data: {
              ...(old?.data ?? {}),
              items: filtered
            }
          } as typeof cartData;
        });

        return { previousCart };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousCart) {
          queryClient.setQueryData(getGetCartQueryKey(), context.previousCart);
        }
        toast.error('Failed to remove item');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
        toast.success('Item removed');
      }
    }
  });

  const clearCartMutation = useDeleteCartItems();
  const clearCart = async () => {
    try {
      await clearCartMutation.mutateAsync();
      updateCartCache(
        (old) =>
          ({
            ...(old ?? {}),
            data: {
              ...(old?.data ?? {}),
              items: []
            }
          }) as typeof cartData
      );
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  return {
    items,
    itemCount,
    subtotal,
    isLoading,
    error,
    addItem: (cart: AddCartItem) =>
      addItemMutation.mutate({
        data: {
          product_id: cart.productId,
          quantity: cart.quantity,
          color: cart.color,
          size: cart.size
        }
      }),
    updateQuantity: (id: number, quantity: number) =>
      updateQuantityMutation.mutate({ id, data: { quantity } }),
    removeItem: (id: number) => removeItemMutation.mutate({ id }),
    clearCart,
    isAdding: addItemMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeItemMutation.isPending
  };
};
