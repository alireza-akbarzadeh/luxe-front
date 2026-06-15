'use client';

import { IconLoader2, IconSearch, IconX } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useSearchHeroController } from '@/domains/search/hooks/useSearchHeroController';
import { useSearchStore } from '@/domains/search/search.store';

import { SearchSuggestionsPanel } from './search-suggestions-panel';

const sheetCloseButtonClass = '[&>button.absolute]:hidden';

/** Mobile-native search drawer — opened from navbar or search page compact bar. */
export function SearchMobileSheet() {
  const isOpen = useSearchStore((state) => state.isSearchSheetOpen);
  const setSearchSheetOpen = useSearchStore((state) => state.setSearchSheetOpen);

  return (
    <Sheet open={isOpen} onOpenChange={setSearchSheetOpen}>
      {isOpen ? <SearchMobileSheetContent /> : null}
    </Sheet>
  );
}

function SearchMobileSheetContent() {
  const closeSearchSheet = useSearchStore((state) => state.closeSearchSheet);
  const {
    isSearching,
    handleSearch,
    handleKeyDown,
    handleSuggestionClick,
    suggestionsLoading,
    setInputValue,
    inputRef,
    inputValue,
    setShowSuggestions,
    setFocusedSuggestion,
    searchStore,
    suggestions,
    focusedSuggestion,
    trendingSearches
  } = useSearchHeroController({ autoFocus: true, closeOnNavigate: true });

  return (
    <SheetContent
      side='bottom'
      className={`flex h-[96dvh] max-h-[96dvh] flex-col gap-0 rounded-t-3xl border-t p-0 sm:max-w-none ${sheetCloseButtonClass}`}
    >
      <div className='flex shrink-0 justify-center pt-3 pb-1' aria-hidden>
        <div className='bg-muted-foreground/25 h-1.5 w-12 rounded-full' />
      </div>

      <SheetHeader className='border-border shrink-0 border-b px-6 py-4 text-left'>
        <div className='flex items-start justify-between gap-3'>
          <div className='space-y-1'>
            <SheetTitle className='font-display text-xl'>Search</SheetTitle>
            <SheetDescription>Find products, stores, and categories</SheetDescription>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-muted-foreground shrink-0'
            onClick={closeSearchSheet}
          >
            Close
          </Button>
        </div>
      </SheetHeader>

      <div className='border-border shrink-0 border-b px-6 py-4'>
        <div className='relative'>
          <div className='absolute top-1/2 left-3 flex -translate-y-1/2 items-center'>
            {isSearching || suggestionsLoading ? (
              <IconLoader2 className='text-muted-foreground h-5 w-5 animate-spin' />
            ) : (
              <IconSearch className='text-muted-foreground h-5 w-5' />
            )}
          </div>
          <Input
            ref={inputRef}
            type='text'
            enterKeyHint='search'
            autoComplete='off'
            autoCorrect='off'
            spellCheck={false}
            placeholder='Search products, stores, categories…'
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
              setFocusedSuggestion(-1);
            }}
            onKeyDown={handleKeyDown}
            className='focus:border-primary bg-background h-12 rounded-full pr-20 pl-11'
          />
          <div className='absolute top-1/2 right-2 flex -translate-y-1/2 items-center gap-1'>
            {inputValue ? (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
                aria-label='Clear search'
                onClick={() => {
                  setInputValue('');
                  inputRef.current?.focus();
                }}
              >
                <IconX className='h-4 w-4' />
              </Button>
            ) : null}
            <Button
              type='button'
              size='sm'
              className='h-8 rounded-full px-3'
              onClick={() => handleSearch(inputValue)}
            >
              Go
            </Button>
          </div>
        </div>
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2 pb-[max(1rem,env(safe-area-inset-bottom))]'>
        {(inputValue || searchStore.recentSearches.length > 0 || trendingSearches.length > 0) && (
          <SearchSuggestionsPanel
            inputValue={inputValue}
            suggestions={suggestions}
            suggestionsLoading={suggestionsLoading}
            focusedSuggestion={focusedSuggestion}
            recentSearches={searchStore.recentSearches}
            trendingSearches={trendingSearches}
            onSuggestionClick={handleSuggestionClick}
            onRecentSearchClick={handleSearch}
            onTrendingSearchClick={handleSearch}
            onRemoveRecentSearch={searchStore.removeRecentSearch}
            onClearRecentSearches={searchStore.clearRecentSearches}
            onFocusSuggestion={setFocusedSuggestion}
          />
        )}
      </div>
    </SheetContent>
  );
}
