import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { Box } from '@/components/ui/box'
import { StatusIcon, type Status } from '@/components/ui/status-icon'
import { getWeekContent, phaseReviewForWeek } from '@/content'
import { cn } from '@/lib/cn'
import { assignmentStatus } from '@/lib/progress'
import { summariseAttempts } from '@/lib/quiz'
import { lessonKey, type ProgressData } from '@/store/progress'

interface Row {
  key: string
  href: string
  title: string
  type: string
  meta: string
  status: Status
}

function weekRows(week: number, data: ProgressData): Row[] {
  const content = getWeekContent(week)
  if (!content) return []
  const rows: Row[] = []

  for (const l of content.lessons) {
    const p = data.lessons[lessonKey(week, l.slug)]
    rows.push({
      key: `l-${l.slug}`,
      href: `/week/${week}/lesson/${l.slug}`,
      title: l.title,
      type: 'Lesson',
      meta: `${l.minutes} min`,
      status: p?.completedAt ? 'done' : p?.openedAt ? 'current' : 'todo',
    })
  }
  for (const a of content.assignments) {
    const s = assignmentStatus(a, data)
    rows.push({
      key: `a-${a.id}`,
      href: `/week/${week}/assignment/${a.id}`,
      title: a.title,
      type: 'Assignment',
      meta: `${a.minutes} min`,
      status: s === 'done' ? 'done' : s === 'in-progress' ? 'current' : 'todo',
    })
  }
  const quiz = summariseAttempts(data.quizAttempts[content.quiz.id], content.quiz.questions.length)
  rows.push({
    key: 'quiz',
    href: `/week/${week}/quiz`,
    title: 'Checkpoint quiz',
    type: 'Quiz',
    meta: `${content.quiz.questions.length} questions`,
    status: quiz.passed ? 'done' : quiz.taken ? 'current' : 'todo',
  })
  const review = phaseReviewForWeek(week)
  if (review) {
    const r = summariseAttempts(data.quizAttempts[review.quiz.id], review.quiz.questions.length)
    rows.push({
      key: 'phase-review',
      href: `/phase/${review.phase}/review`,
      title: `Phase ${review.phase} review quiz`,
      type: 'Quiz',
      meta: `${review.quiz.questions.length} questions`,
      status: r.passed ? 'done' : r.taken ? 'current' : 'todo',
    })
  }
  return rows
}

export function WeekChecklist({ week, data, className }: { week: number; data: ProgressData; className?: string }) {
  const rows = weekRows(week, data)
  // Highlight the first row that is not done: the thing to do next.
  const nextKey = rows.find((r) => r.status !== 'done')?.key

  return (
    <Box className={cn('overflow-hidden', className)}>
      <ul>
        {rows.map((row, i) => (
          <li key={row.key} className={cn(i > 0 && 'border-t border-rule-soft')}>
            <Link
              to={row.href}
              className={cn(
                'grid min-h-13 grid-cols-[1.25rem_1fr_auto] items-center gap-3 px-4 py-2 transition-colors hover:bg-sunken/60 sm:grid-cols-[1.25rem_1fr_6rem_6rem_1rem]',
                row.key === nextKey && 'bg-accent-soft/40',
              )}
            >
              <StatusIcon status={row.status} />
              <span className={cn('min-w-0', row.status === 'done' ? 'text-ink-2' : 'text-ink', row.key === nextKey && 'font-medium')}>
                {row.title}
                <span className="block text-xs text-ink-3 sm:hidden">
                  {row.type} · {row.meta}
                </span>
              </span>
              <span className="hidden text-xs text-ink-3 sm:block">{row.type}</span>
              <span className="hidden text-right text-[0.8125rem] text-ink-3 sm:block">{row.meta}</span>
              <ChevronRight className="size-4 text-ink-3" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </Box>
  )
}
