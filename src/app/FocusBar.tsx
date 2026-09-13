import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

/** Slim top bar for focused screens (lessons, assignments, quizzes) that hide the main navigation. */
export function FocusBar({
  backTo,
  backLabel,
  crumbs,
  actions,
}: {
  backTo: string
  backLabel: string
  crumbs?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-rule-soft bg-paper/95 backdrop-blur">
      <div className="flex min-h-15 items-center justify-between gap-3 px-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-1">
          <Link
            to={backTo}
            className="flex size-11 shrink-0 items-center justify-center rounded-md text-ink hover:bg-sunken"
            aria-label={backLabel}
          >
            <ChevronLeft className="size-5" strokeWidth={1.8} />
          </Link>
          {crumbs ? <div className="min-w-0 truncate text-[0.8125rem] text-ink-3">{crumbs}</div> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  )
}
