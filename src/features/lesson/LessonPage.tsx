import { ArrowRight, Check, ChevronLeft, ChevronRight, Type } from 'lucide-react'
import { Popover } from 'radix-ui'
import type { MDXContent } from 'mdx/types'
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router'
import { FocusBar } from '@/app/FocusBar'
import NotFoundPage from '@/app/NotFoundPage'
import { Button } from '@/components/ui/button'
import { ChoiceGroup } from '@/components/ui/choice-group'
import { getLesson, getWeekContent } from '@/content'
import { cn } from '@/lib/cn'
import { formatDayYear } from '@/lib/dates'
import { useDocumentTitle } from '@/lib/hooks'
import { lessonKey, useProgress, type TextSize } from '@/store/progress'
import { mdxComponents } from './mdx-components'

interface Section {
  id: string
  title: string
}

export default function LessonPage() {
  const params = useParams()
  const week = Number(params.week)
  const slug = params.slug ?? ''
  const content = getWeekContent(week)
  const lesson = getLesson(week, slug)
  useDocumentTitle(lesson?.title ?? 'Page not found')

  if (!content || !lesson) return <NotFoundPage />
  // Remount per lesson so loading state and scroll tracking reset cleanly.
  return <LessonView key={`${week}/${slug}`} week={week} slug={slug} />
}

