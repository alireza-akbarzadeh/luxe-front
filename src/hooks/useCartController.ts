// hooks/useCart.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCartStore } from '~/src/store/card.store';
import { useGetCart } from '../services/-cart-get';
import { usePostCartItems } from '../services/-cart-items-post';
import { usePutCartItemsId } from '../services/-cart-items-{id}-put';
import { useDeleteCartItemsId } from '../services/-cart-items-{id}-delete';

export const useCart = () => {
  const queryClient = useQueryClient();
  const { setItems, addOptimisticItem, updateOptimisticQuantity, removeOptimisticItem } =
    useCartStore();

  const { data: cartData, isLoading, error } = useGetCart();

  useEffect(() => {
    if (cartData?.data?.cart?.items) {
      setItems(cartData.data.cart.items || []);
    }
  }, [cartData, setItems]);

  const addItem = usePostCartItems({
    mutation: {
      onMutate: async (newItem) => {
        const previousCart = queryClient.getQueryData(['/cart']);
        // optimistic item – minimal fields; full data will arrive after refetch
        addOptimisticItem({
          id: Date.now(), // temporary id
          product_id: newItem.data.product_id,
          quantity: newItem.data.quantity,
          size: newItem.data.size || '',
          color: newItem.data.color || ''
          // name, price, image will be filled after server response
        });
        return { previousCart };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousCart) {
          queryClient.setQueryData(['/cart'], context.previousCart);
        }
        toast.error('Failed to add item');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/cart'] });
        toast.success('Item added to cart');
      }
    }
  });

  const updateQuantity = usePutCartItemsId({
    mutation: {
      onMutate: async ({ id, data }) => {
        await queryClient.cancelQueries({ queryKey: ['/cart'] });
        const previousCart = queryClient.getQueryData(['/cart']);
        updateOptimisticQuantity(id, data.quantity);
        return { previousCart };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousCart) {
          queryClient.setQueryData(['/cart'], context.previousCart);
        }
        toast.error('Failed to update quantity');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/cart'] });
      }
    }
  });

  const removeItem = useDeleteCartItemsId({
    mutation: {
      onMutate: async ({ id }) => {
        await queryClient.cancelQueries({ queryKey: ['/cart'] });
        const previousCart = queryClient.getQueryData(['/cart']);
        removeOptimisticItem(id);
        return { previousCart };
      },
      onError: (_err, _variables, context) => {
        if (context?.previousCart) {
          queryClient.setQueryData(['/cart'], context.previousCart);
        }
        toast.error('Failed to remove item');
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/cart'] });
        toast.success('Item removed');
      }
    }
  });

  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, i) => sum + Number(i.quantity), 0);
  const subtotal = items.reduce((sum, i) => sum + Number(i.price) * Number(i.quantity), 0);

  return {
    items,
    itemCount,
    subtotal,
    isLoading,
    error,
    addItem: (productId: number, quantity: number, color?: string, size?: string) =>
      addItem.mutate({ data: { product_id: productId, quantity, color, size } }),
    updateQuantity: (id: number, quantity: number) =>
      updateQuantity.mutate({ id, data: { quantity } }),
    removeItem: (id: number) => removeItem.mutate({ id }),
    isAdding: addItem.isPending,
    isUpdating: updateQuantity.isPending,
    isRemoving: removeItem.isPending
  };
};
