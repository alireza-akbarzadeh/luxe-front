'use client';

import {
  IconArrowRight,
  IconClock,
  IconCornerDownLeft,
  IconSearch,
  IconSparkles,
  IconTag,
  IconTrendingUp,
  IconX
} from '@tabler/icons-react';
import Image from 'next/image';

import { Separator } from '@/components/ui/separator';
import type { DtoSuggestionItem } from '@/services/-search-suggestions-get.schemas';

import type { SearchHistoryItem } from '../search.store';

interface SearchSuggestionsPanelProps {
  inputValue: string;
  suggestions: DtoSuggestionItem[];
  suggestionsLoading: boolean;
  focusedSuggestion: number;
  recentSearches: SearchHistoryItem[];
  trendingSearches: string[];
  onSuggestionClick: (suggestion: DtoSuggestionItem) => void;
  onRecentSearchClick: (query: string) => void;
  onTrendingSearchClick: (query: string) => void;
  onRemoveRecentSearch: (query: string) => void;
  onClearRecentSearches: () => void;
  onFocusSuggestion: (index: number) => void;
}

/** Shared suggestions body for desktop dropdown and mobile search sheet. */
export function SearchSuggestionsPanel({
  inputValue,
  suggestions,
  suggestionsLoading,
  focusedSuggestion,
  recentSearches,
  trendingSearches,
  onSuggestionClick,
  onRecentSearchClick,
  onTrendingSearchClick,
  onRemoveRecentSearch,
  onClearRecentSearches,
  onFocusSuggestion
}: SearchSuggestionsPanelProps) {
  if (inputValue && suggestionsLoading) {
    return (
      <div className='text-muted-foreground p-8 text-center text-sm'>Loading suggestions…</div>
    );
  }

  if (inputValue && suggestions.length > 0) {
    return (
      <div className='p-2'>
        <div className='text-muted-foreground px-3 py-2 text-xs font-medium'>Suggestions</div>
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.type}-${suggestion.id || suggestion.name}`}
            type='button'
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
              index === focusedSuggestion ? 'bg-accent/20' : 'hover:bg-accent/10'
            }`}
            onMouseEnter={() => onFocusSuggestion(index)}
            onClick={() => onSuggestionClick(suggestion)}
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
            <div className='min-w-0 flex-1 text-left'>
              <div className='truncate text-sm font-medium'>{suggestion.name}</div>
              <div className='text-muted-foreground text-xs capitalize'>{suggestion.type}</div>
            </div>
            {suggestion.type === 'product' && suggestion.price != null && (
              <span className='shrink-0 text-sm font-semibold tabular-nums'>
                ${suggestion.price}
              </span>
            )}
            <IconArrowRight className='text-muted-foreground h-4 w-4 shrink-0' />
          </button>
        ))}
        <Separator className='my-2' />
        <div className='text-muted-foreground flex items-center gap-2 px-3 pb-1 text-xs'>
          <div className='rounded-xs border p-px'>
            <IconCornerDownLeft className='h-4 w-4' />
          </div>
          <span>Press Enter to search</span>
        </div>
      </div>
    );
  }

  if (inputValue && suggestions.length === 0 && !suggestionsLoading) {
    return (
      <div className='p-8 text-center'>
        <IconSearch className='text-muted-foreground mx-auto mb-2 h-8 w-8' />
        <p className='text-muted-foreground text-sm'>
          No suggestions found for &quot;{inputValue}&quot;
        </p>
        <p className='text-muted-foreground mt-1 text-xs'>Press Enter to search anyway</p>
      </div>
    );
  }

  return (
    <div className='space-y-4 p-2'>
      {recentSearches.length > 0 && (
        <div>
          <div className='flex items-center justify-between px-3 py-2'>
            <span className='text-muted-foreground flex items-center gap-1 text-xs font-medium'>
              <IconClock className='h-3 w-3' />
              Recent Searches
            </span>
            <button
              type='button'
              className='text-primary text-xs hover:underline'
              onClick={onClearRecentSearches}
            >
              Clear
            </button>
          </div>
          <div className='flex flex-wrap gap-2 px-3'>
            {recentSearches.slice(0, 6).map((item) => (
              <button
                key={item.query}
                type='button'
                className='bg-secondary hover:bg-secondary/80 group flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors'
                onClick={() => onRecentSearchClick(item.query)}
              >
                <IconClock className='text-muted-foreground h-3 w-3 shrink-0' />
                {item.query}
                <IconX
                  className='text-muted-foreground h-3 w-3 shrink-0 opacity-60'
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveRecentSearch(item.query);
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

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
                type='button'
                className='bg-accent/20 hover:bg-accent/30 flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors'
                onClick={() => onTrendingSearchClick(query ?? '')}
              >
                <IconSparkles className='text-primary h-3 w-3 shrink-0' />
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
