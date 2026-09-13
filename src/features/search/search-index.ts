import { writtenWeeks } from '@/content'
import { WEEKS } from '@/content/course'
import { GLOSSARY } from '@/content/glossary'
import { CHECKLISTS } from '@/content/toolkit'
import type { ProgressData } from '@/store/progress'

export type ResultKind = 'lesson' | 'week' | 'glossary' | 'checklist' | 'journal' | 'diary'

export interface SearchDoc {
  kind: ResultKind
  title: string
  href: string
  context: string
  body: string
}

// Lesson text is loaded as plain text only when search is opened.
const rawLessons = import.meta.glob<string>('/src/content/weeks/*/lessons/*.mdx', { query: '?raw', import: 'default' })

/** Turns MDX into searchable plain text. Rough is fine: it only feeds search and snippets. */
function mdxToText(source: string): string {
  return source
    .replace(/^import .*$/gm, ' ')
    .replace(/\s(id|type|title|href|publisher|minutes|note)=("[^"]*"|\{[^}]*\})/g, ' ')
    .replace(/<\/?[A-Z][A-Za-z]*|\/?>/g, ' ')
    .replace(/\b(label|text|good|note|items|type|title|id|detail|layers|href|publisher|minutes)\s*[:=]/g, ' ')
    .replace(/\btrue\b/g, ' ')
    .replace(/[#*_`{}[\]|]/g, ' ')
    .replace(/\\'/g, "'")
    .replace(/(^|\s)['"]|['"](?=[\s,])/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function buildLessonDocs(): Promise<SearchDoc[]> {
  const docs: SearchDoc[] = []
  const weeks = writtenWeeks()
  await Promise.all(
    Object.entries(rawLessons).map(async ([path, load]) => {
      // Files are named week-NN/lessons/NN-name.mdx, numbered in lesson order.
      const match = /week-(\d+)\/lessons\/(\d+)-/.exec(path)
      if (!match) return
      const week = weeks.find((w) => w.number === Number(match[1]))
      const lesson = week?.lessons[Number(match[2]) - 1]
      if (!week || !lesson) return
      docs.push({
        kind: 'lesson',
        title: lesson.title,
        href: `/week/${week.number}/lesson/${lesson.slug}`,
        context: `Week ${week.number} · Lesson`,
        body: `${lesson.summary} ${mdxToText(await load())}`,
      })
    }),
  )
  return docs
}

export function buildStaticDocs(data: ProgressData): SearchDoc[] {
  const docs: SearchDoc[] = []
  for (const w of WEEKS) {
    docs.push({ kind: 'week', title: `Week ${w.number}: ${w.title}`, href: `/week/${w.number}`, context: 'Week', body: w.summary })
  }
  for (const t of GLOSSARY) {
    docs.push({
      kind: 'glossary',
      title: t.term,
      href: `/toolkit#term-${t.id}`,
      context: 'Glossary',
      body: `${t.definition} ${t.also ?? ''}`,
    })
  }
  for (const c of CHECKLISTS) {
    docs.push({
      kind: 'checklist',
      title: c.title,
      href: `/toolkit/${c.id}`,
      context: `Checklist · Week ${c.week}`,
      body: `${c.summary} ${c.groups.flatMap((g) => [g.heading ?? '', ...g.items]).join(' ')}`,
    })
  }
  for (const j of data.journal) {
    docs.push({
      kind: 'journal',
      title: j.body.split('\n')[0]!.slice(0, 80) || 'Journal entry',
      href: '/journal',
      context: `Your journal${j.week ? ` · Week ${j.week}` : ''}`,
      body: `${j.prompt ?? ''} ${j.body}`,
    })
  }
  for (const d of data.diary) {
    docs.push({ kind: 'diary', title: d.headline, href: '/diary', context: `Your news diary · ${d.outlet}`, body: d.why })
  }
  return docs
}

export interface SearchResult extends SearchDoc {
  score: number
  snippet: string
}

export function search(docs: SearchDoc[], query: string): SearchResult[] {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1)
  if (!terms.length) return []
  const results: SearchResult[] = []
  for (const doc of docs) {
    const title = doc.title.toLowerCase()
    const body = doc.body.toLowerCase()
    let score = 0
    let allFound = true
    for (const term of terms) {
      const inTitle = title.includes(term)
      const inBody = body.includes(term)
      if (!inTitle && !inBody) {
        allFound = false
        break
      }
      score += (inTitle ? 5 : 0) + (inBody ? 1 : 0)
    }
    if (!allFound) continue
    results.push({ ...doc, score, snippet: snippetFor(doc.body, terms) })
  }
  return results.sort((a, b) => b.score - a.score)
}

function snippetFor(body: string, terms: string[]): string {
  const lower = body.toLowerCase()
  const at = Math.min(...terms.map((t) => lower.indexOf(t)).filter((i) => i >= 0))
  if (!Number.isFinite(at)) return body.slice(0, 140)
  const start = Math.max(0, at - 60)
  const end = Math.min(body.length, at + 100)
  return `${start > 0 ? '…' : ''}${body.slice(start, end).trim()}${end < body.length ? '…' : ''}`
}
