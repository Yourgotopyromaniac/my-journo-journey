import { Search } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Page } from '@/app/AppLayout'
import { Box } from '@/components/ui/box'
import { Input } from '@/components/ui/field'
import { cn } from '@/lib/cn'
import { useDocumentTitle, useProgressData } from '@/lib/hooks'
import { buildLessonDocs, buildStaticDocs, search, type ResultKind, type SearchDoc } from './search-index'

const GROUP_LABEL: Record<ResultKind, string> = {
  lesson: 'Lessons',
  week: 'Weeks',
  checklist: 'Checklists',
  glossary: 'Glossary',
  journal: 'Your journal',
  diary: 'Your news diary',
}
const GROUP_ORDER: ResultKind[] = ['lesson', 'checklist', 'glossary', 'week', 'journal', 'diary']

function highlight(text: string, query: string): ReactNode {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1)
    .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!terms.length) return text
  const parts = text.split(new RegExp(`(${terms.join('|')})`, 'gi'))
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded-sm bg-accent-soft px-0.5 text-ink">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export default function SearchPage() {
  useDocumentTitle('Search')
  const data = useProgressData()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [lessonDocs, setLessonDocs] = useState<SearchDoc[] | null>(null)

  useEffect(() => {
    let cancelled = false
    buildLessonDocs().then((docs) => !cancelled && setLessonDocs(docs))
    return () => {
      cancelled = true
    }
  }, [])

  // Keep the query in the address so going back to search keeps the results.
  const currentQ = params.get('q') ?? ''
  useEffect(() => {
    if (currentQ === query) return
    const t = window.setTimeout(() => setParams(query ? { q: query } : {}, { replace: true }), 250)
    return () => window.clearTimeout(t)
  }, [query, currentQ, setParams])

  const staticDocs = useMemo(() => buildStaticDocs(data), [data])
  const results = useMemo(() => search([...(lessonDocs ?? []), ...staticDocs], query), [lessonDocs, staticDocs, query])
  const groups = GROUP_ORDER.map((kind) => ({ kind, items: results.filter((r) => r.kind === kind) })).filter((g) => g.items.length)
  const searching = query.trim().length > 1

  return (
    <Page className="max-w-3xl">
      <h1 className="font-serif text-[2.25rem] leading-tight font-semibold">Search</h1>
      <div className="relative mt-4">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-ink-3" aria-hidden />
        <Input
          type="search"
          autoFocus
          placeholder="Search lessons, checklists, the glossary and your notes"
          aria-label="Search"
          className="min-h-12 pl-11 text-lg"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div aria-live="polite" className="mt-6">
        {!searching ? (
          <p className="text-[0.9375rem] text-ink-3">Type at least two letters. For example: lede, FOI, sub-editor.</p>
        ) : groups.length === 0 ? (
          <p className="text-[0.9375rem] text-ink-2">
            Nothing found for “{query}”. {lessonDocs === null ? 'Still loading lessons.' : 'Try a shorter or different word.'}
          </p>
        ) : (
          <div className="flex flex-col gap-6">
            <p className="text-sm text-ink-3">
              {results.length} result{results.length === 1 ? '' : 's'}
            </p>
            {groups.map((group) => (
              <section key={group.kind}>
                <h2 className="mb-2 text-sm font-semibold">{GROUP_LABEL[group.kind]}</h2>
                <Box className="overflow-hidden">
                  <ul>
                    {group.items.slice(0, 20).map((r, i) => (
                      <li key={`${r.href}-${i}`} className={cn(i > 0 && 'border-t border-rule-soft')}>
                        <Link to={r.href} className="block min-h-14 px-4 py-3 hover:bg-sunken/60">
                          <div className="text-xs text-ink-3">{r.context}</div>
                          <div className="mt-0.5 font-medium">{highlight(r.title, query)}</div>
                          {r.snippet ? (
                            <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-snug text-ink-2">{highlight(r.snippet, query)}</p>
                          ) : null}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Box>
              </section>
            ))}
          </div>
        )}
      </div>
    </Page>
  )
}
