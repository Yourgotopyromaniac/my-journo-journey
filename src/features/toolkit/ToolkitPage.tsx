import { ChevronRight, ExternalLink, ListChecks, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Page } from '@/app/AppLayout'
import { Box, SectionHeading } from '@/components/ui/box'
import { Input } from '@/components/ui/field'
import { allResources } from '@/content'
import { GLOSSARY } from '@/content/glossary'
import { CHECKLISTS } from '@/content/toolkit'
import type { Resource } from '@/content/types'
import { cn } from '@/lib/cn'
import { useDocumentTitle, useProgressData } from '@/lib/hooks'
import { currentLearningWeek } from '@/lib/progress'

const KIND_LABEL: Record<Resource['kind'], string> = {
  article: 'Article',
  course: 'Course',
  video: 'Video',
  guide: 'Guide',
  tool: 'Tool',
  podcast: 'Podcast',
}

export default function ToolkitPage() {
  useDocumentTitle('Toolkit')
  const data = useProgressData()
  const learningWeek = currentLearningWeek(data)
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<Resource['kind'] | 'all'>('all')

  const resources = allResources()
  const kinds = [...new Set(resources.map((r) => r.kind))]
  const shownResources = kind === 'all' ? resources : resources.filter((r) => r.kind === kind)

  const terms = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))
    if (!q) return sorted
    return sorted.filter((t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
  }, [query])

  return (
    <Page>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2.25rem] leading-tight font-semibold">Toolkit</h1>
          <p className="mt-1 max-w-prose text-[0.9375rem] text-ink-2">
            Checklists to use while you work, free resources from your lessons, and the words journalists use.
          </p>
        </div>
        <Link
          to="/search"
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-control)] border border-rule bg-surface px-4 text-[0.9375rem] font-medium hover:bg-sunken"
        >
          <Search className="size-4" aria-hidden /> Search everything
        </Link>
      </div>

      <nav aria-label="Toolkit sections" className="mt-5 flex flex-wrap gap-2">
        {[
          ['#checklists', 'Checklists'],
          ['#resources', 'Resources'],
          ['#glossary', 'Glossary'],
        ].map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="inline-flex min-h-11 items-center rounded-full border border-rule-soft bg-surface px-4 text-sm text-ink-2 hover:text-ink"
          >
            {label}
          </a>
        ))}
      </nav>

      <section id="checklists" className="mt-8 max-w-4xl scroll-mt-6">
        <h2 className="mb-3 font-serif text-2xl font-semibold">Checklists</h2>
        {CHECKLISTS.length === 0 ? (
          <Box className="p-5 text-[0.9375rem] text-ink-2">Checklists are added as you reach the weeks that teach them.</Box>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {CHECKLISTS.map((c) => {
              const upcoming = c.week > learningWeek
              return (
                <Link
                  key={c.id}
                  to={`/toolkit/${c.id}`}
                  className={cn(
                    'flex items-start gap-3 rounded-[var(--radius-box)] border border-rule-soft bg-surface p-4 hover:bg-sunken/60',
                    upcoming && 'opacity-75',
                  )}
                >
                  <ListChecks className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden strokeWidth={1.8} />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{c.title}</div>
                    <p className="mt-0.5 text-sm leading-snug text-ink-2">{c.summary}</p>
                    <div className="mt-1.5 text-xs text-ink-3">{upcoming ? `You learn this in Week ${c.week}` : `From Week ${c.week}`}</div>
                  </div>
                  <ChevronRight className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden />
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section id="resources" className="mt-10 max-w-4xl scroll-mt-6">
        <h2 className="mb-3 font-serif text-2xl font-semibold">Resource library</h2>
        {kinds.length > 1 ? (
          <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Filter resources">
            {(['all', ...kinds] as const).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={kind === k}
                onClick={() => setKind(k)}
                className={cn(
                  'min-h-11 rounded-full border px-4 text-sm',
                  kind === k ? 'border-ink bg-ink text-paper' : 'border-rule-soft bg-surface text-ink-2 hover:text-ink',
                )}
              >
                {k === 'all' ? 'All' : `${KIND_LABEL[k]}s`}
              </button>
            ))}
          </div>
        ) : null}
        <SectionHeading title={`${shownResources.length} free resources`} aside="All open in a new tab" />
        <Box className="overflow-hidden">
          <ul>
            {shownResources.map((r, i) => (
              <li key={r.url} className={cn(i > 0 && 'border-t border-rule-soft')}>
                <a href={r.url} target="_blank" rel="noreferrer" className="flex min-h-14 items-start gap-3 px-4 py-3 hover:bg-sunken/60">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{r.title}</div>
                    <div className="mt-0.5 text-xs text-ink-3">
                      {KIND_LABEL[r.kind]} · {r.publisher}
                      {r.minutes ? ` · ${r.minutes} min` : ''} · Week {r.week}
                    </div>
                    <p className="mt-1 text-[0.8125rem] leading-snug text-ink-2">{r.note}</p>
                  </div>
                  <ExternalLink className="mt-1 size-4 shrink-0 text-ink-3" aria-label="Opens in a new tab" />
                </a>
              </li>
            ))}
          </ul>
        </Box>
      </section>

      <section id="glossary" className="mt-10 max-w-4xl scroll-mt-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-serif text-2xl font-semibold">Glossary</h2>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-3" aria-hidden />
            <Input
              type="search"
              placeholder="Search words"
              aria-label="Search the glossary"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <Box className="overflow-hidden">
          <dl>
            {terms.map((t, i) => (
              <div
                key={t.id}
                id={`term-${t.id}`}
                className={cn('grid scroll-mt-6 gap-1 px-4 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-4', i > 0 && 'border-t border-rule-soft')}
              >
                <dt className="font-serif text-lg font-semibold">{t.term}</dt>
                <dd className="text-[0.9375rem] leading-relaxed text-ink-2">
                  {t.definition}
                  {t.also ? <span className="mt-1 block text-ink-3">{t.also}</span> : null}
                </dd>
              </div>
            ))}
            {terms.length === 0 ? <div className="px-4 py-3 text-sm text-ink-3">No words match.</div> : null}
          </dl>
        </Box>
      </section>
    </Page>
  )
}