function LessonView({ week, slug }: { week: number; slug: string }) {
  const content = getWeekContent(week)!
  const lesson = getLesson(week, slug)!
  const index = content.lessons.findIndex((l) => l.slug === slug)
  const prev = content.lessons[index - 1]
  const next = content.lessons[index + 1]

  const allLessons = useProgress((s) => s.lessons)
  const progress = allLessons[lessonKey(week, slug)]
  const openLesson = useProgress((s) => s.openLesson)
  const setLessonSection = useProgress((s) => s.setLessonSection)
  const setLessonComplete = useProgress((s) => s.setLessonComplete)
  const done = !!progress?.completedAt

  const [Body, setBody] = useState<MDXContent | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [sections, setSections] = useState<Section[]>([])
  const [active, setActive] = useState<string | null>(null)
  const [readFraction, setReadFraction] = useState(0)
  const [resumeFrom] = useState(() => (progress?.completedAt ? undefined : progress?.lastSection))
  const [showResume, setShowResume] = useState(false)
  const articleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    openLesson(week, slug)
  }, [openLesson, week, slug])

  useEffect(() => {
    let cancelled = false
    lesson
      .load()
      .then((mod) => !cancelled && setBody(() => mod.default))
      .catch(() => !cancelled && setLoadError(true))
    return () => {
      cancelled = true
    }
  }, [lesson])

  // Collect section headings once the lesson has rendered, and track which one is being read.
  useEffect(() => {
    if (!Body || !articleRef.current) return
    const headings = [...articleRef.current.querySelectorAll<HTMLHeadingElement>('h2[data-section]')]
    setSections(headings.map((h) => ({ id: h.id, title: h.textContent ?? '' })))
    if (resumeFrom && headings.some((h) => h.id === resumeFrom)) setShowResume(true)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        const top = visible[0]
        if (top) {
          setActive(top.target.id)
          setLessonSection(week, slug, top.target.id)
        }
      },
      { rootMargin: '-72px 0px -60% 0px' },
    )
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [Body, resumeFrom, setLessonSection, week, slug])

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current
      if (!el) return
      const total = el.offsetTop + el.offsetHeight - window.innerHeight
      setReadFraction(total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 1)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [Body])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setShowResume(false)
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
            <span className="text-ink">{lesson.title}</span>
          </>
        }
        actions={
          <>
            <span className="hidden text-[0.8125rem] text-ink-3 sm:inline">
              Lesson {index + 1} of {content.lessons.length}
            </span>
            <TextSizeButton />
            <Button variant={done ? 'ink' : 'secondary'} size="sm" onClick={() => setLessonComplete(week, slug, !done)} aria-pressed={done}>
              <Check /> <span className="hidden sm:inline">{done ? 'Done' : 'Mark as done'}</span>
            </Button>
          </>
        }
      />
      <div className="sticky top-15 z-20 h-0.5 bg-rule-soft">
        <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${Math.round(readFraction * 100)}%` }} />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-5 pt-8 pb-28 sm:px-8 lg:grid-cols-[13rem_minmax(0,42rem)] lg:pt-11">
        <nav aria-label="Lesson outline" className="hidden lg:block">
          <div className="sticky top-24">
            {sections.length ? (
              <>
                <div className="text-xs font-medium text-ink-3">On this page</div>
                <ul className="mt-1.5">
                  {sections.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(s.id)}
                        className={cn(
                          'flex min-h-11 w-full items-center gap-2 text-left text-[0.8125rem] leading-snug',
                          active === s.id ? 'font-medium text-ink' : 'text-ink-3 hover:text-ink',
                        )}
                      >
                        <span className={cn('size-1.5 shrink-0 rounded-full', active === s.id ? 'bg-accent' : 'bg-transparent')} />
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <div className="mt-7 text-xs font-medium text-ink-3">Week {week} lessons</div>
            <ul className="mt-1.5">
              {content.lessons.map((l, i) => {
                const lp = allLessons[lessonKey(week, l.slug)]
                return (
                  <li key={l.slug}>
                    <Link
                      to={`/week/${week}/lesson/${l.slug}`}
                      aria-current={l.slug === slug ? 'page' : undefined}
                      className={cn(
                        'flex min-h-11 items-center gap-2 text-[0.8125rem] leading-snug',
                        l.slug === slug ? 'font-medium text-ink' : 'text-ink-3 hover:text-ink',
                      )}
                    >
                      <span className="w-3.5 shrink-0 text-center">
                        {lp?.completedAt ? <Check className="size-3.5" aria-label="Done" /> : i + 1}
                      </span>
                      {l.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        <article ref={articleRef} className="min-w-0">
          <p className="text-[0.8125rem] text-ink-3">
            Lesson {index + 1} · {lesson.minutes} min read
          </p>
          <h1 className="mt-2 font-serif text-[2.5rem] leading-[1.08] font-semibold tracking-[-0.015em] sm:text-[2.75rem]">
            {lesson.title}
          </h1>
          <p className="mt-3 font-serif text-xl leading-snug text-ink-2 italic">{lesson.summary}</p>

          {showResume && resumeFrom ? (
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-[var(--radius-box)] border border-rule-soft bg-surface px-4 py-2.5 text-sm">
              <span className="text-ink-2">You were reading “{sections.find((s) => s.id === resumeFrom)?.title}”.</span>
              <Button size="sm" variant="secondary" onClick={() => scrollToSection(resumeFrom)}>
                Continue from there
              </Button>
            </div>
          ) : null}

          <div className="prose-lesson mt-8 border-t border-rule-soft pt-8">
            {loadError ? (
              <p className="font-sans text-base text-ink-2">
                This lesson did not load. Check your connection and reload the page. If you have opened it before, it should
                work offline.
              </p>
            ) : Body ? (
              <Body components={mdxComponents} />
            ) : (
              <div aria-busy="true" aria-label="Loading lesson" className="space-y-3">
                {[92, 100, 85, 96, 70].map((w, i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-sunken" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}
          </div>

          {Body ? (
            <>
              {lesson.sources.length ? (
                <section className="mt-12 border-t border-rule-soft pt-6">
                  <h2 className="text-sm font-semibold">Sources</h2>
                  <ol className="mt-3 list-decimal space-y-2 pl-5 text-[0.8125rem] leading-relaxed text-ink-2">
                    {lesson.sources.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noreferrer" className="text-ink underline decoration-rule underline-offset-2 hover:decoration-accent">
                          {s.title}
                        </a>
                        , {s.publisher}. Checked {formatDayYear(s.checked)}.
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}

              <div className="mt-10 flex flex-col items-start gap-3 rounded-[var(--radius-box)] border border-rule-soft bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-serif text-xl font-semibold">{done ? 'Lesson done.' : 'Finished reading?'}</div>
                  <p className="mt-0.5 text-sm text-ink-2">
                    {done ? 'You can come back to it at any time.' : 'Mark it as done to update your weekly goal.'}
                  </p>
                </div>
                {done ? (
                  <Button asChild>
                    <Link to={next ? `/week/${week}/lesson/${next.slug}` : `/week/${week}`}>
                      {next ? 'Next lesson' : 'Back to the week'} <ArrowRight />
                    </Link>
                  </Button>
                ) : (
                  <Button onClick={() => setLessonComplete(week, slug, true)}>
                    <Check /> Mark as done
                  </Button>
                )}
              </div>
            </>
          ) : null}
        </article>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-rule-soft bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-3 sm:px-8">
          {prev ? (
            <Link to={`/week/${week}/lesson/${prev.slug}`} className="flex min-h-11 min-w-0 items-center gap-2 rounded-md px-2 hover:bg-sunken">
              <ChevronLeft className="size-5 shrink-0" aria-hidden />
              <span className="hidden text-sm text-ink-3 sm:inline">Previous</span>
              <span className="truncate text-sm font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/week/${week}/lesson/${next.slug}`} className="flex min-h-11 min-w-0 items-center gap-2 rounded-md px-2 hover:bg-sunken">
              <span className="hidden text-sm text-ink-3 sm:inline">Next</span>
              <span className="truncate text-sm font-medium">{next.title}</span>
              <ChevronRight className="size-5 shrink-0" aria-hidden />
            </Link>
          ) : (
            <Link to={`/week/${week}`} className="flex min-h-11 items-center gap-2 rounded-md px-2 hover:bg-sunken">
              <span className="text-sm font-medium">Back to Week {week}</span>
              <ChevronRight className="size-5" aria-hidden />
            </Link>
          )}
        </div>
      </footer>
    </div>
  )
}

function TextSizeButton() {
  const textSize = useProgress((s) => s.textSize)
  const setTextSize = useProgress((s) => s.setTextSize)
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label="Text size">
          <Type />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={6}
          className="z-50 rounded-[var(--radius-box)] border border-rule-soft bg-surface p-3 shadow-[0_12px_30px_rgba(0,0,0,0.12)]"
        >
          <div className="mb-2 text-xs font-medium text-ink-3">Text size</div>
          <ChoiceGroup<TextSize>
            label="Text size"
            value={textSize}
            onChange={setTextSize}
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'large', label: 'Large' },
              { value: 'larger', label: 'Larger' },
            ]}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
