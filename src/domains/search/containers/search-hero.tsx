'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  IconArrowRight,
  IconClock,
  IconCommand,
  IconLoader2,
  IconSearch,
  IconSparkles,
  IconTag,
  IconTrendingUp,
  IconX
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useGetCategories } from '~/src/services/-categories-get'; // assuming you have this endpoint
import { useGetSearchSuggestions } from '~/src/services/-search-suggestions-get';
import { useGetSearchTrending } from '~/src/services/-search-trending-get';
import { useSearchParams } from '../hooks/useSearchParams';
import { useSearchStore } from '../search.store';

export function SearchHero() {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [focusedSuggestion, setFocusedSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const searchStore = useSearchStore();
  const searchParams = useSearchParams();

  const [inputValue, setInputValue] = useState(searchParams.query);

  // Sync input with URL param
  useEffect(() => {
    setInputValue(searchParams.query);
  }, [searchParams.query]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Fetch suggestions (only when input has value)
  const { data: suggestionsData, isLoading: suggestionsLoading } = useGetSearchSuggestions(
    {
      q: inputValue,
      limit: 8
    },
    {
      query: {
        enabled: inputValue.trim().length > 0 && showSuggestions
      }
    }
  );
  const suggestions = suggestionsData?.data?.suggestions || [];

  // Fetch trending searches
  const { data: trendingData } = useGetSearchTrending({ limit: 6 });
  const trendingSearches = trendingData?.data?.trending?.map((t) => t.query) || [];

  // Fetch popular categories (limit 6)
  const { data: categoriesData } = useGetCategories({ limit: 6, sort: 'popular' });
  const popularCategories = categoriesData?.data?.categories?.map((c) => c.name) || [];

  const handleSearch = useCallback(
    (query: string) => {
      setShowSuggestions(false);
      setIsSearching(true);
      searchParams.setQuery(query);
      // Result count is not known immediately; we can pass 0 or fetch later
      searchStore.addRecentSearch(query, 0);
      searchStore.incrementSearchCount();
      setTimeout(() => setIsSearching(false), 300);
    },
    [searchParams, searchStore]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (focusedSuggestion >= 0 && suggestions[focusedSuggestion]) {
        const suggestion = suggestions[focusedSuggestion];
        if (suggestion.type === 'product') {
          window.open(`/product/${suggestion.id}`, '_blank');
        } else if (suggestion.type === 'store') {
          window.open(`/store/${suggestion.slug}`, '_blank');
        } else if (suggestion.type === 'category') {
          searchParams.toggleCategory(suggestion.name ?? '');
          setShowSuggestions(false);
        } else {
          handleSearch(suggestion.name ?? '');
        }
      } else {
        handleSearch(inputValue);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (suggestion.type === 'product') {
      window.open(`/product/${suggestion.id}`, '_blank');
    } else if (suggestion.type === 'store') {
      window.open(`/store/${suggestion.slug}`, '_blank');
    } else if (suggestion.type === 'category') {
      searchParams.toggleCategory(suggestion.name);
      setShowSuggestions(false);
    } else {
      handleSearch(suggestion.name);
    }
  };

  return (
    <section className='from-secondary/50 to-background relative border-b bg-linear-to-b pt-20'>
      <div className='mx-auto max-w-5xl px-4 py-12 md:py-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 text-center'
        >
          <h1 className='mb-2 text-3xl font-bold md:text-4xl'>Discover Your Next Favorite</h1>
          <p className='text-muted-foreground'>
            Search across thousands of products, stores, and categories
          </p>
        </motion.div>

        {/* Search Input – same JSX, but note suggestions are now from API */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='relative mx-auto max-w-2xl'
        >
          <div className='relative'>
            <div className='absolute top-1/2 left-4 flex -translate-y-1/2 items-center gap-2'>
              {isSearching || suggestionsLoading ? (
                <IconLoader2 className='text-muted-foreground h-5 w-5 animate-spin' />
              ) : (
                <IconSearch className='text-muted-foreground h-5 w-5' />
              )}
            </div>
            <Input
              ref={inputRef}
              type='text'
              placeholder='Search products, stores, categories...'
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
                setFocusedSuggestion(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              className='focus:border-primary bg-background h-14 w-full rounded-2xl border-2 pr-24 pl-12 text-lg shadow-lg'
            />
            <div className='absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1'>
              {inputValue && (
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={() => {
                    setInputValue('');
                    searchParams.setQuery('');
                    inputRef.current?.focus();
                  }}
                >
                  <IconX className='h-4 w-4' />
                </Button>
              )}
              <Button
                size='sm'
                className='h-10 rounded-xl px-4'
                onClick={() => handleSearch(inputValue)}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Keyboard shortcut hint */}
          <div className='text-muted-foreground absolute -bottom-6 left-0 flex items-center gap-1 text-xs'>
            <kbd className='bg-muted rounded px-1.5 py-0.5 font-mono text-[10px]'>
              <IconCommand className='inline h-2.5 w-2.5' />K
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
                className='bg-card absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border shadow-xl'
              >
                <div className='custom-scrollbar max-h-100 overflow-y-auto'>
                  {/* Suggestions when typing */}
                  {inputValue && suggestions.length > 0 && (
                    <div className='p-2'>
                      <div className='text-muted-foreground px-3 py-2 text-xs font-medium'>
                        Suggestions
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={`${suggestion.type}-${suggestion.id || suggestion.name}`}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
                            index === focusedSuggestion ? 'bg-accent/20' : 'hover:bg-accent/10'
                          }`}
                          onMouseEnter={() => setFocusedSuggestion(index)}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.type === 'product' && suggestion.image && (
                            <Image
                              src={suggestion.image}
                              alt={suggestion.name ?? ''}
                              width={40}
                              height={40}
                              className='rounded-lg object-cover'
                            />
                          )}
                          {suggestion.type === 'store' && suggestion.image && (
                            <Image
                              src={suggestion.image}
                              alt={suggestion.name ?? ''}
                              width={40}
                              height={40}
                              className='rounded-full object-cover'
                            />
                          )}
                          {suggestion.type === 'category' && (
                            <div className='bg-secondary flex h-10 w-10 items-center justify-center rounded-lg'>
                              <IconTag className='text-muted-foreground h-5 w-5' />
                            </div>
                          )}
                          <div className='flex-1 text-left'>
                            <div className='text-sm font-medium'>{suggestion.name}</div>
                            <div className='text-muted-foreground text-xs'>
                              {suggestion.type === 'product' && suggestion.name}
                              {suggestion.type === 'store' && 'Store'}
                              {suggestion.type === 'category' && 'Category'}
                            </div>
                          </div>
                          {suggestion.type === 'product' && suggestion.price && (
                            <span className='text-sm font-semibold'>${suggestion.price}</span>
                          )}
                          <IconArrowRight className='text-muted-foreground h-4 w-4' />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No input - show recent and trending */}
                  {!inputValue && (
                    <div className='p-2'>
                      {/* Recent Searches */}
                      {searchStore.recentSearches.length > 0 && (
                        <div className='mb-4'>
                          <div className='flex items-center justify-between px-3 py-2'>
                            <span className='text-muted-foreground flex items-center gap-1 text-xs font-medium'>
                              <IconClock className='h-3 w-3' />
                              Recent Searches
                            </span>
                            <button
                              className='text-primary text-xs hover:underline'
                              onClick={(e) => {
                                e.stopPropagation();
                                searchStore.clearRecentSearches();
                              }}
                            >
                              Clear
                            </button>
                          </div>
                          <div className='flex flex-wrap gap-2 px-3'>
                            {searchStore.recentSearches.slice(0, 6).map((item) => (
                              <button
                                key={item.query}
                                className='bg-secondary hover:bg-secondary/80 group flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors'
                                onClick={() => handleSearch(item.query)}
                              >
                                <IconClock className='text-muted-foreground h-3 w-3' />
                                {item.query}
                                <IconX
                                  className='text-muted-foreground h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100'
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
                      {trendingSearches.length > 0 && (
                        <div>
                          <div className='text-muted-foreground flex items-center gap-1 px-3 py-2 text-xs font-medium'>
                            <IconTrendingUp className='h-3 w-3' />
                            Trending Searches
                          </div>
                          <div className='flex flex-wrap gap-2 px-3 pb-2'>
                            {trendingSearches.map((query) => (
                              <button
                                key={query}
                                className='bg-accent/20 hover:bg-accent/30 flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors'
                                onClick={() => handleSearch(query ?? '')}
                              >
                                <IconSparkles className='text-primary h-3 w-3' />
                                {query}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* No results for suggestions */}
                  {inputValue && suggestions.length === 0 && !suggestionsLoading && (
                    <div className='p-8 text-center'>
                      <IconSearch className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
                      <p className='text-muted-foreground text-sm'>
                        No suggestions found for &quot;{inputValue}&quot;
                      </p>
                      <p className='text-muted-foreground mt-1 text-xs'>
                        Press Enter to search anyway
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Popular Categories */}
        {popularCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='mt-12 flex flex-wrap justify-center gap-2'
          >
            {popularCategories.map((cat) => (
              <Button
                key={cat}
                variant={searchParams.categories.includes(cat) ? 'default' : 'outline'}
                size='sm'
                className='rounded-full'
                onClick={() => searchParams.toggleCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
