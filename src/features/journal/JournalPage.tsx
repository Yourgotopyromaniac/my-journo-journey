import { Plus, Search, Trash } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Page } from '@/app/AppLayout'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/dialog'
import { Input, Textarea } from '@/components/ui/field'
import { getWeekContent } from '@/content'
import { cn } from '@/lib/cn'
import { formatDayYear } from '@/lib/dates'
import { useDocumentTitle } from '@/lib/hooks'
import { useProgress, type JournalEntry } from '@/store/progress'

export default function JournalPage() {
  useDocumentTitle('Journal')
  const journal = useProgress((s) => s.journal)
  const saveJournalEntry = useProgress((s) => s.saveJournalEntry)
  const deleteJournalEntry = useProgress((s) => s.deleteJournalEntry)
  const [params, setParams] = useSearchParams()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Opening the journal from a week page starts an entry with that week's prompt.
  const weekParam = Number(params.get('week'))
  const [draft, setDraft] = useState<{ week?: number; prompt?: string } | null>(() => {
    const content = weekParam ? getWeekContent(weekParam) : undefined
    return content ? { week: weekParam, prompt: content.journalPrompt } : null
  })

  useEffect(() => {
    if (params.has('week')) setParams({}, { replace: true })
  }, [params, setParams])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return journal
    return journal.filter((j) => j.body.toLowerCase().includes(q) || j.prompt?.toLowerCase().includes(q))
  }, [journal, query])

  const selected = journal.find((j) => j.id === selectedId) ?? null
  const editing = draft !== null || selected !== null

  const startNew = () => {
    setSelectedId(null)
    setDraft({})
  }

  return (
    <Page>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2.25rem] leading-tight font-semibold">Journal</h1>
          <p className="mt-1 text-[0.9375rem] text-ink-2">Short reflections on what you are learning. Only you can see them.</p>
        </div>
        <Button onClick={startNew}>
          <Plus /> New entry
        </Button>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className={cn(editing && 'hidden lg:block')}>
          {journal.length > 3 ? (
            <div className="relative mb-3">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
              <Input
                type="search"
                placeholder="Search your journal"
                aria-label="Search your journal"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          ) : null}
          {journal.length === 0 ? (
            <Box className="p-5 text-[0.9375rem] text-ink-2">
              No entries yet. Each week has a journal prompt, or you can write about anything.
            </Box>
          ) : (
            <Box className="overflow-hidden">
              <ul>
                {filtered.map((entry, i) => (
                  <li key={entry.id} className={cn(i > 0 && 'border-t border-rule-soft')}>
                    <button
                      type="button"
                      onClick={() => {
                        setDraft(null)
                        setSelectedId(entry.id)
                      }}
                      className={cn(
                        'block min-h-14 w-full px-4 py-3 text-left hover:bg-sunken/60',
                        entry.id === selectedId && 'bg-accent-soft/40',
                      )}
                    >
                      <div className="text-xs text-ink-3">
                        {formatDayYear(entry.createdAt.slice(0, 10))}
                        {entry.week ? ` · Week ${entry.week}` : ''}
                      </div>
                      <div className="mt-0.5 line-clamp-2 text-[0.9375rem]">{entry.body || 'Empty entry'}</div>
                    </button>
                  </li>
                ))}
                {filtered.length === 0 ? <li className="px-4 py-3 text-sm text-ink-3">No entries match.</li> : null}
              </ul>
            </Box>
          )}
        </div>

        {editing ? (
          <Editor
            key={selected?.id ?? 'new'}
            entry={selected}
            draft={draft}
            onSave={(body) => {
              const id = saveJournalEntry({ id: selected?.id, body, week: selected?.week ?? draft?.week, prompt: selected?.prompt ?? draft?.prompt })
              setDraft(null)
              setSelectedId(id)
            }}
            onClose={() => {
              setDraft(null)
              setSelectedId(null)
            }}
            onDelete={selected ? () => setConfirmDelete(true) : undefined}
          />
        ) : (
          <div className="hidden lg:block">
            <Box className="flex min-h-60 items-center justify-center p-8 text-center text-[0.9375rem] text-ink-3">
              Choose an entry, or start a new one.
            </Box>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this entry?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (selected) deleteJournalEntry(selected.id)
          setSelectedId(null)
          setConfirmDelete(false)
        }}
      />
    </Page>
  )
}

function Editor({
  entry,
  draft,
  onSave,
  onClose,
  onDelete,
}: {
  entry: JournalEntry | null
  draft: { week?: number; prompt?: string } | null
  onSave: (body: string) => void
  onClose: () => void
  onDelete?: () => void
}) {
  const [body, setBody] = useState(entry?.body ?? '')
  const ref = useRef<HTMLTextAreaElement>(null)
  const prompt = entry?.prompt ?? draft?.prompt
  const week = entry?.week ?? draft?.week
  const dirty = body !== (entry?.body ?? '')

  useEffect(() => {
    if (!entry) ref.current?.focus()
  }, [entry])

  return (
    <Box className="p-5">
      <div className="text-xs text-ink-3">
        {entry ? formatDayYear(entry.createdAt.slice(0, 10)) : 'New entry'}
        {week ? ` · Week ${week}` : ''}
      </div>
      {prompt ? <p className="mt-2 font-serif text-lg leading-relaxed">{prompt}</p> : null}
      <Textarea
        ref={ref}
        aria-label="Journal entry"
        className="mt-3 min-h-64 font-serif text-[1.0625rem]"
        placeholder="Write a few honest sentences."
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button onClick={() => onSave(body)} disabled={!body.trim() || !dirty}>
            Save
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {dirty ? 'Cancel' : 'Close'}
          </Button>
        </div>
        {onDelete ? (
          <Button variant="ghost" onClick={onDelete} aria-label="Delete entry">
            <Trash /> Delete
          </Button>
        ) : null}
      </div>
    </Box>
  )
}
