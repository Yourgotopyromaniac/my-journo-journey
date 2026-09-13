import { CalendarDays } from 'lucide-react'
import { Popover } from 'radix-ui'
import { useState, type ComponentProps } from 'react'
import { cn } from '@/lib/cn'
import { addDays, formatDayName, formatDayYear, today as todayIso, type IsoDate } from '@/lib/dates'
import { Button } from './button'
import { Calendar } from './calendar'

function toDate(iso: IsoDate): Date {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number]
  return new Date(y, m - 1, d)
}

function toIso(date: Date): IsoDate {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * Date picker in the style of shadcn/ui: a button that opens a calendar in a popover.
 * Works with "YYYY-MM-DD" strings, like the rest of the app.
 */
export function DatePicker({
  value,
  onChange,
  max,
  min,
  className,
  ...buttonProps
}: {
  value: IsoDate
  onChange: (value: IsoDate) => void
  max?: IsoDate
  min?: IsoDate
  className?: string
} & Omit<ComponentProps<'button'>, 'value' | 'onChange'>) {
  const [open, setOpen] = useState(false)
  const now = todayIso()
  const selected = toDate(value)

  const pick = (iso: IsoDate) => {
    onChange(iso)
    setOpen(false)
  }

  const quick: { label: string; value: IsoDate }[] = [
    { label: 'Today', value: now },
    { label: 'Yesterday', value: addDays(now, -1) },
  ]

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex min-h-11 w-full items-center gap-2.5 rounded-[var(--radius-control)] border border-rule bg-surface px-3.5 text-left text-base text-ink',
            'hover:bg-sunken/50 focus-visible:border-ink-2 focus-visible:ring-3 focus-visible:ring-accent/15 focus-visible:outline-none',
            'data-[state=open]:border-ink-2 data-[state=open]:ring-3 data-[state=open]:ring-accent/15',
            className,
          )}
          {...buttonProps}
        >
          <CalendarDays className="size-[1.125rem] shrink-0 text-ink-3" strokeWidth={1.8} aria-hidden />
          <span className="truncate">
            {value === now ? 'Today' : value === addDays(now, -1) ? 'Yesterday' : formatDayName(value).slice(0, 3)}
            <span className="text-ink-2">, {formatDayYear(value)}</span>
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={16}
          className="z-[60] rounded-[var(--radius-box)] border border-rule-soft bg-surface shadow-[0_16px_40px_rgba(0,0,0,0.16)] focus:outline-none"
        >
          <Calendar
            mode="single"
            required
            selected={selected}
            defaultMonth={selected}
            onSelect={(date) => date && pick(toIso(date))}
            disabled={[...(max ? [{ after: toDate(max) }] : []), ...(min ? [{ before: toDate(min) }] : [])]}
            endMonth={max ? toDate(max) : undefined}
            autoFocus
          />
          <div className="flex gap-2 border-t border-rule-soft p-3">
            {quick
              .filter((q) => (!max || q.value <= max) && (!min || q.value >= min))
              .map((q) => (
                <Button
                  key={q.label}
                  variant={value === q.value ? 'ink' : 'secondary'}
                  size="sm"
                  className="flex-1"
                  onClick={() => pick(q.value)}
                >
                  {q.label}
                </Button>
              ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
