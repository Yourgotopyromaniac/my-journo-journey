import { ArrowRight, X } from 'lucide-react'
import { Link } from 'react-router'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { getPhase, PHASES, PROGRAMME, weeksInPhase } from '@/content/course'
import { useProgressData } from '@/lib/hooks'
import { isPhaseComplete } from '@/lib/progress'
import { useProgress } from '@/store/progress'

/**
 * A quiet, private marker for finishing a phase.
 * Shown on the quiz results screen, and on the dashboard until she closes it.
 */
export function PhaseMilestone({ phase, onDismiss }: { phase: number; onDismiss?: () => void }) {
  const data = useProgressData()
  const info = getPhase(phase)!
  const next = getPhase(phase + 1)
  const weeks = weeksInPhase(phase)
  const complete = isPhaseComplete(phase, data)
  const isLast = phase === PHASES.length

  if (!complete) {
    return (
      <Box className="p-5">
        <div className="kicker text-accent">Almost there</div>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
          You passed the review. Finish any lessons, assignments or quizzes left in Weeks {weeks[0]!.number} to{' '}
          {weeks[weeks.length - 1]!.number} to complete Phase {phase}.
        </p>
      </Box>
    )
  }

  return (
    <Box className="relative overflow-hidden p-6">
      <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-accent" />
      {onDismiss ? (
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onDismiss} aria-label="Close">
          <X />
        </Button>
      ) : null}
      <div className="kicker text-accent">{isLast ? 'Course complete' : `Phase ${phase} complete`}</div>
      <p className="mt-2 pr-10 font-serif text-[1.75rem] leading-tight font-semibold">
        {isLast ? `You finished the course, ${PROGRAMME.learnerName}.` : `You finished ${info.title}.`}
      </p>
      <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-2">
        {weeks.length} weeks of work: {info.summary.charAt(0).toLowerCase() + info.summary.slice(1)}
      </p>
      <p className="mt-2 max-w-prose text-[0.9375rem] leading-relaxed text-ink-2">
        Take a few minutes to write in your journal. What can you do now that you could not do before?
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {next ? (
          <Button asChild>
            <Link to={`/week/${weeksInPhase(next.number)[0]!.number}`}>
              Start Phase {next.number}: {next.title} <ArrowRight />
            </Link>
          </Button>
        ) : null}
        <Button variant="secondary" asChild>
          <Link to="/journal">Open your journal</Link>
        </Button>
      </div>
    </Box>
  )
}

/** Dashboard slot: shows the most recent completed phase she has not closed yet. */
export function DashboardMilestone() {
  const data = useProgressData()
  const dismissMilestone = useProgress((s) => s.dismissMilestone)
  const phase = [...PHASES]
    .reverse()
    .find((p) => isPhaseComplete(p.number, data) && !data.dismissedMilestones.includes(p.number))
  if (!phase) return null
  return (
    <div className="mt-6">
      <PhaseMilestone phase={phase.number} onDismiss={() => dismissMilestone(phase.number)} />
    </div>
  )
}
