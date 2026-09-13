import { Check, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { Page } from '@/app/AppLayout'
import NotFoundPage from '@/app/NotFoundPage'
import { Box, SectionHeading } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { getWeekContent } from '@/content'
import { getPhase, getWeekOutline, isLastWeekOfPhase, PROGRAMME } from '@/content/course'
import { cn } from '@/lib/cn'
import { formatRangeWords } from '@/lib/dates'
import { useDocumentTitle, useProgressData, useSchedule } from '@/lib/hooks'
import { weekProgress } from '@/lib/progress'
import { slotForWeek } from '@/lib/schedule'
import { useProgress } from '@/store/progress'
import { WeekChecklist } from './WeekChecklist'

export default function WeekPage() {
  const params = useParams()
  const week = Number(params.week)
  const outline = getWeekOutline(week)
  useDocumentTitle(outline ? `Week ${week}` : 'Page not found')
  const data = useProgressData()
  const slots = useSchedule()
  const toggleObjective = useProgress((s) => s.toggleObjective)

  if (!outline) return <NotFoundPage />

  const content = getWeekContent(week)
  const phase = getPhase(outline.phase)!
  const slot = slotForWeek(slots, week)
  const progress = weekProgress(week, data)
  const totalMinutes = content
    ? content.lessons.reduce((n, l) => n + l.minutes, 0) + content.assignments.reduce((n, a) => n + a.minutes, 0)
    : 0

  return (
    <Page>
      <div className="kicker text-accent">
        Phase {phase.number} · {phase.title}
        {outline.track ? ` · ${outline.track}` : ''}
      </div>
      <h1 className="mt-2 font-serif text-[2.25rem] leading-tight font-semibold">
        Week {week}: {outline.title}
      </h1>
      <p className="mt-1 text-[0.9375rem] text-ink-2">
        {slot ? formatRangeWords(slot.start, slot.end) : null}
        {content ? ` · About ${Math.round(totalMinutes / 60)} hours of lessons and practice` : null}
        {progress.complete ? ' · Complete' : null}
      </p>

      {!content ? (
        <Box className="mt-6 p-5">
          <p className="max-w-prose text-[0.9375rem] leading-relaxed text-ink-2">{outline.summary}</p>
          <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink-2">
            The lessons for this week are being written. They will be ready at least two weeks before the week starts.
          </p>
        </Box>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.55fr_1fr]">
          <div className="min-w-0">
            <p className="max-w-prose font-serif text-[1.1875rem] leading-relaxed text-ink">{content.overview}</p>

            <section className="mt-7">
              <SectionHeading title="Your plan" aside={`${progress.lessonsDone + progress.assignmentsDone + (progress.quiz.passed ? 1 : 0)} of ${progress.lessonsTotal + progress.assignmentsTotal + 1} done`} />
              <WeekChecklist week={week} data={data} />
            </section>

            {isLastWeekOfPhase(week) ? (
              <p className="mt-3 text-[0.8125rem] text-ink-3">
                This is the last week of Phase {phase.number}. A longer review quiz for the whole phase comes after it.
              </p>
            ) : null}

            <section className="mt-8">
              <SectionHeading title="Journal prompt" />
              <Box className="p-4">
                <p className="font-serif text-lg leading-relaxed">{content.journalPrompt}</p>
                <Button variant="secondary" size="sm" className="mt-3" asChild>
                  <Link to={`/journal?week=${week}`}>Write in your journal</Link>
                </Button>
              </Box>
            </section>
          </div>

          <aside className="flex flex-col gap-6">
            <section>
              <SectionHeading title="By the end of this week you can" />
              <Box className="overflow-hidden">
                <ul>
                  {content.objectives.map((objective, i) => {
                    const id = `w${week}-o${i + 1}`
                    const checked = !!data.objectives[id]
                    return (
                      <li key={id} className={cn(i > 0 && 'border-t border-rule-soft')}>
                        <label className="flex min-h-12 cursor-pointer items-start gap-3 px-4 py-3 hover:bg-sunken/60">
                          <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={checked}
                            onChange={() => toggleObjective(id)}
                          />
                          <span
                            aria-hidden
                            className={cn(
                              'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border peer-focus-visible:outline-2 peer-focus-visible:outline-accent',
                              checked ? 'border-ink bg-ink text-paper' : 'border-rule bg-surface',
                            )}
                          >
                            {checked ? <Check className="size-3.5" strokeWidth={3} /> : null}
                          </span>
                          <span className={cn('text-[0.9375rem] leading-snug', checked && 'text-ink-2')}>{objective}</span>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              </Box>
              <p className="mt-2 text-xs text-ink-3">Tick each one when you feel sure about it.</p>
            </section>

            {content.resources.length ? (
              <section>
                <SectionHeading title="Extra resources" aside="Free" />
                <Box className="overflow-hidden">
                  <ul>
                    {content.resources.map((r, i) => (
                      <li key={r.url} className={cn(i > 0 && 'border-t border-rule-soft')}>
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex min-h-12 items-start gap-3 px-4 py-3 hover:bg-sunken/60"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="text-[0.9375rem] font-medium">{r.title}</div>
                            <div className="mt-0.5 text-xs text-ink-3">
                              {r.publisher}
                              {r.minutes ? ` · ${r.minutes} min` : ''}
                            </div>
                            <div className="mt-1 text-[0.8125rem] text-ink-2">{r.note}</div>
                          </div>
                          <ExternalLink className="mt-1 size-4 shrink-0 text-ink-3" aria-label="Opens in a new tab" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </Box>
              </section>
            ) : null}

            <p className="text-xs text-ink-3">
              Aim for about {PROGRAMME.diaryTarget} news diary entries this week too.
            </p>
          </aside>
        </div>
      )}
    </Page>
  )
}
