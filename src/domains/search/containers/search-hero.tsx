'use client';

import { IconCamera, IconCommand, IconMicrophone, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { useSearchHeroController } from '@/domains/search/hooks/useSearchHeroController';
import { useSearchParams } from '@/domains/search/hooks/useSearchParams';
import { useSearchStore } from '@/domains/search/search.store';

import { SearchInputLeadingIcon } from '../components/search-input-leading-icon';
import { SearchSuggestionsPanel } from '../components/search-suggestions-panel';
import { SearchVoiceMicButton } from '../components/search-voice-mic-button';
import { useSearchVoiceInput } from '../hooks/use-search-voice-input';

function SearchHeroMobileBar() {
  const t = useTranslations('search.hero');
  const searchParams = useSearchParams();
  const openSearchSheet = useSearchStore((state) => state.openSearchSheet);
  const openSearchSheetWithVoice = useSearchStore((state) => state.openSearchSheetWithVoice);
  const tVoice = useTranslations('search.voice');

  return (
    <section className='from-secondary/50 to-background relative border-b bg-linear-to-b pt-20 lg:hidden'>
      <div className='app-container max-w-5xl py-8'>
        <div className='mb-6 text-center'>
          <h1 className='mb-2 text-2xl font-bold'>{t('title')}</h1>
          <p className='text-muted-foreground text-sm'>{t('subtitle')}</p>
        </div>

        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={openSearchSheet}
            className='bg-background hover:border-primary/40 flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full border-2 px-4 text-start shadow-sm transition-colors'
          >
            <SearchInputLeadingIcon isLoading={false} isListening={false} />
            <span
              className={
                searchParams.query ? 'truncate text-sm' : 'text-muted-foreground truncate text-sm'
              }
            >
              {searchParams.query || t('placeholder')}
            </span>
          </button>
          <Button
            type='button'
            variant='outline'
            size='icon'
            className='size-12 shrink-0 rounded-full'
            aria-label={tVoice('startListening')}
            onClick={openSearchSheetWithVoice}
          >
            <IconMicrophone className='h-5 w-5' />
          </Button>
        </div>
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
  const openVisualSearch = useSearchStore((state) => state.openVisualSearch);
  const tVisual = useTranslations('search.visual');
  const tVoice = useTranslations('search.voice');

  const voice = useSearchVoiceInput(inputValue, setInputValue);
  const isLoading = isSearching || suggestionsLoading;

  return (
    <section className='from-secondary/50 to-background relative hidden border-b bg-linear-to-b pt-20 lg:block'>
      <div className='app-container max-w-5xl py-12 md:py-16'>
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
            <div className='absolute start-4 top-1/2 flex -translate-y-1/2 items-center gap-2'>
              <SearchInputLeadingIcon isLoading={isLoading} isListening={voice.isListening} />
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
              className='focus:border-primary bg-background h-14 w-full rounded-2xl border-2 ps-12 pe-32 text-lg shadow-lg'
              aria-label={tVoice('inputLabel')}
            />
            <div className='absolute end-2 top-1/2 flex -translate-y-1/2 items-center gap-1'>
              <SearchVoiceMicButton
                isSupported={voice.isSupported}
                isListening={voice.isListening}
                permissionDenied={voice.permissionDenied}
                onToggle={voice.toggleVoiceSearch}
              />
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-8 w-8'
                aria-label={tVisual('openCamera')}
                onClick={openVisualSearch}
              >
                <IconCamera className='h-4 w-4' />
              </Button>
              {inputValue ? (
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8'
                  onClick={async () => {
                    if (voice.isListening) {
                      voice.stopListening();
                    }
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

          {voice.isListening ? (
            <Typography.Muted
              className='text-accent absolute start-0 -bottom-6 text-xs'
              role='status'
              aria-live='polite'
            >
              {tVoice('listening')}
            </Typography.Muted>
          ) : (
            <div className='text-muted-foreground absolute start-0 -bottom-6 flex items-center gap-1 text-xs'>
              <kbd className='bg-muted rounded px-1.5 py-0.5 font-mono text-[10px]'>
                <IconCommand className='inline h-2.5 w-2.5' />K
              </kbd>
              <span>{t('keyboardHint')}</span>
            </div>
          )}

          {!voice.isSupported ? (
            <Typography.Muted className='mt-2 text-center text-xs'>
              {tVoice('unsupported')}
            </Typography.Muted>
          ) : null}
          {voice.permissionDenied ? (
            <Typography.Muted className='text-destructive mt-2 text-center text-xs' role='alert'>
              {tVoice('permissionDenied')}
            </Typography.Muted>
          ) : null}

          <AnimatePresence>
            {showSuggestions && (inputValue || searchStore.recentSearches.length > 0) ? (
              <motion.div
                ref={suggestionsRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='bg-card absolute start-0 end-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border shadow-xl'
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
