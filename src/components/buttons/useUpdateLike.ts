'use client';

import { type QueryKey, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getGetProductsIdQueryKey } from '@/services/-products-{id}-get';
import type { GetProductsId200 } from '@/services/-products-{id}-get.schemas';
import {
  type PostProductsIdLikeMutationError,
  usePostProductsIdLike
} from '@/services/-products-{id}-like-post';
import type { GetProducts200 } from '@/services/-products-get.schemas';

type LikeContext = {
  previousProduct?: GetProductsId200;
  previousLists: Array<[QueryKey, GetProducts200 | undefined]>;
};

function updateProductInList(
  data: GetProducts200 | undefined,
  productId: number,
  liked: boolean
): GetProducts200 | undefined {
  if (!data?.data?.products) return data;

  return {
    ...data,
    data: {
      ...data.data,
      products: data.data.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              is_liked: liked
            }
          : product
      )
    }
  };
}

export function useLikeProduct(productName: string) {
  const queryClient = useQueryClient();

  return usePostProductsIdLike<PostProductsIdLikeMutationError, LikeContext>({
    mutation: {
      onMutate: async ({ id, data }) => {
        const liked = Boolean(data.like);

        await queryClient.cancelQueries({
          queryKey: ['/products']
        });

        await queryClient.cancelQueries({
          queryKey: getGetProductsIdQueryKey(String(id))
        });

        const previousProduct = queryClient.getQueryData<GetProductsId200>(
          getGetProductsIdQueryKey(String(id))
        );

        const previousLists = queryClient.getQueriesData<GetProducts200>({
          queryKey: ['/products']
        });

        // optimistic update single product
        queryClient.setQueryData<GetProductsId200>(getGetProductsIdQueryKey(String(id)), (old) =>
          old
            ? {
                ...old,
                data: {
                  ...old.data,
                  is_liked: liked
                }
              }
            : old
        );

        // optimistic update lists
        previousLists.forEach(([key]) => {
          queryClient.setQueryData<GetProducts200>(key, (old) =>
            updateProductInList(old, id, liked)
          );
        });

        return {
          previousProduct,
          previousLists
        };
      },

      onError: (_, variables, context) => {
        if (!context) return;

        if (context.previousProduct) {
          queryClient.setQueryData(
            getGetProductsIdQueryKey(String(variables.id)),
            context.previousProduct
          );
        }

        context.previousLists.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });

        toast.error('Something went wrong.');
      },

      onSuccess: (response, variables) => {
        if (!response.success) {
          toast.error(response.message ?? 'Something went wrong.');
          return;
        }

        const liked = Boolean(variables.data.like);

        toast.success(`${productName} ${liked ? 'added to' : 'removed from'} your likes ✨`);
      },

      onSettled: async (_, __, variables) => {
        await queryClient.invalidateQueries({
          queryKey: ['/products']
        });

        await queryClient.invalidateQueries({
          queryKey: getGetProductsIdQueryKey(String(variables.id))
        });
      }
    }
  });
}
