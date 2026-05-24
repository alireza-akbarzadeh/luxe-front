import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { IconShoppingCart, IconTag } from "@tabler/icons-react";
import { products, stores } from "../../store/data";
import Image from "next/image";
import { useSearchParams } from "../hooks/useSearchParams";
import { Button } from "~/src/components/ui/button";
import { useMemo } from "react";

export function SearchFilterContent() {
    const searchParams = useSearchParams();
    // Available categories from current results
    const availableCategories = useMemo(() => {
        const cats = new Set(products.map((p) => p.category));
        return Array.from(cats).sort();
    }, []);
    return (
        <div className="space-y-6">
            {/* Categories */}
            <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <IconTag className="h-4 w-4" />
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
                    <IconShoppingCart className="h-4 w-4" />
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
    )
}
