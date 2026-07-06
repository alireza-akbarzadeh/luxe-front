'use client';

import { IconCamera, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { AppDialog } from '@/components/app-dialog';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { useSearchHeroController } from '@/domains/search/hooks/useSearchHeroController';
import { useSearchStore } from '@/domains/search/search.store';

import { useSearchVoiceInput } from '../hooks/use-search-voice-input';
import { SearchInputLeadingIcon } from './search-input-leading-icon';
import { SearchSuggestionsPanel } from './search-suggestions-panel';
import { SearchVoiceMicButton } from './search-voice-mic-button';
import { VisualSearchDialog } from './visual-search-dialog';

/** Mobile-native search drawer — opened from navbar or search page compact bar. */
export function SearchMobileSheet() {
  const isOpen = useSearchStore((state) => state.isSearchSheetOpen);
  const setSearchSheetOpen = useSearchStore((state) => state.setSearchSheetOpen);

  return (
    <AppDialog
      open={isOpen}
      onOpenChange={setSearchSheetOpen}
      size='full'
      tabBarPadding={false}
      className='h-[96dvh] max-h-[96dvh]'
      contentClassName='flex min-h-0 flex-1 flex-col overflow-hidden p-0 px-0 pb-0'
    >
      {isOpen ? <SearchMobileSheetContent /> : null}
    </AppDialog>
  );
}

function SearchMobileSheetContent() {
  const t = useTranslations('search');
  const closeSearchSheet = useSearchStore((state) => state.closeSearchSheet);
  const openVisualSearch = useSearchStore((state) => state.openVisualSearch);
  const voiceOnOpen = useSearchStore((state) => state.voiceOnOpen);
  const clearVoiceOnOpen = useSearchStore((state) => state.clearVoiceOnOpen);
  const tVisual = useTranslations('search.visual');
  const tVoice = useTranslations('search.voice');
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

  const voice = useSearchVoiceInput(inputValue, setInputValue, {
    autoStart: voiceOnOpen,
    onAutoStartConsumed: clearVoiceOnOpen
  });
  const isLoading = isSearching || suggestionsLoading;

  return (
    <>
      <Flex
        direction='column'
        spacing={0}
        className='border-border shrink-0 border-b px-6 py-4 text-start'
      >
        <Flex align='start' justify='between' spacing={3}>
          <Flex direction='column' spacing={1} className='min-w-0'>
            <Typography.H3 className='font-display text-xl'>{t('mobileSheet.title')}</Typography.H3>
            <Typography.Muted className='text-sm'>{t('mobileSheet.description')}</Typography.Muted>
          </Flex>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-muted-foreground shrink-0'
            onClick={closeSearchSheet}
          >
            {t('mobileSheet.close')}
          </Button>
        </Flex>
      </Flex>

      <div className='border-border shrink-0 border-b px-6 py-4'>
        <div className='relative'>
          <div className='absolute start-3 top-1/2 flex -translate-y-1/2 items-center'>
            <SearchInputLeadingIcon isLoading={isLoading} isListening={voice.isListening} />
          </div>
          <Input
            ref={inputRef}
            type='text'
            enterKeyHint='search'
            autoComplete='off'
            autoCorrect='off'
            spellCheck={false}
            placeholder={t('hero.placeholder')}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setShowSuggestions(true);
              setFocusedSuggestion(-1);
            }}
            onKeyDown={handleKeyDown}
            className='focus:border-primary bg-background h-12 rounded-full ps-11 pe-32'
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
              className='h-8 w-8 rounded-full'
              aria-label={tVisual('openCamera')}
              onClick={openVisualSearch}
            >
              <IconCamera className='h-4 w-4' />
            </Button>
            {inputValue ? (
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full'
                aria-label={t('mobileSheet.clearSearch')}
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
              {t('mobileSheet.go')}
            </Button>
          </div>
        </div>
        {voice.isListening ? (
          <Typography.Muted className='text-accent mt-2 text-xs' role='status' aria-live='polite'>
            {tVoice('listening')}
          </Typography.Muted>
        ) : null}
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2 pb-[max(1rem,env(safe-area-inset-bottom))]'>
        {inputValue || searchStore.recentSearches.length > 0 || trendingSearches.length > 0 ? (
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
        ) : null}
      </div>

      <VisualSearchDialog nested />
    </>
  );
}
