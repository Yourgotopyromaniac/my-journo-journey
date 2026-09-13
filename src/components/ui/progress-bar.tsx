import { cn } from '@/lib/cn'

export function ProgressBar({
  value,
  label,
  tone = 'accent',
  className,
}: {
  /** 0 to 1 */
  value: number
  label: string
  tone?: 'accent' | 'ink'
  className?: string
}) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100)
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn('h-1 overflow-hidden rounded-full bg-rule-soft', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', tone === 'accent' ? 'bg-accent' : 'bg-ink')}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

/** Row of equal segments, e.g. quiz questions. */
export function SegmentedProgress({
  total,
  done,
  current,
  label,
}: {
  total: number
  done: number
  current?: number
  label: string
}) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            'h-1 rounded-full',
            i === current ? 'bg-accent' : i < done ? 'bg-ink' : 'bg-rule-soft',
          )}
        />
      ))}
    </div>
  )
}
