'use client';

import {
  IconCommand,
  IconLoader2,
  IconSearch,
  IconX
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSearchHeroController } from '@/domains/search/hooks/useSearchHeroController';
import { useSearchParams } from '@/domains/search/hooks/useSearchParams';
import { useSearchStore } from '@/domains/search/search.store';

import { SearchSuggestionsPanel } from '../components/search-suggestions-panel';

function SearchHeroMobileBar() {
  const t = useTranslations('search.hero');
  const searchParams = useSearchParams();
  const openSearchSheet = useSearchStore((state) => state.openSearchSheet);

  return (
    <section className='from-secondary/50 to-background relative border-b bg-linear-to-b pt-20 lg:hidden'>
      <div className='mx-auto max-w-5xl px-4 py-8'>
        <div className='mb-6 text-center'>
          <h1 className='mb-2 text-2xl font-bold'>{t('title')}</h1>
          <p className='text-muted-foreground text-sm'>{t('subtitle')}</p>
        </div>

        <button
          type='button'
          onClick={openSearchSheet}
          className='bg-background hover:border-primary/40 flex h-12 w-full items-center gap-3 rounded-full border-2 px-4 text-start shadow-sm transition-colors'
        >
          <IconSearch className='text-muted-foreground h-5 w-5 shrink-0' />
          <span
            className={
              searchParams.query
                ? 'truncate text-sm'
                : 'text-muted-foreground truncate text-sm'
            }
          >
            {searchParams.query || t('placeholder')}
          </span>
        </button>
      </div>
    </section>
  );
}

function SearchHeroDesktop() {
  const t = useTranslations('search.hero');
  const {
    isSearching,
    handleSearch,
    trendingSearches,
    handleKeyDown,
    handleSuggestionClick,
    suggestionsLoading,
    suggestionsRef,
    popularCategories,
    setInputValue,
    inputRef,
    inputValue,
    setShowSuggestions,
    setFocusedSuggestion,
    showSuggestions,
    searchStore,
    suggestions,
    focusedSuggestion
  } = useSearchHeroController();
  const searchParams = useSearchParams();

  return (
    <section className='from-secondary/50 to-background relative hidden border-b bg-linear-to-b pt-20 lg:block'>
      <div className='mx-auto max-w-5xl px-4 py-12 md:py-16'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8 text-center'
        >
          <h1 className='mb-2 text-3xl font-bold md:text-4xl'>{t('title')}</h1>
          <p className='text-muted-foreground'>{t('subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='relative mx-auto max-w-2xl'
        >
          <div className='relative'>
            <div className='absolute top-1/2 start-4 flex -translate-y-1/2 items-center gap-2'>
              {isSearching || suggestionsLoading ? (
                <IconLoader2 className='text-muted-foreground h-5 w-5 animate-spin' />
              ) : (
                <IconSearch className='text-muted-foreground h-5 w-5' />
              )}
            </div>
            <Input
              ref={inputRef}
              type='text'
              placeholder={t('placeholder')}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
                setFocusedSuggestion(-1);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={handleKeyDown}
              className='focus:border-primary bg-background h-14 w-full rounded-2xl border-2 pe-24 ps-12 text-lg shadow-lg'
            />
            <div className='absolute top-1/2 end-2 flex -translate-y-1/2 items-center gap-1'>
              {inputValue ? (
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={async () => {
                    setInputValue('');
                    await searchParams.setQuery('');
                    inputRef.current?.focus();
                  }}
                >
                  <IconX className='h-4 w-4' />
                </Button>
              ) : null}
              <Button
                size='sm'
                className='h-10 rounded-xl px-4'
                onClick={() => handleSearch(inputValue)}
              >
                {t('searchButton')}
              </Button>
            </div>
          </div>

          <div className='text-muted-foreground absolute -bottom-6 start-0 flex items-center gap-1 text-xs'>
            <kbd className='bg-muted rounded px-1.5 py-0.5 font-mono text-[10px]'>
              <IconCommand className='inline h-2.5 w-2.5' />K
            </kbd>
            <span>{t('keyboardHint')}</span>
          </div>

          <AnimatePresence>
            {showSuggestions && (inputValue || searchStore.recentSearches.length > 0) ? (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='bg-card absolute top-full end-0 start-0 z-50 mt-2 overflow-hidden rounded-2xl border shadow-xl'
              >
                <div className='custom-scrollbar max-h-100 overflow-y-auto'>
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
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>

        {popularCategories.length > 0 ? (
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
        ) : null}
      </div>
    </section>
  );
}

export function SearchHero() {
  return (
    <>
      <SearchHeroMobileBar />
      <SearchHeroDesktop />
    </>
  );
}
