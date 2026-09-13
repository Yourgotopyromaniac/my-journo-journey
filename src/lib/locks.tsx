import { Lock } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Navigate, useNavigate, useParams, type NavigateFunction } from 'react-router'
import { toast } from 'sonner'
import { getPhase, getWeekOutline, weeksInPhase } from '@/content/course'
import type { ProgressData } from '@/store/progress'
import { useProgressData } from './hooks'
import { currentLearningWeek, isWeekUnlocked } from './progress'

/** Friendly message when she tries to open a week in a phase that is not open yet. */
export function showLockedToast(week: number, data: ProgressData, navigate: NavigateFunction) {
  const outline = getWeekOutline(week)
  if (!outline) return
  const previous = getPhase(outline.phase - 1)
  const current = currentLearningWeek(data)
  toast(`Phase ${outline.phase} is not open yet`, {
    // A fixed id stops the same message from stacking up.
    id: 'phase-locked',
    icon: <Lock className="size-5" strokeWidth={1.8} />,
    description: previous
      ? `Where you dey fly to? Finish Phase ${previous.number}: ${previous.title} first, and this phase will open. One week at a time.`
      : 'Finish the phase before this one first.',
    action: {
      label: `Go to Week ${current}`,
      onClick: () => navigate(`/week/${current}`),
    },
  })
}

/**
 * Guards every page that belongs to a week (the week, its lessons, assignments and quizzes,
 * and phase reviews). If that week's phase is locked, she is sent to the roadmap with a toast.
 */
export function WeekRouteLock({ children }: { children: ReactNode }) {
  const params = useParams()
  const data = useProgressData()
  const navigate = useNavigate()

  const phaseWeeks = params.phase ? weeksInPhase(Number(params.phase)) : []
  const week = params.week ? Number(params.week) : phaseWeeks[phaseWeeks.length - 1]?.number
  const locked = week !== undefined && getWeekOutline(week) !== undefined && !isWeekUnlocked(week, data)

  useEffect(() => {
    if (locked && week !== undefined) showLockedToast(week, data, navigate)
  }, [locked, week, data, navigate])

  if (locked) return <Navigate to="/roadmap" replace />
  return <>{children}</>
}
