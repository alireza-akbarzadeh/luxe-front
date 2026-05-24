import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";


import { useSearchParams } from "../hooks/useSearchParams";
import { useSearchStore } from "../search.store";
import { products, stores } from "../../store/data";
import { IconLoader2, IconSearch, IconX, IconCommand, IconTag, IconArrowRight, IconClock, IconTrendingUp, IconSparkles } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface SearchHero {
    filteredProducts: any
}

export function SearchHero(props: SearchHero) {
    const { filteredProducts } = props
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const searchStore = useSearchStore();
    const searchParams = useSearchParams()


    const [inputValue, setInputValue] = useState(searchParams.query);


    // Sync input with URL param
    useEffect(() => {
        setInputValue(searchParams.query);
    }, [searchParams.query]);

    // Get suggestions based on input
    const suggestions = useMemo(() => {
        if (!inputValue.trim()) return [];
        return searchStore.getSuggestions(inputValue);
    }, [inputValue, searchStore]);

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
                if (!suggestion) return
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

    return (
        <section className="relative border-b bg-linear-to-b from-secondary/50 to-background">
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
                                <IconLoader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                            ) : (
                                <IconSearch className="h-5 w-5 text-muted-foreground" />
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
                                    <IconX className="h-4 w-4" />
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
                            <IconCommand className="h-2.5 w-2.5 inline" />K
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
                                                        <IconTag className="h-5 w-5 text-muted-foreground" />
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
                                                <IconArrowRight className="h-4 w-4 text-muted-foreground" />
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
                                                        <IconClock className="h-3 w-3" />
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
                                                            <IconClock className="h-3 w-3 text-muted-foreground" />
                                                            {item.query}
                                                            <IconX
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
                                                <IconTrendingUp className="h-3 w-3" />
                                                Trending Searches
                                            </div>
                                            <div className="flex flex-wrap gap-2 px-3 pb-2">
                                                {searchStore.trendingSearches.map((query) => (
                                                    <button
                                                        key={query}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-accent/50 rounded-full text-sm hover:bg-accent transition-colors"
                                                        onClick={() => handleSearch(query)}
                                                    >
                                                        <IconSparkles className="h-3 w-3 text-primary" />
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
                                        <IconSearch className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
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
    )
}
