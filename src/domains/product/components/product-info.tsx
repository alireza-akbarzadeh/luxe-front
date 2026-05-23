'use client';
import {IconCheck, IconChevronRight, IconStar} from '@tabler/icons-react';
import { Separator } from '@/components/ui/separator';
import { LikeButton } from '@/components/buttons/like-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { DtoProductResponse } from '@/services/-products-get.schemas';
import { ProductBadges } from './product-badges';
import ProductColors from './product-colors';
import ProductQuantity from './product-quantity';
import { ProductSized } from './product-sized';
import { useCartController } from '@/hooks/useCartController';
import { toast } from 'sonner';
import {useState} from "react";
import Link from "next/link";

interface ProductInfoProps {
    product: DtoProductResponse;
    is_liked: boolean;
}

export function ProductInfo(props: ProductInfoProps) {
    const { product, is_liked } = props;
    const { addItem, removeItem, itemCount } = useCartController(); // itemCount = count for this product

    const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const stock = product.stock ?? 0;
    const currentQuantity = itemCount ?? 0;

    const handleIncrement = () => {
        if (currentQuantity < stock) {
            addItem(product.id as number, 1);
            toast.success(`Added 1 × ${product.name}`);
        } else {
            toast.error(`Only ${stock} in stock`);
        }
    };

    const handleDecrement = () => {
        if (currentQuantity > 0) {
            removeItem(product.id as number);
            toast.info(`Removed 1 × ${product.name}`);
        }
    };

    const handleAddToCart = () => {
        if (!product.id) return;
        addItem(product.id, 1);
        toast.success(`${product.name} added to cart`);
    };

    return (
        <div className='flex flex-col gap-6'>
            {/* product header, rating, price (unchanged) */}
            <div>
                <p className='text-muted-foreground text-xs tracking-widest uppercase'>
                    {product.category?.name}
                </p>
                <h1 className='font-display mt-2 text-3xl leading-tight md:text-4xl'>{product.name}</h1>
                <div className='mt-3 flex items-center gap-3'>
                    <div className='flex items-center'>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <IconStar
                                key={i}
                                className={`h-4 w-4 ${
                                    i < Math.round(product.rating || 0)
                                        ? 'fill-foreground text-foreground'
                                        : 'text-muted-foreground/40'
                                }`}
                            />
                        ))}
                    </div>
                    <p className='text-muted-foreground text-sm'>
                        {product.rating} · {product.reviews_count} reviews
                    </p>
                </div>
                <div className='mt-4 flex items-baseline gap-3'>
                    <span className='text-3xl font-semibold'>${product.price}</span>
                    {product.compare_at_price && (
                        <>
              <span className='text-muted-foreground text-lg line-through'>
                ${product.compare_at_price}
              </span>
                            <Badge variant='outline' className='border-accent text-accent'>
                                Save ${product.compare_at_price - Number(product.price)}
                            </Badge>
                        </>
                    )}
                </div>
            </div>

            <p className='text-muted-foreground text-base'>{product.description}</p>
            <Separator />

            {/* Color & Size – unchanged */}
            <ProductColors
                onSetSelected={setSelectedColor}
                selected={selectedColor || ''}
                colors={product.colors as string[]}
            />
            <ProductSized
                onSetSelected={setSelectedSize}
                selected={selectedSize}
                sizes={product.sizes as string[]}
            />

            {/* Quantity picker – directly modifies cart */}
            <ProductQuantity
                value={currentQuantity}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                stock={stock}
            />

            {/* CTA Buttons */}
            <div className='flex gap-2'>
                <Button onClick={handleAddToCart} size='lg' className='flex-1 gap-2'>
                    <IconCheck className='h-4 w-4' /> Add to cart
                </Button>
                <Button asChild size="lg" className="bg-accent py-4.5">
                    <Link href="/checkout">
                        Proceed to checkout
                        <IconChevronRight/>
                    </Link>
                </Button>
                <LikeButton
                    productName={product.name as string}
                    isLiked={is_liked}
                    productId={product.id as number}
                />
            </div>

            <ProductBadges />
        </div>
    );
}