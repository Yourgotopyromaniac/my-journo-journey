import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ComponentProps } from 'react'
import { DayPicker, getDefaultClassNames, type DayButtonProps } from 'react-day-picker'
import { enGB } from 'react-day-picker/locale'
import { cn } from '@/lib/cn'
import { buttonVariants } from './button'

/**
 * Calendar in the style of shadcn/ui, built on react-day-picker and the app's tokens.
 * Weeks start on Monday (British English locale). Day cells are 44px for touch.
 */
export function Calendar({ className, classNames, showOutsideDays = true, ...props }: ComponentProps<typeof DayPicker>) {
  const defaults = getDefaultClassNames()

  return (
    <DayPicker
      locale={enGB}
      showOutsideDays={showOutsideDays}
      className={cn('w-fit p-3', className)}
      classNames={{
        root: cn('w-fit', defaults.root),
        months: cn('relative flex flex-col gap-4', defaults.months),
        month: cn('flex w-full flex-col gap-3', defaults.month),
        nav: cn('absolute inset-x-0 top-0 flex w-full items-center justify-between', defaults.nav),
        button_previous: cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-10 aria-disabled:opacity-40', defaults.button_previous),
        button_next: cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'size-10 aria-disabled:opacity-40', defaults.button_next),
        month_caption: cn('flex h-10 w-full items-center justify-center px-10', defaults.month_caption),
        caption_label: cn('font-serif text-[1.0625rem] font-semibold select-none', defaults.caption_label),
        month_grid: cn('w-full border-collapse', defaults.month_grid),
        weekdays: cn('flex', defaults.weekdays),
        weekday: cn('w-11 text-[0.75rem] font-medium text-ink-3 select-none', defaults.weekday),
        week: cn('mt-1 flex w-full', defaults.week),
        day: cn('relative size-11 p-0 text-center select-none', defaults.day),
        today: cn('', defaults.today),
        outside: cn('text-ink-3/60', defaults.outside),
        disabled: cn('opacity-35', defaults.disabled),
        hidden: cn('invisible', defaults.hidden),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass }) => {
          const Icon = orientation === 'left' ? ChevronLeft : orientation === 'right' ? ChevronRight : ChevronDown
          return <Icon className={cn('size-5', chevronClass)} strokeWidth={1.8} />
        },
        DayButton: CalendarDayButton,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({ day, modifiers, className, ...props }: DayButtonProps) {
  return (
    <button
      type="button"
      data-day={day.date.toLocaleDateString('en-GB')}
      data-selected={modifiers.selected || undefined}
      data-today={modifiers.today || undefined}
      className={cn(
        'relative flex size-11 items-center justify-center rounded-[var(--radius-control)] text-[0.9375rem] tabular-nums transition-colors',
        'hover:bg-sunken focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none',
        // Today: small dot under the number.
        'data-[today]:font-semibold data-[today]:after:absolute data-[today]:after:bottom-1.5 data-[today]:after:size-1 data-[today]:after:rounded-full data-[today]:after:bg-accent',
        'data-[selected]:bg-ink data-[selected]:text-paper data-[selected]:hover:bg-ink data-[selected]:after:bg-paper',
        className,
      )}
      {...props}
    />
  )
}
