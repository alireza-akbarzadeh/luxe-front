import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { differenceInCalendarDays } from 'date-fns';
import type { ComponentProps, Dispatch, SetStateAction } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { CustomComponents, DayPickerProps } from 'react-day-picker';
import { DayPicker, labelNext, labelPrevious, useDayPicker } from 'react-day-picker';
import type { Except } from 'type-fest';

import { cn } from '@/lib/utils';
import { createContextFactory } from '~/src/hooks/useContextFactory';

import { Button, buttonVariants } from './button';

interface CalendarBaseProps {
  /**
   * In the year view, the number of years to display at once.
   * @default 12
   */
  yearRange?: number;
}

type CalendarProps = DayPickerProps & CalendarBaseProps;

type NavView = 'days' | 'years';

interface DisplayYears {
  from: number;
  to: number;
}

interface Context {
  navView: NavView;
  setNavView: Dispatch<SetStateAction<NavView>>;
  displayYears: DisplayYears;
  setDisplayYears: Dispatch<SetStateAction<DisplayYears>>;
  dayPickerProps: Except<CalendarProps & CalendarBaseProps, 'className' | 'classNames'>;
}

const [ContextProvider, useContext] = createContextFactory<Context>();

function Calendar({
  className,
  classNames,
  yearRange = 12,
  showOutsideDays = true,
  numberOfMonths,
  ...props
}: CalendarProps & CalendarBaseProps) {
  const [navView, setNavView] = useState<NavView>('days');
  const [displayYears, setDisplayYears] = useState<DisplayYears>(() => {
    const currentYear = new Date().getFullYear();
    return {
      from: currentYear - Math.floor(yearRange / 2 - 1),
      to: currentYear + Math.ceil(yearRange / 2)
    };
  });

  const columnsDisplayed = navView === 'years' ? 1 : numberOfMonths;

  const customContext: Context = {
    navView,
    setNavView,
    displayYears,
    setDisplayYears,
    dayPickerProps: {
      yearRange,
      showOutsideDays,
      numberOfMonths: columnsDisplayed,
      ...props
    }
  };

  return (
    <ContextProvider value={customContext}>
      <DayPicker
        numberOfMonths={columnsDisplayed}
        showOutsideDays={showOutsideDays}
        className={cn('w-fit p-2 [--cell-size:2.25rem]', className)}
        classNames={{
          months: 'flex flex-col relative sm:flex-row gap-4',
          month_caption: 'flex justify-center h-8 mx-10 relative items-center',
          weekdays: 'flex',
          weekday:
            'text-muted-foreground flex-1 text-center text-[0.72rem] font-medium uppercase tracking-wide select-none',
          month: 'flex w-full flex-col gap-y-1',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-semibold font-display truncate',
          button_next: cn(
            buttonVariants({
              variant: 'outline',
              className:
                'absolute right-0 h-7 w-7 rounded-lg border-border/70 bg-background/80 p-0 opacity-80 transition-colors hover:border-accent/50 hover:bg-accent/10 hover:opacity-100'
            })
          ),
          button_previous: cn(
            buttonVariants({
              variant: 'outline',
              className:
                'absolute left-0 h-7 w-7 rounded-lg border-border/70 bg-background/80 p-0 opacity-80 transition-colors hover:border-accent/50 hover:bg-accent/10 hover:opacity-100'
            })
          ),
          nav: 'flex items-start',
          month_grid: 'w-full border-collapse',
          week: 'mt-1 flex w-full',
          day: 'group/day relative flex aspect-square flex-1 items-center justify-center p-0 text-center text-sm',
          day_button: '',
          range_start: 'day-range-start',
          range_end: 'day-range-end',
          selected: '',
          today: '',
          outside: '',
          disabled: '',
          range_middle: '',
          hidden: 'invisible',
          ...classNames
        }}
        components={{
          Chevron,
          Nav,
          CaptionLabel,
          MonthGrid,
          DayButton: CalendarDayButton
        }}
        {...props}
      />
    </ContextProvider>
  );
}

function Chevron({ orientation }: ComponentProps<CustomComponents['Chevron']>) {
  const Icon = orientation === 'left' ? IconChevronLeft : IconChevronRight;
  return <Icon className='size-4' />;
}

function CalendarDayButton({
  day,
  modifiers,
  className,
  ...props
}: ComponentProps<CustomComponents['DayButton']>) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (modifiers['focused']) {
      ref.current?.focus();
    }
  }, [modifiers]);

  const isSingleSelected =
    modifiers['selected'] &&
    !modifiers['range_start'] &&
    !modifiers['range_end'] &&
    !modifiers['range_middle'];

  return (
    <button
      ref={ref}
      type='button'
      className={cn(
        'text-foreground size-(--cell-size) rounded-full p-0 text-sm font-normal select-none',
        'transition-all duration-150',
        'hover:bg-accent/15',
        'focus-visible:ring-accent/60 focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-1',
        modifiers['outside'] && 'text-muted-foreground/60',
        modifiers['disabled'] && 'text-muted-foreground/40 line-through hover:bg-transparent',
        modifiers['today'] && !isSingleSelected && 'ring-accent font-semibold ring-1 ring-inset',
        isSingleSelected && 'bg-primary text-primary-foreground font-semibold shadow-sm ring-0',
        modifiers['range_middle'] && 'bg-accent/20 text-foreground hover:bg-accent/25 rounded-none',
        modifiers['range_start'] && 'bg-primary text-primary-foreground rounded-s-full',
        modifiers['range_end'] && 'bg-primary text-primary-foreground rounded-e-full',
        className
      )}
      {...props}
    />
  );
}

