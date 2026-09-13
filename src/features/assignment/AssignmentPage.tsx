import { ArrowRight, Check, Clock, ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { FocusBar } from '@/app/FocusBar'
import NotFoundPage from '@/app/NotFoundPage'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { Field, Input, Textarea } from '@/components/ui/field'
import { getWeekContent } from '@/content'
import { cn } from '@/lib/cn'
import { useDocumentTitle, useProgressData } from '@/lib/hooks'
import { assignmentStatus } from '@/lib/progress'
import { ProgressBar } from '@/components/ui/progress-bar'
import { useProgress, type AssignmentStatus } from '@/store/progress'

const STATUS_LABEL: Record<AssignmentStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  done: 'Done',
}

export default function AssignmentPage() {
  const params = useParams()
  const week = Number(params.week)
  const content = getWeekContent(week)
  const assignment = content?.assignments.find((a) => a.id === params.id)
  useDocumentTitle(assignment?.title ?? 'Page not found')

  const saved = useProgress((s) => (assignment ? s.assignments[assignment.id] : undefined))
  const diaryCount = useProgress((s) => s.diary.length)
  const updateAssignment = useProgress((s) => s.updateAssignment)
  const data = useProgressData()

  if (!content || !assignment) return <NotFoundPage />

  const status = assignmentStatus(assignment, data)
  const diaryTarget = assignment.doneWhenDiaryEntries
  const checklist = assignment.checklist.map((_, i) => saved?.checklist[i] ?? false)
  const checkedCount = checklist.filter(Boolean).length
  const index = content.assignments.findIndex((a) => a.id === assignment.id)
  const next = content.assignments[index + 1]
  const linkLooksValid = !saved?.link || /^https?:\/\//.test(saved.link)

  const setChecklistItem = (i: number, value: boolean) => {
    const nextList = [...checklist]
    nextList[i] = value
    updateAssignment(assignment.id, { checklist: nextList })
  }

  return (
    <div className="min-h-dvh bg-paper">
      <FocusBar
        backTo={`/week/${week}`}
        backLabel={`Back to Week ${week}`}
        crumbs={
          <>
            <span>Week {week}</span>
            <span className="mx-1.5 text-rule">/</span>
            <span className="text-ink">{assignment.title}</span>
          </>
        }
        actions={<span className="text-[0.8125rem] text-ink-3">{STATUS_LABEL[status]}</span>}
      />

      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:py-11">
        <article className="min-w-0">
          <p className="text-[0.8125rem] text-ink-3">
            Assignment {index + 1} of {content.assignments.length}
          </p>
          <h1 className="mt-2 font-serif text-[2.5rem] leading-[1.08] font-semibold tracking-[-0.015em]">{assignment.title}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-2">
            <Clock className="size-4" aria-hidden /> About {assignment.minutes} minutes
          </p>

          <div className="prose-lesson mt-7 border-t border-rule-soft pt-7">
            {assignment.brief.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <h2 className="!mt-8">What to do</h2>
            <ol>
              {assignment.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            {assignment.materials?.map((m) => {
              const List = m.ordered ? 'ol' : 'ul'
              return (
                <section key={m.title} className="rounded-[var(--radius-box)] border border-rule-soft bg-surface px-5 py-4 !mt-6">
                  <h3 className="!mt-0">{m.title}</h3>
                  {m.note ? <p className="!mt-1 font-sans text-sm text-ink-3">{m.note}</p> : null}
                  <List className="!mt-3 text-[1.0625rem]">
                    {m.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </List>
                </section>
              )
            })}
            <h2 className="!mt-8">What you will have at the end</h2>
            <p>{assignment.deliverable}</p>
          </div>

          {diaryTarget === undefined ? (
            <Box className="mt-8 p-4 text-sm leading-relaxed text-ink-2">
              Write your work in Google Docs. Paste its link under "Link to your work" so you can find it again. Keep the
              document private for now.
            </Box>
          ) : null}
        </article>

        <aside className="flex flex-col gap-5 lg:pt-24">
          <section>
            <div className="mb-2.5 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold">Check your work</h2>
              <span className="text-[0.8125rem] text-ink-3">
                {checkedCount} of {checklist.length}
              </span>
            </div>
            <Box className="overflow-hidden">
              <ul>
                {assignment.checklist.map((item, i) => (
                  <li key={i} className={cn(i > 0 && 'border-t border-rule-soft')}>
                    <label className="flex min-h-12 cursor-pointer items-start gap-3 px-4 py-3 hover:bg-sunken/60">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={checklist[i]}
                        onChange={(e) => setChecklistItem(i, e.target.checked)}
                      />
                      <span
                        aria-hidden
                        className={cn(
                          'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border peer-focus-visible:outline-2 peer-focus-visible:outline-accent',
                          checklist[i] ? 'border-ink bg-ink text-paper' : 'border-rule bg-surface',
                        )}
                      >
                        {checklist[i] ? <Check className="size-3.5" strokeWidth={3} /> : null}
                      </span>
                      <span className={cn('text-sm leading-snug', checklist[i] && 'text-ink-2')}>{item}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </Box>
          </section>

          {diaryTarget === undefined ? (
          <Field label="Link to your work" hint="For example, your Google Doc.">
            {(p) => (
              <>
                <Input
                  {...p}
                  type="url"
                  inputMode="url"
                  placeholder="https://docs.google.com/..."
                  value={saved?.link ?? ''}
                  onChange={(e) => updateAssignment(assignment.id, { link: e.target.value.trim() })}
                  aria-invalid={!linkLooksValid}
                />
                {!linkLooksValid ? (
                  <p className="text-[0.8125rem] text-accent">Links start with https://</p>
                ) : saved?.link ? (
                  <a
                    href={saved.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-accent"
                  >
                    Open your work <ExternalLink className="size-3.5" />
                  </a>
                ) : null}
              </>
            )}
          </Field>
          ) : null}

          <Field label="Notes" hint="Anything you want to remember or ask about.">
            {(p) => (
              <Textarea
                {...p}
                value={saved?.note ?? ''}
                onChange={(e) => updateAssignment(assignment.id, { note: e.target.value })}
              />
            )}
          </Field>

          {diaryTarget !== undefined ? (
            <Box className="p-4">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-semibold">News diary entries</span>
                <span className="text-ink-2">
                  {Math.min(diaryCount, diaryTarget)} of {diaryTarget}
                </span>
              </div>
              <ProgressBar value={diaryCount / diaryTarget} label="News diary entries" className="mt-2" />
              <p className="mt-2 text-[0.8125rem] text-ink-3">
                {diaryCount >= diaryTarget
                  ? 'Done. This assignment was ticked off for you.'
                  : 'This assignment ticks itself off when you reach the target.'}
              </p>
              {diaryCount < diaryTarget ? (
                <Button variant="secondary" size="sm" className="mt-3" asChild>
                  <Link to="/diary?new=1">Add a story</Link>
                </Button>
              ) : null}
            </Box>
          ) : null}

          {status === 'done' ? (
            <Box className="p-4">
              <div className="font-serif text-xl font-semibold">Assignment done.</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild>
                  <Link to={next ? `/week/${week}/assignment/${next.id}` : `/week/${week}`}>
                    {next ? 'Next assignment' : 'Back to the week'} <ArrowRight />
                  </Link>
                </Button>
                {saved?.status === 'done' ? (
                  <Button variant="ghost" onClick={() => updateAssignment(assignment.id, { status: 'in-progress' })}>
                    Mark as not done
                  </Button>
                ) : null}
              </div>
            </Box>
          ) : diaryTarget !== undefined ? null : (
            <div>
              <Button size="lg" className="w-full" onClick={() => updateAssignment(assignment.id, { status: 'done' })}>
                <Check /> Mark as done
              </Button>
              {checkedCount < checklist.length ? (
                <p className="mt-2 text-center text-xs text-ink-3">Tip: go through the checklist first.</p>
              ) : null}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
