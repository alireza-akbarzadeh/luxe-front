"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Plus,
    ShoppingCart,
    Heart,
    Star,
    Check,
    Minus,
    ArrowRight,
    ChevronRight,
    Layers,
    Package,
    Truck,
    Shield,
    RotateCcw,
    Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCompareStore, MAX_COMPARE } from "@/lib/stores/compare-store";
import { useCartStore } from "@/lib/stores/cart-store";
import { useWishlistStore } from "@/lib/stores/wishlist-store";
import { products, stores, productCategories } from "@/lib/data";

export default function ComparePage() {
    const [mounted, setMounted] = useState(false);
    const [addProductOpen, setAddProductOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [highlightDiffs, setHighlightDiffs] = useState(true);

    const { items, removeItem, addItem, clearAll, getItems, canAddMore } =
        useCompareStore();
    const { addItem: addToCart } = useCartStore();
    const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    const compareProducts = getItems();

    // Products available to add
    const availableProducts = products.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            categoryFilter === "All" || p.category === categoryFilter;
        const notInCompare = !items.includes(p.id);
        return matchesSearch && matchesCategory && notInCompare;
    });

    const handleAddToCart = (product: (typeof products)[0]) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
        });
    };

    // Comparison attributes
    const getCompareValue = (
        product: (typeof products)[0],
        attribute: string
    ) => {
        const store = stores.find((s) => s.id === product.storeId);
        switch (attribute) {
            case "price":
                return product.price;
            case "originalPrice":
                return product.originalPrice || product.price;
            case "rating":
                return product.rating;
            case "reviews":
                return product.reviews;
            case "category":
                return product.category;
            case "store":
                return store?.name || "Unknown";
            case "isNew":
                return product.isNew ? "Yes" : "No";
            case "isDigital":
                return product.isDigital ? "Digital" : "Physical";
            case "discount":
                return product.originalPrice
                    ? Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) *
                        100
                    )
                    : 0;
            case "shipping":
                return store?.shippingInfo || "Standard shipping";
            case "returns":
                return store?.returnPolicy || "Standard returns";
            default:
                return "-";
        }
    };

    const getBestValue = (attribute: string, type: "min" | "max") => {
        if (compareProducts.length < 2) return null;
        const values = compareProducts.map((p) => {
            const val = getCompareValue(p, attribute);
            return typeof val === "number" ? val : null;
        });
        const numericValues = values.filter((v) => v !== null) as number[];
        if (numericValues.length < 2) return null;
        return type === "min" ? Math.min(...numericValues) : Math.max(...numericValues);
    };

    const isHighlighted = (
        product: (typeof products)[0],
        attribute: string,
        type: "best" | "worst"
    ) => {
        if (!highlightDiffs || compareProducts.length < 2) return false;
        const value = getCompareValue(product, attribute);
        if (typeof value !== "number") return false;

        // For price, lower is better
        if (attribute === "price" || attribute === "originalPrice") {
            const best = getBestValue(attribute, "min");
            const worst = getBestValue(attribute, "max");
            return type === "best" ? value === best : value === worst;
        }

        // For rating, reviews, discount - higher is better
        const best = getBestValue(attribute, "max");
        const worst = getBestValue(attribute, "min");
        return type === "best" ? value === best : value === worst;
    };

    const comparisonRows = [
        { key: "price", label: "Price", icon: null },
        { key: "discount", label: "Discount", icon: null, suffix: "%" },
        { key: "rating", label: "Rating", icon: Star },
        { key: "reviews", label: "Reviews", icon: null },
        { key: "category", label: "Category", icon: Layers },
        { key: "store", label: "Store", icon: Package },
        { key: "isNew", label: "New Arrival", icon: null },
        { key: "isDigital", label: "Product Type", icon: null },
        { key: "shipping", label: "Shipping", icon: Truck },
        { key: "returns", label: "Returns", icon: RotateCcw },
    ];

    if (!mounted) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-24">
                    <div className="animate-pulse space-y-8">
                        <div className="h-10 w-48 bg-muted rounded" />
                        <div className="h-96 bg-muted rounded-2xl" />
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
                    <span className="text-foreground">Compare Products</span>
                </nav>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                            Compare Products
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {compareProducts.length} of {MAX_COMPARE} products selected
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={highlightDiffs}
                                onChange={(e) => setHighlightDiffs(e.target.checked)}
                                className="rounded border-border"
                            />
                            Highlight differences
                        </label>

                        {compareProducts.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                                onClick={clearAll}
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                {compareProducts.length === 0 ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                            <Layers className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <h2 className="text-2xl font-semibold mb-2">
                            No products to compare
                        </h2>
                        <p className="text-muted-foreground max-w-md mx-auto mb-8">
                            Add products you want to compare by clicking the compare icon on
                            any product card or use the button below.
                        </p>
                        <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="gap-2 rounded-full">
                                    <Plus className="h-4 w-4" />
                                    Add Products to Compare
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                                <DialogHeader>
                                    <DialogTitle>Add Product to Compare</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 mt-4">
                                    <Input
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {productCategories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ScrollArea className="h-[300px]">
                                        <div className="space-y-2">
                                            {availableProducts.map((product) => (
                                                <div
                                                    key={product.id}
                                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                                                    onClick={() => {
                                                        addItem(product.id);
                                                        if (!canAddMore()) setAddProductOpen(false);
                                                    }}
                                                >
                                                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-secondary">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">
                                                            {product.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {product.category} · ${product.price}
                                                        </p>
                                                    </div>
                                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            ))}
                                            {availableProducts.length === 0 && (
                                                <p className="text-center text-muted-foreground py-8">
                                                    No products found
                                                </p>
                                            )}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </motion.div>
                ) : (
                    <>
                        {/* Comparison Table */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[800px]">
                                {/* Product Cards Row */}
                                <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr) ${canAddMore() ? "120px" : ""}` }}>
                                    <div className="p-4" />

                                    <AnimatePresence mode="popLayout">
                                        {compareProducts.map((product) => {
                                            const store = stores.find(
                                                (s) => s.id === product.storeId
                                            );
                                            const inWishlist = isInWishlist(product.id);

                                            return (
                                                <motion.div
                                                    key={product.id}
                                                    layout
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                >
                                                    <Card className="p-4 relative group">
                                                        {/* Remove Button */}
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => removeItem(product.id)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>

                                                        {/* Product Image */}
                                                        <Link href={`/product/${product.id}`}>
                                                            <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary mb-4">
                                                                <Image
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    fill
                                                                    className="object-cover transition-transform duration-300 hover:scale-105"
                                                                />
                                                                {product.isNew && (
                                                                    <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                                                                        New
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </Link>

                                                        {/* Product Info */}
                                                        {store && (
                                                            <Link
                                                                href={`/store/${store.slug}`}
                                                                className="text-xs text-muted-foreground hover:text-primary transition-colors"
                                                            >
                                                                {store.name}
                                                            </Link>
                                                        )}
                                                        <h3 className="font-semibold mt-1 line-clamp-2 min-h-[48px]">
                                                            {product.name}
                                                        </h3>

                                                        <div className="flex items-center gap-2 mt-2">
                                                            <span className="text-xl font-bold">
                                                                ${product.price}
                                                            </span>
                                                            {product.originalPrice && (
                                                                <span className="text-sm text-muted-foreground line-through">
                                                                    ${product.originalPrice}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-2 mt-4">
                                                            <Button
                                                                className="flex-1 gap-1"
                                                                size="sm"
                                                                onClick={() => handleAddToCart(product)}
                                                            >
                                                                <ShoppingCart className="h-4 w-4" />
                                                                Add
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="h-9 w-9"
                                                                onClick={() => toggleWishlist(product.id)}
                                                            >
                                                                <Heart
                                                                    className={`h-4 w-4 ${inWishlist
                                                                        ? "fill-red-500 text-red-500"
                                                                        : ""
                                                                        }`}
                                                                />
                                                            </Button>
                                                        </div>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>

                                    {/* Add Product Slot */}
                                    {canAddMore() && (
                                        <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
                                            <DialogTrigger asChild>
                                                <button className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors min-h-[300px]">
                                                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                                        <Plus className="h-6 w-6" />
                                                    </div>
                                                    <span className="text-sm font-medium">Add Product</span>
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-lg">
                                                <DialogHeader>
                                                    <DialogTitle>Add Product to Compare</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 mt-4">
                                                    <Input
                                                        placeholder="Search products..."
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Filter by category" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {productCategories.map((cat) => (
                                                                <SelectItem key={cat} value={cat}>
                                                                    {cat}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <ScrollArea className="h-[300px]">
                                                        <div className="space-y-2">
                                                            {availableProducts.map((product) => (
                                                                <div
                                                                    key={product.id}
                                                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                                                                    onClick={() => {
                                                                        addItem(product.id);
                                                                        if (!canAddMore()) setAddProductOpen(false);
                                                                    }}
                                                                >
                                                                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-secondary">
                                                                        <Image
                                                                            src={product.image}
                                                                            alt={product.name}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-sm truncate">
                                                                            {product.name}
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            {product.category} · ${product.price}
                                                                        </p>
                                                                    </div>
                                                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                                                </div>
                                                            ))}
                                                            {availableProducts.length === 0 && (
                                                                <p className="text-center text-muted-foreground py-8">
                                                                    No products found
                                                                </p>
                                                            )}
                                                        </div>
                                                    </ScrollArea>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </div>

                                {/* Comparison Rows */}
                                <Card className="overflow-hidden">
                                    {comparisonRows.map((row, rowIndex) => (
                                        <div
                                            key={row.key}
                                            className={`grid items-center ${rowIndex % 2 === 0 ? "bg-muted/30" : ""
                                                }`}
                                            style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr)` }}
                                        >
                                            {/* Label */}
                                            <div className="p-4 flex items-center gap-2 font-medium border-r">
                                                {row.icon && <row.icon className="h-4 w-4 text-muted-foreground" />}
                                                {row.label}
                                            </div>

                                            {/* Values */}
                                            {compareProducts.map((product) => {
                                                const value = getCompareValue(product, row.key);
                                                const isBest = isHighlighted(product, row.key, "best");
                                                const isWorst = isHighlighted(product, row.key, "worst");

                                                return (
                                                    <div
                                                        key={product.id}
                                                        className={`p-4 text-center ${isBest ? "bg-green-500/10 text-green-600 dark:text-green-400 font-medium" : ""
                                                            } ${isWorst && row.key === "price"
                                                                ? "bg-red-500/10 text-red-600 dark:text-red-400"
                                                                : ""
                                                            }`}
                                                    >
                                                        {row.key === "price" && "$"}
                                                        {row.key === "rating" ? (
                                                            <span className="flex items-center justify-center gap-1">
                                                                <Star className="h-4 w-4 fill-accent text-accent" />
                                                                {value}
                                                            </span>
                                                        ) : (
                                                            <>
                                                                {value}
                                                                {row.suffix}
                                                            </>
                                                        )}
                                                        {isBest && row.key !== "isNew" && row.key !== "isDigital" && (
                                                            <Check className="h-4 w-4 inline-block ml-1 text-green-500" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </Card>

                                {/* Quick Summary */}
                                {compareProducts.length >= 2 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8"
                                    >
                                        <Card className="p-6">
                                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                                <Shield className="h-5 w-5 text-primary" />
                                                Quick Summary
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Best Price */}
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Best Price
                                                    </p>
                                                    {(() => {
                                                        const bestPrice = Math.min(
                                                            ...compareProducts.map((p) => p.price)
                                                        );
                                                        const bestProduct = compareProducts.find(
                                                            (p) => p.price === bestPrice
                                                        );
                                                        return bestProduct ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative w-10 h-10 rounded-md overflow-hidden bg-secondary">
                                                                    <Image
                                                                        src={bestProduct.image}
                                                                        alt={bestProduct.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-sm line-clamp-1">
                                                                        {bestProduct.name}
                                                                    </p>
                                                                    <p className="text-green-500 font-semibold">
                                                                        ${bestProduct.price}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : null;
                                                    })()}
                                                </div>

                                                {/* Best Rating */}
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Highest Rated
                                                    </p>
                                                    {(() => {
                                                        const bestRating = Math.max(
                                                            ...compareProducts.map((p) => p.rating)
                                                        );
                                                        const bestProduct = compareProducts.find(
                                                            (p) => p.rating === bestRating
                                                        );
                                                        return bestProduct ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative w-10 h-10 rounded-md overflow-hidden bg-secondary">
                                                                    <Image
                                                                        src={bestProduct.image}
                                                                        alt={bestProduct.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-sm line-clamp-1">
                                                                        {bestProduct.name}
                                                                    </p>
                                                                    <p className="text-accent flex items-center gap-1">
                                                                        <Star className="h-4 w-4 fill-accent" />
                                                                        {bestProduct.rating}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : null;
                                                    })()}
                                                </div>

                                                {/* Best Value (highest discount) */}
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        Best Value
                                                    </p>
                                                    {(() => {
                                                        const productsWithDiscount = compareProducts.filter(
                                                            (p) => p.originalPrice
                                                        );
                                                        if (productsWithDiscount.length === 0) {
                                                            return (
                                                                <p className="text-sm text-muted-foreground">
                                                                    No discounted items
                                                                </p>
                                                            );
                                                        }
                                                        const bestDiscount = Math.max(
                                                            ...productsWithDiscount.map(
                                                                (p) =>
                                                                    ((p.originalPrice! - p.price) /
                                                                        p.originalPrice!) *
                                                                    100
                                                            )
                                                        );
                                                        const bestProduct = productsWithDiscount.find(
                                                            (p) =>
                                                                ((p.originalPrice! - p.price) /
                                                                    p.originalPrice!) *
                                                                100 ===
                                                                bestDiscount
                                                        );
                                                        return bestProduct ? (
                                                            <div className="flex items-center gap-3">
                                                                <div className="relative w-10 h-10 rounded-md overflow-hidden bg-secondary">
                                                                    <Image
                                                                        src={bestProduct.image}
                                                                        alt={bestProduct.name}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-sm line-clamp-1">
                                                                        {bestProduct.name}
                                                                    </p>
                                                                    <p className="text-green-500 font-semibold">
                                                                        {Math.round(bestDiscount)}% off
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ) : null;
                                                    })()}
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-12 text-center">
                            <p className="text-muted-foreground mb-4">
                                Need more options? Browse our full catalog.
                            </p>
                            <Link href="/shop">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="gap-2 rounded-full"
                                >
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