function Nav({ className }: ComponentProps<CustomComponents['Nav']>) {
  const { nextMonth, previousMonth, goToMonth } = useDayPicker();
  const { navView, displayYears, setDisplayYears, dayPickerProps } = useContext();

  const isPreviousDisabled = (() => {
    if (navView === 'years') {
      return (
        (dayPickerProps.startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from - 1, 0, 1),
            dayPickerProps.startMonth
          ) < 0) ||
        (dayPickerProps.endMonth &&
          differenceInCalendarDays(new Date(displayYears.from - 1, 0, 1), dayPickerProps.endMonth) >
            0)
      );
    }
    return !previousMonth;
  })();

  const isNextDisabled = (() => {
    if (navView === 'years') {
      return (
        (dayPickerProps.startMonth &&
          differenceInCalendarDays(new Date(displayYears.to + 1, 0, 1), dayPickerProps.startMonth) <
            0) ||
        (dayPickerProps.endMonth &&
          differenceInCalendarDays(new Date(displayYears.to + 1, 0, 1), dayPickerProps.endMonth) >
            0)
      );
    }
    return !nextMonth;
  })();

  const handlePreviousClick = () => {
    if (!previousMonth) return;
    if (navView === 'years') {
      setDisplayYears((prev) => ({
        from: prev.from - (prev.to - prev.from + 1),
        to: prev.to - (prev.to - prev.from + 1)
      }));
      dayPickerProps.onPrevClick?.(
        new Date(displayYears.from - (displayYears.to - displayYears.from), 0, 1)
      );
      return;
    }
    goToMonth(previousMonth);
    dayPickerProps.onPrevClick?.(previousMonth);
  };

  const handleNextClick = () => {
    if (!nextMonth) return;
    if (navView === 'years') {
      setDisplayYears((prev) => ({
        from: prev.from + (prev.to - prev.from + 1),
        to: prev.to + (prev.to - prev.from + 1)
      }));
      dayPickerProps.onNextClick?.(
        new Date(displayYears.from + (displayYears.to - displayYears.from), 0, 1)
      );
      return;
    }
    goToMonth(nextMonth);
    dayPickerProps.onNextClick?.(nextMonth);
  };

  return (
    <nav className={cn('flex items-center', className)}>
      <Button
        variant='outline'
        className='border-border/70 bg-background/80 hover:border-accent/50 hover:bg-accent/10 absolute left-0 size-7 rounded-lg p-0 opacity-80 transition-colors hover:opacity-100'
        type='button'
        tabIndex={isPreviousDisabled ? undefined : -1}
        disabled={isPreviousDisabled}
        aria-label={
          navView === 'years'
            ? `Go to the previous ${displayYears.to - displayYears.from + 1} years`
            : labelPrevious(previousMonth)
        }
        onClick={handlePreviousClick}
      >
        <IconChevronLeft className='size-4' />
      </Button>

      <Button
        variant='outline'
        className='border-border/70 bg-background/80 hover:border-accent/50 hover:bg-accent/10 absolute right-0 size-7 rounded-lg p-0 opacity-80 transition-colors hover:opacity-100'
        type='button'
        tabIndex={isNextDisabled ? undefined : -1}
        disabled={isNextDisabled}
        aria-label={
          navView === 'years'
            ? `Go to the next ${displayYears.to - displayYears.from + 1} years`
            : labelNext(nextMonth)
        }
        onClick={handleNextClick}
      >
        <IconChevronRight className='size-4' />
      </Button>
    </nav>
  );
}

function CaptionLabel({ children }: ComponentProps<CustomComponents['CaptionLabel']>) {
  const { navView, setNavView, displayYears } = useContext();

  return (
    <Button
      size='sm'
      variant='ghost'
      onClick={() => setNavView((prev) => (prev === 'days' ? 'years' : 'days'))}
      className='hover:bg-accent/10 hover:text-accent-foreground focus-visible:ring-accent/50 h-7 w-full truncate text-sm font-semibold select-none focus-visible:ring-2 focus-visible:ring-offset-0'
    >
      {navView === 'days' ? children : `${displayYears.from} - ${displayYears.to}`}
    </Button>
  );
}

function MonthGrid({
  className,
  children,
  ...props
}: ComponentProps<CustomComponents['MonthGrid']>) {
  const { goToMonth } = useDayPicker();
  const { navView, setNavView, displayYears, dayPickerProps } = useContext();

  return navView === 'days' ? (
    <table className={className} {...props}>
      {children}
    </table>
  ) : (
    <div className={cn('grid grid-cols-4 gap-y-2', className)} {...props}>
      {Array.from({ length: displayYears.to - displayYears.from + 1 }, (_, i) => {
        const year = displayYears.from + i;
        const isBefore =
          dayPickerProps.startMonth &&
          differenceInCalendarDays(
            new Date(displayYears.from + i, 12, 31),
            dayPickerProps.startMonth
          ) < 0;

        const isAfter =
          dayPickerProps.endMonth &&
          differenceInCalendarDays(new Date(year, 0, 0), dayPickerProps.endMonth) > 0;

        const isDisabled = isBefore || isAfter;
        const isCurrentYear = year === new Date().getFullYear();
        return (
          <Button
            key={year}
            className={cn(
              'text-foreground hover:bg-accent/15 h-7 w-full rounded-lg text-sm font-normal',
              isCurrentYear && 'ring-accent/70 bg-accent/10 font-semibold ring-1 ring-inset'
            )}
            variant='ghost'
            onClick={() => {
              setNavView('days');
              goToMonth(new Date(year, new Date().getMonth()));
            }}
            disabled={navView === 'years' ? isDisabled : undefined}
          >
            {year}
          </Button>
        );
      })}
    </div>
  );
}

export { Calendar };
export type { CalendarBaseProps, CalendarProps };
