import { ExternalLink, Pencil, Plus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Page } from '@/app/AppLayout'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { ConfirmDialog, Dialog } from '@/components/ui/dialog'
import { Field, Input, Textarea } from '@/components/ui/field'
import { NEWS_VALUES, PROGRAMME } from '@/content/course'
import { cn } from '@/lib/cn'
import { formatDay, formatDayName, type IsoDate } from '@/lib/dates'
import { useDocumentTitle, useSchedule, useToday } from '@/lib/hooks'
import { programmeStatus } from '@/lib/schedule'
import { useProgress, type DiaryEntry } from '@/store/progress'

type FormState = Omit<DiaryEntry, 'id' | 'createdAt'> & { id?: string }

const emptyForm = (date: IsoDate): FormState => ({ date, headline: '', outlet: '', link: '', why: '', values: [] })

export default function DiaryPage() {
  useDocumentTitle('News diary')
  const date = useToday()
  const slots = useSchedule()
  const diary = useProgress((s) => s.diary)
  const saveDiaryEntry = useProgress((s) => s.saveDiaryEntry)
  const deleteDiaryEntry = useProgress((s) => s.deleteDiaryEntry)
  const [params, setParams] = useSearchParams()
  // Arriving from "Add a story" on the dashboard opens the form straight away.
  const [form, setForm] = useState<FormState | null>(() => (params.get('new') === '1' ? emptyForm(date) : null))
  const [toDelete, setToDelete] = useState<DiaryEntry | null>(null)

  useEffect(() => {
    if (params.has('new')) setParams({}, { replace: true })
  }, [params, setParams])

  const status = programmeStatus(slots, date)
  const weekCount =
    status.state === 'running'
      ? diary.filter((d) => d.date >= status.slot.start && d.date <= status.slot.end).length
      : null

  // Group entries by date, newest first.
  const sorted = [...diary].sort((a, b) => (a.date === b.date ? b.createdAt.localeCompare(a.createdAt) : b.date.localeCompare(a.date)))
  const groups = sorted.reduce<{ date: IsoDate; entries: DiaryEntry[] }[]>((acc, entry) => {
    const last = acc[acc.length - 1]
    if (last && last.date === entry.date) last.entries.push(entry)
    else acc.push({ date: entry.date, entries: [entry] })
    return acc
  }, [])

  return (
    <Page>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2.25rem] leading-tight font-semibold">News diary</h1>
          <p className="mt-1 max-w-prose text-[0.9375rem] text-ink-2">
            Note stories that catch your eye, and why. It trains your sense of what makes news.
            {weekCount !== null ? ` This week: ${weekCount} of ${PROGRAMME.diaryTarget}.` : ''}
          </p>
        </div>
        <Button onClick={() => setForm(emptyForm(date))}>
          <Plus /> Add a story
        </Button>
      </div>

      {groups.length === 0 ? (
        <Box className="mt-7 max-w-2xl p-5 text-[0.9375rem] leading-relaxed text-ink-2">
          No stories yet. When you read or watch the news, add one story here. Write where you saw it and why it caught your
          attention.
        </Box>
      ) : (
        <div className="mt-7 flex max-w-3xl flex-col gap-6">
          {groups.map((group) => (
            <section key={group.date}>
              <h2 className="mb-2 text-sm font-semibold">
                {group.date === date ? 'Today' : `${formatDayName(group.date)} ${formatDay(group.date)}`}
              </h2>
              <Box className="overflow-hidden">
                <ul>
                  {group.entries.map((entry, i) => (
                    <li key={entry.id} className={cn('flex gap-3 px-4 py-3.5', i > 0 && 'border-t border-rule-soft')}>
                      <div className="min-w-0 flex-1">
                        <div className="font-serif text-lg leading-snug font-semibold">{entry.headline}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[0.8125rem] text-ink-3">
                          <span>{entry.outlet}</span>
                          {entry.link ? (
                            <a href={entry.link} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1 text-accent">
                              Open <ExternalLink className="size-3" />
                            </a>
                          ) : null}
                        </div>
                        {entry.why ? <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">{entry.why}</p> : null}
                        {entry.values.length ? (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {entry.values.map((v) => (
                              <span key={v} className="rounded-full border border-rule-soft bg-sunken px-2.5 py-0.5 text-xs text-ink-2">
                                {NEWS_VALUES.find((n) => n.value === v)?.label}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 flex-col">
                        <Button variant="ghost" size="icon" aria-label={`Edit "${entry.headline}"`} onClick={() => setForm({ ...entry })}>
                          <Pencil />
                        </Button>
                        <Button variant="ghost" size="icon" aria-label={`Delete "${entry.headline}"`} onClick={() => setToDelete(entry)}>
                          <Trash />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </Box>
            </section>
          ))}
        </div>
      )}

      <Dialog
        open={form !== null}
        onOpenChange={(o) => !o && setForm(null)}
        title={form?.id ? 'Edit story' : 'Add a story'}
        description="Keep it short. A sentence or two is enough."
      >
        {form ? (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault()
              if (!form.headline.trim() || !form.outlet.trim()) return
              saveDiaryEntry({ ...form, headline: form.headline.trim(), outlet: form.outlet.trim(), link: form.link.trim() })
              setForm(null)
            }}
          >
            <Field label="Headline">
              {(p) => (
                <Input {...p} required value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
              )}
            </Field>
            <div className="grid gap-4 sm:grid-cols-[1fr_11rem]">
              <Field label="Where you saw it" hint="Outlet or account">
                {(p) => (
                  <Input
                    {...p}
                    required
                    placeholder="For example, Premium Times"
                    value={form.outlet}
                    onChange={(e) => setForm({ ...form, outlet: e.target.value })}
                  />
                )}
              </Field>
              <Field label="Date" hint="When you saw it">
                {(p) => (
                  <Input {...p} type="date" required max={date} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                )}
              </Field>
            </div>
            <Field label="Link (optional)">
              {(p) => (
                <Input {...p} type="url" inputMode="url" placeholder="https://" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
              )}
            </Field>
            <Field label="Why it caught your attention">
              {(p) => <Textarea {...p} className="min-h-24" value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })} />}
            </Field>
            <fieldset>
              <legend className="text-sm font-semibold">News values it shows</legend>
              <p className="text-[0.8125rem] text-ink-3">You learn these in Week 2. Choose any that fit.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {NEWS_VALUES.map((nv) => {
                  const on = form.values.includes(nv.value)
                  return (
                    <button
                      key={nv.value}
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        setForm({ ...form, values: on ? form.values.filter((v) => v !== nv.value) : [...form.values, nv.value] })
                      }
                      className={cn(
                        'min-h-11 rounded-full border px-3.5 text-sm transition-colors',
                        on ? 'border-ink bg-ink text-paper' : 'border-rule bg-surface text-ink-2 hover:text-ink',
                      )}
                    >
                      {nv.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
            <div className="mt-2 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setForm(null)}>
                Cancel
              </Button>
              <Button type="submit">Save story</Button>
            </div>
          </form>
        ) : null}
      </Dialog>

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Delete this story?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (toDelete) deleteDiaryEntry(toDelete.id)
          setToDelete(null)
        }}
      />
    </Page>
  )
}
