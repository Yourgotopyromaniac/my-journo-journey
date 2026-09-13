import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Page } from '@/app/AppLayout'
import { Box } from '@/components/ui/box'
import { Input } from '@/components/ui/field'
import { GLOSSARY } from '@/content/glossary'
import { cn } from '@/lib/cn'
import { useDocumentTitle } from '@/lib/hooks'

export default function ToolkitPage() {
  useDocumentTitle('Toolkit')
  const [query, setQuery] = useState('')

  const terms = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))
    if (!q) return sorted
    return sorted.filter((t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
  }, [query])

  return (
    <Page>
      <h1 className="font-serif text-[2.25rem] leading-tight font-semibold">Toolkit</h1>
      <p className="mt-1 max-w-prose text-[0.9375rem] text-ink-2">
        Words journalists use, explained simply. Checklists for ethics, law and fact-checking will be added here as you reach
        those weeks.
      </p>

      <section className="mt-7 max-w-3xl">
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
              <div key={t.id} id={t.id} className={cn('grid gap-1 px-4 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-4', i > 0 && 'border-t border-rule-soft')}>
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
