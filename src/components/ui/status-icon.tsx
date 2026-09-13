import { cn } from '@/lib/cn'

export type Status = 'done' | 'current' | 'todo'

const labels: Record<Status, string> = { done: 'Done', current: 'In progress', todo: 'Not started' }

/** Filled circle with a tick, half circle, or empty circle. */
export function StatusIcon({ status, className }: { status: Status; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label={labels[status]} className={cn('size-5 shrink-0', className)}>
      {status === 'done' ? (
        <>
          <circle cx="12" cy="12" r="9" className="fill-ink stroke-ink" strokeWidth="1.6" />
          <path d="M8 12l3 3 5-6" fill="none" className="stroke-paper" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : status === 'current' ? (
        <>
          <circle cx="12" cy="12" r="9" fill="none" className="stroke-accent" strokeWidth="1.6" />
          <path d="M12 3a9 9 0 0 1 0 18z" className="fill-accent" />
        </>
      ) : (
        <circle cx="12" cy="12" r="9" fill="none" className="stroke-rule" strokeWidth="1.6" />
      )}
    </svg>
  )
}
