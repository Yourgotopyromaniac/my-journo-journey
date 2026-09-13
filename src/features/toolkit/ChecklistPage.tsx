import { Check, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { Page } from '@/app/AppLayout'
import NotFoundPage from '@/app/NotFoundPage'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { getWeekOutline } from '@/content/course'
import { getChecklist } from '@/content/toolkit'
import { cn } from '@/lib/cn'
import { formatDayYear } from '@/lib/dates'
import { useDocumentTitle } from '@/lib/hooks'

/** A checklist to run through each time she works on a story. Ticks are not saved, so it starts fresh every time. */
export default function ChecklistPage() {
  const { id = '' } = useParams()
  const checklist = getChecklist(id)
  useDocumentTitle(checklist?.title ?? 'Page not found')
  const [ticked, setTicked] = useState<Set<string>>(new Set())

  if (!checklist) return <NotFoundPage />

  const total = checklist.groups.reduce((n, g) => n + g.items.length, 0)
  const outline = getWeekOutline(checklist.week)

  const toggle = (key: string) =>
    setTicked((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })

  return (
    <Page className="max-w-3xl">
      <Link to="/toolkit#checklists" className="inline-flex min-h-11 items-center text-sm text-ink-3 hover:text-ink">
        Toolkit / Checklists
      </Link>
      <h1 className="mt-1 font-serif text-[2.25rem] leading-tight font-semibold">{checklist.title}</h1>
      <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-2">{checklist.summary}</p>
      <p className="mt-1 text-[0.8125rem] text-ink-3">
        Taught in{' '}
        <Link to={`/week/${checklist.week}`} className="text-accent hover:text-accent-strong">
          Week {checklist.week}: {outline?.title}
        </Link>
      </p>

      <div className="mt-6 flex items-center justify-between gap-3">
        <span className="text-sm text-ink-2" aria-live="polite">
          {ticked.size} of {total} checked
        </span>
        <Button variant="ghost" size="sm" onClick={() => setTicked(new Set())} disabled={ticked.size === 0}>
          <RotateCcw /> Start again
        </Button>
      </div>

      <div className="mt-2 flex flex-col gap-5">
        {checklist.groups.map((group, gi) => (
          <section key={gi}>
            {group.heading ? <h2 className="mb-2 text-sm font-semibold">{group.heading}</h2> : null}
            <Box className="overflow-hidden">
              <ul>
                {group.items.map((item, i) => {
                  const key = `${gi}-${i}`
                  const on = ticked.has(key)
                  return (
                    <li key={key} className={cn(i > 0 && 'border-t border-rule-soft')}>
                      <label className="flex min-h-12 cursor-pointer items-start gap-3 px-4 py-3 hover:bg-sunken/60">
                        <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggle(key)} />
                        <span
                          aria-hidden
                          className={cn(
                            'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border peer-focus-visible:outline-2 peer-focus-visible:outline-accent',
                            on ? 'border-ink bg-ink text-paper' : 'border-rule bg-surface',
                          )}
                        >
                          {on ? <Check className="size-3.5" strokeWidth={3} /> : null}
                        </span>
                        <span className={cn('text-[0.9375rem] leading-snug', on && 'text-ink-2')}>{item}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </Box>
          </section>
        ))}
      </div>

      {ticked.size === total ? (
        <p className="mt-4 font-serif text-lg" role="status">
          All checked.
        </p>
      ) : null}

      {checklist.sources.length ? (
        <section className="mt-10 border-t border-rule-soft pt-5">
          <h2 className="text-sm font-semibold">Sources</h2>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[0.8125rem] text-ink-2">
            {checklist.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-ink underline decoration-rule underline-offset-2">
                  {s.title}
                </a>
                , {s.publisher}. Checked {formatDayYear(s.checked)}.
              </li>
            ))}
          </ol>
        </section>
      ) : null}
    </Page>
  )
}
