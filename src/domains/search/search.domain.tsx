"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    X,
    SlidersHorizontal,
    Grid3X3,
    List,
    ChevronDown,
    Clock,
    TrendingUp,
    Sparkles,
    Store,
    Tag,
    ArrowRight,
    Star,
    Heart,
    ShoppingCart,
    Mic,
    Command,
    LayoutGrid,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { products, stores, productCategories } from "@/lib/data";
import { useSearchParams } from "@/hooks/use-search-params";
import { useSearchStore, type SearchSuggestion } from "@/lib/stores/search-store";
import Image from "next/image";
import Link from "next/link";

const sortOptions = [
    { label: "Most Relevant", value: "relevance" },
    { label: "Newest First", value: "newest" },
    { label: "Price: Low to High", value: "price-asc" },
    { label: "Price: High to Low", value: "price-desc" },
    { label: "Highest Rated", value: "rating" },
    { label: "Most Popular", value: "popular" },
];

export default function SearchPage() {
    const searchParams = useSearchParams();
    const searchStore = useSearchStore();

    const [inputValue, setInputValue] = useState(searchParams.query);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Sync input with URL param
    useEffect(() => {
        setInputValue(searchParams.query);
    }, [searchParams.query]);

    // Get suggestions based on input
    const suggestions = useMemo(() => {
        if (!inputValue.trim()) return [];
        return searchStore.getSuggestions(inputValue);
    }, [inputValue, searchStore]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Search query
        if (searchParams.query) {
            const q = searchParams.query.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.category.toLowerCase().includes(q) ||
                    p.description?.toLowerCase().includes(q)
            );
        }

        // Category filter
        if (searchParams.categories.length > 0) {
            result = result.filter((p) =>
                searchParams.categories.some(
                    (c) => p.category.toLowerCase() === c.toLowerCase()
                )
            );
        }

        // Store filter
        if (searchParams.stores.length > 0) {
            result = result.filter((p) =>
                searchParams.stores.includes(p.storeId)
            );
        }

        // Price range
        result = result.filter(
            (p) =>
                p.price >= searchParams.priceRange[0] &&
                p.price <= searchParams.priceRange[1]
        );

        // Rating filter
        if (searchParams.minRating > 0) {
            result = result.filter((p) => p.rating >= searchParams.minRating);
        }

        // On sale
        if (searchParams.onSale) {
            result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
        }

        // New arrivals
        if (searchParams.isNew) {
            result = result.filter((p) => p.isNew);
        }

        // Digital products
        if (searchParams.isDigital) {
            result = result.filter((p) => p.isDigital);
        }

        // Sort
        switch (searchParams.sortBy) {
            case "newest":
                result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "rating":
                result.sort((a, b) => b.rating - a.rating);
                break;
            case "popular":
                result.sort((a, b) => b.reviews - a.reviews);
                break;
            default:
                // relevance - keep original order or sort by match quality
                if (searchParams.query) {
                    const q = searchParams.query.toLowerCase();
                    result.sort((a, b) => {
                        const aNameMatch = a.name.toLowerCase().startsWith(q) ? 2 : a.name.toLowerCase().includes(q) ? 1 : 0;
                        const bNameMatch = b.name.toLowerCase().startsWith(q) ? 2 : b.name.toLowerCase().includes(q) ? 1 : 0;
                        return bNameMatch - aNameMatch;
                    });
                }
        }

        return result;
    }, [searchParams]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / searchParams.perPage);
    const paginatedProducts = filteredProducts.slice(
        (searchParams.page - 1) * searchParams.perPage,
        searchParams.page * searchParams.perPage
    );

    // Handle search submission
    const handleSearch = useCallback(
        (query: string) => {
            setShowSuggestions(false);
            setIsSearching(true);
            searchParams.setQuery(query);
            searchStore.addRecentSearch(query, filteredProducts.length);
            searchStore.incrementSearchCount();
            setTimeout(() => setIsSearching(false), 300);
        },
        [searchParams, searchStore, filteredProducts.length]
    );

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (focusedSuggestion >= 0 && suggestions[focusedSuggestion]) {
                const suggestion = suggestions[focusedSuggestion];
                if (suggestion.type === "product") {
                    window.location.href = `/product/${suggestion.id}`;
                } else if (suggestion.type === "store") {
                    window.location.href = `/store/${suggestion.slug}`;
                } else if (suggestion.type === "category") {
                    searchParams.toggleCategory(suggestion.name);
                    setShowSuggestions(false);
                } else {
                    handleSearch(suggestion.name);
                }
            } else {
                handleSearch(inputValue);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedSuggestion((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Escape") {
            setShowSuggestions(false);
            inputRef.current?.blur();
        }
    };

    // Recently viewed products
    const recentlyViewedProducts = products.filter((p) =>
        searchStore.recentlyViewedProducts.includes(p.id)
    );

    // Available categories from current results
    const availableCategories = useMemo(() => {
        const cats = new Set(products.map((p) => p.category));
        return Array.from(cats).sort();
    }, []);

    // Filter sidebar content
    const FilterContent = () => (
        <div className="space-y-6">
            {/* Categories */}
            <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Categories
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableCategories.map((cat) => (
                        <label
                            key={cat}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <Checkbox
                                checked={searchParams.categories.includes(cat)}
                                onCheckedChange={() => searchParams.toggleCategory(cat)}
                            />
                            <span className="text-sm group-hover:text-primary transition-colors">
                                {cat}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                                {products.filter((p) => p.category === cat).length}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Stores */}
            <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Stores
                </h3>
                <div className="space-y-2">
                    {stores.map((store) => (
                        <label
                            key={store.id}
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <Checkbox
                                checked={searchParams.stores.includes(store.id)}
                                onCheckedChange={() => searchParams.toggleStore(store.id)}
                            />
                            <Image
                                src={store.logo}
                                alt={store.name}
                                width={20}
                                height={20}
                                className="rounded-full"
                            />
                            <span className="text-sm group-hover:text-primary transition-colors">
                                {store.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <Slider
                    value={searchParams.priceRange}
                    min={0}
                    max={1000}
                    step={10}
                    onValueChange={(v) => searchParams.setPriceRange(v as [number, number])}
                    className="mb-2"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${searchParams.priceRange[0]}</span>
                    <span>${searchParams.priceRange[1]}</span>
                </div>
            </div>

            <Separator />

            {/* Rating */}
            <div>
                <h3 className="font-semibold mb-3">Minimum Rating</h3>
                <div className="flex gap-1">
                    {[0, 3, 4, 4.5].map((rating) => (
                        <Button
                            key={rating}
                            variant={searchParams.minRating === rating ? "default" : "outline"}
                            size="sm"
                            onClick={() => searchParams.setMinRating(rating)}
                            className="flex-1"
                        >
                            {rating === 0 ? "Any" : `${rating}+`}
                        </Button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Quick Filters */}
            <div>
                <h3 className="font-semibold mb-3">Quick Filters</h3>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            checked={searchParams.onSale}
                            onCheckedChange={(checked) => searchParams.setOnSale(!!checked)}
                        />
                        <span className="text-sm">On Sale</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            checked={searchParams.isNew}
                            onCheckedChange={(checked) => searchParams.setIsNew(!!checked)}
                        />
                        <span className="text-sm">New Arrivals</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                            checked={searchParams.isDigital}
                            onCheckedChange={(checked) => searchParams.setIsDigital(!!checked)}
                        />
                        <span className="text-sm">Digital Products</span>
                    </label>
                </div>
            </div>

            {/* Clear Filters */}
            {searchParams.hasActiveFilters && (
                <>
                    <Separator />
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={searchParams.clearFilters}
                    >
                        Clear All Filters
                    </Button>
                </>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Search Hero */}
            <section className="relative border-b bg-gradient-to-b from-secondary/50 to-background">
                <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Discover Your Next Favorite
                        </h1>
                        <p className="text-muted-foreground">
                            Search across {products.length} products from {stores.length} premium stores
                        </p>
                    </motion.div>

                    {/* Search Input */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative max-w-2xl mx-auto"
                    >
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {isSearching ? (
                                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                ) : (
                                    <Search className="h-5 w-5 text-muted-foreground" />
                                )}
                            </div>
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="Search products, stores, categories..."
                                value={inputValue}
                                onChange={(e) => {
                                    setInputValue(e.target.value);
                                    setShowSuggestions(true);
                                    setFocusedSuggestion(-1);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                onKeyDown={handleKeyDown}
                                className="w-full h-14 pl-12 pr-24 text-lg rounded-2xl border-2 focus:border-primary bg-background shadow-lg"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                {inputValue && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => {
                                            setInputValue("");
                                            searchParams.setQuery("");
                                            inputRef.current?.focus();
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    size="sm"
                                    className="h-10 px-4 rounded-xl"
                                    onClick={() => handleSearch(inputValue)}
                                >
                                    Search
                                </Button>
                            </div>
                        </div>

                        {/* Keyboard shortcut hint */}
                        <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-xs text-muted-foreground">
                            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">
                                <Command className="h-2.5 w-2.5 inline" />K
                            </kbd>
                            <span>to search anywhere</span>
                        </div>

                        {/* Suggestions Dropdown */}
                        <AnimatePresence>
                            {showSuggestions && (inputValue || searchStore.recentSearches.length > 0) && (
                                <motion.div
                                    ref={suggestionsRef}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-2xl shadow-xl overflow-hidden z-50"
                                >
                                    {/* Suggestions when typing */}
                                    {inputValue && suggestions.length > 0 && (
                                        <div className="p-2">
                                            <div className="text-xs font-medium text-muted-foreground px-3 py-2">
                                                Suggestions
                                            </div>
                                            {suggestions.map((suggestion, index) => (
                                                <button
                                                    key={`${suggestion.type}-${suggestion.id || suggestion.name}`}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-colors ${index === focusedSuggestion
                                                            ? "bg-accent"
                                                            : "hover:bg-secondary"
                                                        }`}
                                                    onMouseEnter={() => setFocusedSuggestion(index)}
                                                    onClick={() => {
                                                        if (suggestion.type === "product") {
                                                            window.location.href = `/product/${suggestion.id}`;
                                                        } else if (suggestion.type === "store") {
                                                            window.location.href = `/store/${suggestion.slug}`;
                                                        } else if (suggestion.type === "category") {
                                                            searchParams.toggleCategory(suggestion.name);
                                                            setShowSuggestions(false);
                                                        } else {
                                                            handleSearch(suggestion.name);
                                                        }
                                                    }}
                                                >
                                                    {suggestion.type === "product" && suggestion.image && (
                                                        <Image
                                                            src={suggestion.image}
                                                            alt={suggestion.name}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-lg object-cover"
                                                        />
                                                    )}
                                                    {suggestion.type === "store" && suggestion.image && (
                                                        <Image
                                                            src={suggestion.image}
                                                            alt={suggestion.name}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full object-cover"
                                                        />
                                                    )}
                                                    {suggestion.type === "category" && (
                                                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                                                            <Tag className="h-5 w-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 text-left">
                                                        <div className="font-medium text-sm">{suggestion.name}</div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {suggestion.type === "product" && suggestion.category}
                                                            {suggestion.type === "store" && "Store"}
                                                            {suggestion.type === "category" && "Category"}
                                                        </div>
                                                    </div>
                                                    {suggestion.type === "product" && suggestion.price && (
                                                        <span className="font-semibold text-sm">
                                                            ${suggestion.price}
                                                        </span>
                                                    )}
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* No input - show recent and trending */}
                                    {!inputValue && (
                                        <div className="p-2">
                                            {/* Recent Searches */}
                                            {searchStore.recentSearches.length > 0 && (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between px-3 py-2">
                                                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            Recent Searches
                                                        </span>
                                                        <button
                                                            className="text-xs text-primary hover:underline"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                searchStore.clearRecentSearches();
                                                            }}
                                                        >
                                                            Clear
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 px-3">
                                                        {searchStore.recentSearches.slice(0, 6).map((item) => (
                                                            <button
                                                                key={item.query}
                                                                className="flex items-center gap-1 px-3 py-1.5 bg-secondary rounded-full text-sm hover:bg-secondary/80 transition-colors group"
                                                                onClick={() => handleSearch(item.query)}
                                                            >
                                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                                {item.query}
                                                                <X
                                                                    className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        searchStore.removeRecentSearch(item.query);
                                                                    }}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Trending Searches */}
                                            <div>
                                                <div className="text-xs font-medium text-muted-foreground px-3 py-2 flex items-center gap-1">
                                                    <TrendingUp className="h-3 w-3" />
                                                    Trending Searches
                                                </div>
                                                <div className="flex flex-wrap gap-2 px-3 pb-2">
                                                    {searchStore.trendingSearches.map((query) => (
                                                        <button
                                                            key={query}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-accent/50 rounded-full text-sm hover:bg-accent transition-colors"
                                                            onClick={() => handleSearch(query)}
                                                        >
                                                            <Sparkles className="h-3 w-3 text-primary" />
                                                            {query}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* No results */}
                                    {inputValue && suggestions.length === 0 && (
                                        <div className="p-8 text-center">
                                            <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                No suggestions found for &quot;{inputValue}&quot;
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Press Enter to search anyway
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Popular Categories */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-2 mt-12"
                    >
                        {searchStore.popularCategories.map((cat) => (
                            <Button
                                key={cat}
                                variant={searchParams.categories.includes(cat) ? "default" : "outline"}
                                size="sm"
                                className="rounded-full"
                                onClick={() => searchParams.toggleCategory(cat)}
                            >
                                {cat}
                            </Button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Results Section */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Filters Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 bg-card border rounded-2xl p-6">
                            <h2 className="font-semibold mb-4 flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                                {searchParams.activeFilterCount > 0 && (
                                    <Badge variant="secondary" className="ml-auto">
                                        {searchParams.activeFilterCount}
                                    </Badge>
                                )}
                            </h2>
                            <FilterContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Results Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                            <div>
                                <h2 className="font-semibold text-lg">
                                    {searchParams.query ? (
                                        <>
                                            Results for &quot;{searchParams.query}&quot;
                                        </>
                                    ) : (
                                        "All Products"
                                    )}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {filteredProducts.length} products found
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Mobile Filter Button */}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="lg:hidden">
                                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                                            Filters
                                            {searchParams.activeFilterCount > 0 && (
                                                <Badge variant="secondary" className="ml-2">
                                                    {searchParams.activeFilterCount}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-80">
                                        <SheetHeader>
                                            <SheetTitle>Filters</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6">
                                            <FilterContent />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                {/* Sort */}
                                <Select
                                    value={searchParams.sortBy}
                                    onValueChange={(v) => searchParams.setSortBy(v as any)}
                                >
                                    <SelectTrigger className="w-44">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                {/* View Mode */}
                                <div className="hidden sm:flex items-center border rounded-lg p-1">
                                    <Button
                                        variant={searchParams.view === "grid" ? "secondary" : "ghost"}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => searchParams.setView("grid")}
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={searchParams.view === "list" ? "secondary" : "ghost"}
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => searchParams.setView("list")}
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Active Filters */}
                        {searchParams.hasActiveFilters && (
                            <div className="flex flex-wrap items-center gap-2 mb-6">
                                <span className="text-sm text-muted-foreground">Active filters:</span>
                                {searchParams.categories.map((cat) => (
                                    <Badge
                                        key={cat}
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => searchParams.toggleCategory(cat)}
                                    >
                                        {cat}
                                        <X className="h-3 w-3 ml-1" />
                                    </Badge>
                                ))}
                                {searchParams.stores.map((storeId) => {
                                    const store = stores.find((s) => s.id === storeId);
                                    return (
                                        <Badge
                                            key={storeId}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                            onClick={() => searchParams.toggleStore(storeId)}
                                        >
                                            {store?.name || storeId}
                                            <X className="h-3 w-3 ml-1" />
                                        </Badge>
                                    );
                                })}
                                {(searchParams.priceRange[0] > 0 || searchParams.priceRange[1] < 1000) && (
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => searchParams.setPriceRange([0, 1000])}
                                    >
                                        ${searchParams.priceRange[0]} - ${searchParams.priceRange[1]}
                                        <X className="h-3 w-3 ml-1" />
                                    </Badge>
                                )}
                                {searchParams.minRating > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => searchParams.setMinRating(0)}
                                    >
                                        {searchParams.minRating}+ stars
                                        <X className="h-3 w-3 ml-1" />
                                    </Badge>
                                )}
                                {searchParams.onSale && (
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => searchParams.setOnSale(false)}
                                    >
                                        On Sale
                                        <X className="h-3 w-3 ml-1" />
                                    </Badge>
                                )}
                                {searchParams.isNew && (
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => searchParams.setIsNew(false)}
                                    >
                                        New Arrivals
                                        <X className="h-3 w-3 ml-1" />
                                    </Badge>
                                )}
                                {searchParams.isDigital && (
                                    <Badge
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                                        onClick={() => searchParams.setIsDigital(false)}
                                    >
                                        Digital
                                        <X className="h-3 w-3 ml-1" />
                                    </Badge>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-primary"
                                    onClick={searchParams.clearFilters}
                                >
                                    Clear all
                                </Button>
                            </div>
                        )}

                        {/* Products Grid/List */}
                        {paginatedProducts.length > 0 ? (
                            <>
                                <div
                                    className={
                                        searchParams.view === "grid"
                                            ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
                                            : "flex flex-col gap-4"
                                    }
                                >
                                    {paginatedProducts.map((product, index) =>
                                        searchParams.view === "grid" ? (
                                            <ProductCard key={product.id} product={product} index={index} />
                                        ) : (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Link
                                                    href={`/product/${product.id}`}
                                                    className="flex gap-4 p-4 bg-card border rounded-xl hover:shadow-lg transition-shadow group"
                                                >
                                                    <div className="relative w-32 h-32 shrink-0 rounded-lg overflow-hidden bg-secondary">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        {product.isNew && (
                                                            <Badge className="absolute top-2 left-2" variant="secondary">
                                                                New
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                                            {product.category}
                                                        </span>
                                                        <h3 className="font-semibold mt-1 group-hover:text-primary transition-colors">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                                            {product.description}
                                                        </p>
                                                        <div className="flex items-center gap-4 mt-2">
                                                            <div className="flex items-center gap-1">
                                                                <Star className="h-4 w-4 fill-accent text-accent" />
                                                                <span className="text-sm">
                                                                    {product.rating} ({product.reviews})
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold">${product.price}</span>
                                                                {product.originalPrice && (
                                                                    <span className="text-sm text-muted-foreground line-through">
                                                                        ${product.originalPrice}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-2 justify-center">
                                                        <Button size="icon" variant="outline">
                                                            <Heart className="h-4 w-4" />
                                                        </Button>
                                                        <Button size="icon">
                                                            <ShoppingCart className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        )
                                    )}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 mt-8">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={searchParams.page === 1}
                                            onClick={() => searchParams.setPage(searchParams.page - 1)}
                                        >
                                            Previous
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (searchParams.page <= 3) {
                                                    pageNum = i + 1;
                                                } else if (searchParams.page >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = searchParams.page - 2 + i;
                                                }
                                                return (
                                                    <Button
                                                        key={pageNum}
                                                        variant={searchParams.page === pageNum ? "default" : "outline"}
                                                        size="sm"
                                                        className="w-10"
                                                        onClick={() => searchParams.setPage(pageNum)}
                                                    >
                                                        {pageNum}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={searchParams.page === totalPages}
                                            onClick={() => searchParams.setPage(searchParams.page + 1)}
                                        >
                                            Next
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16"
                            >
                                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-10 w-10 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                    {searchParams.query
                                        ? `We couldn't find any products matching "${searchParams.query}". Try adjusting your search or filters.`
                                        : "No products match your current filters. Try removing some filters."}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                    <Button onClick={searchParams.clearAll}>Clear All</Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/shop">Browse All Products</Link>
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Recently Viewed */}
                {recentlyViewedProducts.length > 0 && (
                    <section className="mt-16 pt-8 border-t">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Recently Viewed
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={searchStore.clearRecentlyViewedProducts}
                            >
                                Clear
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {recentlyViewedProducts.slice(0, 6).map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    </section>
                )}
            </section>

            <Footer />
        </div>
    );
}
