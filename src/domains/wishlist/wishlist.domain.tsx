"use client";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowRight,
    Bell,
    BellOff,
    ChevronRight,
    Gift,
    Grid3X3,
    Heart,
    List,
    Package,
    Share2,
    ShoppingCart,
    Sparkles,
    Star,
    Trash2,
    TrendingDown,
    X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartController } from "~/src/hooks/useCartController";
import { useCompareStore } from "../compare/compare.store";
import { products, type stores } from "../store/data";
import { useWishlistStore } from "./wishlist.store";

type SortOption = "date-desc" | "date-asc" | "price-asc" | "price-desc" | "name";
type ViewMode = "grid" | "list";

export default function WishlistPage() {
    const [mounted, setMounted] = useState(false);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>("date-desc");
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    const {
        items: wishlistItems,
        removeItem,
        toggleNotifyOnSale,
        clearWishlist,
        getItems,
        getPriceDrops,
        getTotalSavings,
    } = useWishlistStore();
    const { addItem: addToCart } = useCartController();
    const { addItem: addToCompare, isInCompare, canAddMore } = useCompareStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const allItems = getItems().filter((item) => item.product);
    const priceDrops = getPriceDrops();
    const totalSavings = getTotalSavings();

    // Sort items
    const sortedItems = [...allItems].sort((a, b) => {
        if (!a.product || !b.product) return 0;
        switch (sortBy) {
            case "date-desc":
                return b.addedAt - a.addedAt;
            case "date-asc":
                return a.addedAt - b.addedAt;
            case "price-asc":
                return a.product.price - b.product.price;
            case "price-desc":
                return b.product.price - a.product.price;
            case "name":
                return a.product.name.localeCompare(b.product.name);
            default:
                return 0;
        }
    });

    const toggleSelectItem = (id: number) => {
        setSelectedItems((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedItems.length === sortedItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(sortedItems.map((item) => item.id));
        }
    };

    const addSelectedToCart = () => {
        selectedItems.forEach((id) => {
            const product = products?.find((p) => p.id === id);
            if (product) {
                addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.originalPrice,
                    image: product.image,
                });
            }
        });
        setSelectedItems([]);
    };

    const removeSelected = () => {
        selectedItems.forEach((id) => removeItem(id));
        setSelectedItems([]);
    };

    const handleAddToCart = (product: (typeof products)[0]) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
        });
    };

    const handleShare = async () => {
        const shareText = `Check out my wishlist with ${allItems.length} items!`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "My Luxe Wishlist",
                    text: shareText,
                    url: window.location.href,
                });
            } catch {
                // User cancelled or error
            }
        } else {
            await navigator.clipboard.writeText(window.location.href);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <div className="animate-pulse space-y-8">
                        <div className="h-10 w-48 bg-muted rounded" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-muted rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8 pt-24">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-foreground transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground">Wishlist</span>
                </nav>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            My Wishlist
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {allItems.length} {allItems.length === 1 ? "item" : "items"} saved
                            for later
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={handleShare}>
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Share Wishlist</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {allItems.length > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Clear All
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Clear Wishlist?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will remove all {allItems.length} items from your
                                            wishlist. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={clearWishlist}>
                                            Clear All
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>

                {allItems.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                            <Heart className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                            Start adding items you love by clicking the heart icon on any
                            product. We&apos;ll save them here for you.
                        </p>
                        <Link href="/shop">
                            <Button size="lg" className="gap-2 rounded-full">
                                Explore Products
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <>
                        {/* Price Drops Alert */}
                        {priceDrops.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8"
                            >
                                <Card className="p-4 border-green-500/30 bg-green-500/5">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-green-500/10">
                                            <TrendingDown className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-green-700 dark:text-green-400">
                                                Price Drop Alert!
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {priceDrops.length}{" "}
                                                {priceDrops.length === 1 ? "item has" : "items have"}{" "}
                                                dropped in price since you added{" "}
                                                {priceDrops.length === 1 ? "it" : "them"}
                                            </p>
                                        </div>
                                        <Link href="#price-drops">
                                            <Button variant="ghost" size="sm" className="gap-1">
                                                View
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Heart className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{allItems.length}</p>
                                        <p className="text-sm text-muted-foreground">Saved Items</p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-green-500/10">
                                        <Sparkles className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">${totalSavings}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Potential Savings
                                        </p>
                                    </div>
                                </div>
                            </Card>
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-accent/50">
                                        <Gift className="h-5 w-5 text-accent-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{priceDrops.length}</p>
                                        <p className="text-sm text-muted-foreground">Price Drops</p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={selectedItems.length === sortedItems.length}
                                        onCheckedChange={selectAll}
                                        id="select-all"
                                    />
                                    <label
                                        htmlFor="select-all"
                                        className="text-sm cursor-pointer"
                                    >
                                        Select All
                                    </label>
                                </div>

                                <AnimatePresence>
                                    {selectedItems.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="text-sm text-muted-foreground">
                                                {selectedItems.length} selected
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="gap-1"
                                                onClick={addSelectedToCart}
                                            >
                                                <ShoppingCart className="h-3 w-3" />
                                                Add to Cart
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="gap-1 text-destructive hover:text-destructive"
                                                onClick={removeSelected}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                                Remove
                                            </Button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="flex items-center gap-3">
                                <Select
                                    value={sortBy}
                                    onValueChange={(v) => setSortBy(v as SortOption)}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="date-desc">Newest First</SelectItem>
                                        <SelectItem value="date-asc">Oldest First</SelectItem>
                                        <SelectItem value="price-asc">
                                            Price: Low to High
                                        </SelectItem>
                                        <SelectItem value="price-desc">
                                            Price: High to Low
                                        </SelectItem>
                                        <SelectItem value="name">Name: A-Z</SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="flex items-center border rounded-lg p-1">
                                    <Button
                                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setViewMode("grid")}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === "list" ? "secondary" : "ghost"}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setViewMode("list")}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <AnimatePresence mode="popLayout">
                            {viewMode === "grid" ? (
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                >
                                    {sortedItems.map((item, index) => {
                                        if (!item.product) return null;
                                        const product = item.product;
                                        const store = stores.find(
                                            (s) => s.id === product.storeId
                                        );
                                        const priceDrop = priceDrops.find(
                                            (pd) => pd.id === item.id
                                        );

                                        return (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group relative"
                                            >
                                                <Card className="overflow-hidden">
                                                    {/* Checkbox */}
                                                    <div className="absolute top-3 left-3 z-10">
                                                        <Checkbox
                                                            checked={selectedItems.includes(item.id)}
                                                            onCheckedChange={() => toggleSelectItem(item.id)}
                                                            className="bg-background/80 backdrop-blur-sm"
                                                        />
                                                    </div>

                                                    {/* Image */}
                                                    <Link href={`/product/${product.id}`}>
                                                        <div className="relative aspect-square overflow-hidden bg-secondary">
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />

                                                            {/* Badges */}
                                                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                                                {product.isNew && (
                                                                    <Badge className="bg-accent text-accent-foreground">
                                                                        New
                                                                    </Badge>
                                                                )}
                                                                {priceDrop && (
                                                                    <Badge
                                                                        variant="secondary"
                                                                        className="bg-green-500 text-white"
                                                                    >
                                                                        -${priceDrop.priceDrop}
                                                                    </Badge>
                                                                )}
                                                            </div>

                                                            {/* Actions Overlay */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                                                                <div className="flex gap-2 w-full">
                                                                    <Button
                                                                        size="sm"
                                                                        className="flex-1 rounded-full gap-1"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            handleAddToCart(product);
                                                                        }}
                                                                    >
                                                                        <ShoppingCart className="h-3 w-3" />
                                                                        Add to Cart
                                                                    </Button>
                                                                    <TooltipProvider>
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="secondary"
                                                                                    className="rounded-full"
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        addToCompare(product.id);
                                                                                    }}
                                                                                    disabled={
                                                                                        !canAddMore() &&
                                                                                        !isInCompare(product.id)
                                                                                    }
                                                                                >
                                                                                    {isInCompare(product.id) ? (
                                                                                        <X className="h-3 w-3" />
                                                                                    ) : (
                                                                                        <Package className="h-3 w-3" />
                                                                                    )}
                                                                                </Button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent>
                                                                                {isInCompare(product.id)
                                                                                    ? "Remove from Compare"
                                                                                    : "Add to Compare"}
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    </TooltipProvider>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>

                                                    {/* Info */}
                                                    <div className="p-4">
                                                        {store && (
                                                            <Link
                                                                href={`/store/${store.slug}`}
                                                                className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                                            >
                                                                {store.name}
                                                            </Link>
                                                        )}
                                                        <h3 className="font-medium mt-1 line-clamp-1">
                                                            {product.name}
                                                        </h3>

                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Star className="h-3 w-3 fill-accent text-accent" />
                                                            <span className="text-xs text-muted-foreground">
                                                                {product.rating}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-3">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold">
                                                                    ${product.price}
                                                                </span>
                                                                {product.originalPrice && (
                                                                    <span className="text-sm text-muted-foreground line-through">
                                                                        ${product.originalPrice}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center gap-1">
                                                                <TooltipProvider>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-8 w-8"
                                                                                onClick={() =>
                                                                                    toggleNotifyOnSale(item.id)
                                                                                }
                                                                            >
                                                                                {item.notifyOnSale ? (
                                                                                    <Bell className="h-4 w-4 text-primary" />
                                                                                ) : (
                                                                                    <BellOff className="h-4 w-4" />
                                                                                )}
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            {item.notifyOnSale
                                                                                ? "Sale notifications on"
                                                                                : "Notify on sale"}
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </TooltipProvider>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                                                    onClick={() => removeItem(item.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <p className="text-xs text-muted-foreground mt-2">
                                                            Added {formatDate(item.addedAt)}
                                                        </p>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            ) : (
                                <motion.div layout className="space-y-4">
                                    {sortedItems.map((item, index) => {
                                        if (!item.product) return null;
                                        const product = item.product;
                                        const store = stores.find(
                                            (s) => s.id === product.storeId
                                        );
                                        const priceDrop = priceDrops.find(
                                            (pd) => pd.id === item.id
                                        );

                                        return (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Card className="p-4">
                                                    <div className="flex gap-4">
                                                        <Checkbox
                                                            checked={selectedItems.includes(item.id)}
                                                            onCheckedChange={() => toggleSelectItem(item.id)}
                                                            className="mt-1"
                                                        />

                                                        <Link
                                                            href={`/product/${product.id}`}
                                                            className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0"
                                                        >
                                                            <Image
                                                                src={product.image}
                                                                alt={product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            {priceDrop && (
                                                                <Badge className="absolute top-1 right-1 bg-green-500 text-white text-[10px] px-1">
                                                                    -${priceDrop.priceDrop}
                                                                </Badge>
                                                            )}
                                                        </Link>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div>
                                                                    {store && (
                                                                        <Link
                                                                            href={`/store/${store.slug}`}
                                                                            className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                                                        >
                                                                            {store.name}
                                                                        </Link>
                                                                    )}
                                                                    <h3 className="font-medium">
                                                                        {product.name}
                                                                    </h3>
                                                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                                                        {product.description}
                                                                    </p>
                                                                </div>

                                                                <div className="text-right">
                                                                    <span className="font-semibold text-lg">
                                                                        ${product.price}
                                                                    </span>
                                                                    {product.originalPrice && (
                                                                        <p className="text-sm text-muted-foreground line-through">
                                                                            ${product.originalPrice}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between mt-3">
                                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                    <div className="flex items-center gap-1">
                                                                        <Star className="h-3 w-3 fill-accent text-accent" />
                                                                        {product.rating}
                                                                    </div>
                                                                    <span>Added {formatDate(item.addedAt)}</span>
                                                                </div>

                                                                <div className="flex items-center gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            toggleNotifyOnSale(item.id)
                                                                        }
                                                                        className="gap-1"
                                                                    >
                                                                        {item.notifyOnSale ? (
                                                                            <Bell className="h-4 w-4 text-primary" />
                                                                        ) : (
                                                                            <BellOff className="h-4 w-4" />
                                                                        )}
                                                                        {item.notifyOnSale ? "Notifying" : "Notify"}
                                                                    </Button>
                                                                    <Button
                                                                        variant="secondary"
                                                                        size="sm"
                                                                        className="gap-1"
                                                                        onClick={() => handleAddToCart(product)}
                                                                    >
                                                                        <ShoppingCart className="h-4 w-4" />
                                                                        Add to Cart
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                                        onClick={() => removeItem(item.id)}
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Continue Shopping */}
                        <div className="mt-12 text-center">
                            <p className="text-muted-foreground mb-4">
                                Looking for more? Discover new arrivals and bestsellers.
                            </p>
                            <Link href="/shop">
                                <Button variant="outline" size="lg" className="gap-2 rounded-full">
                                    Continue Shopping
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}
