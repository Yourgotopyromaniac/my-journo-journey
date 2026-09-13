import { useParams } from 'react-router'
import NotFoundPage from '@/app/NotFoundPage'
import { getPhaseReview } from '@/content'
import { getPhase, weeksInPhase } from '@/content/course'
import { useDocumentTitle } from '@/lib/hooks'
import { PhaseMilestone } from '../dashboard/PhaseMilestone'
import { QuizRunner } from './QuizRunner'

export default function PhaseReviewPage() {
  const params = useParams()
  const phaseNumber = Number(params.phase)
  const review = getPhaseReview(phaseNumber)
  const phase = getPhase(phaseNumber)
  useDocumentTitle(review ? `Phase ${phaseNumber} review` : 'Page not found')
  if (!review || !phase) return <NotFoundPage />

  const weeks = weeksInPhase(phaseNumber)
  const lastWeek = weeks[weeks.length - 1]!.number

  return (
    <QuizRunner
      key={phaseNumber}
      quiz={review.quiz}
      week={lastWeek}
      heading={`Phase ${phaseNumber} review`}
      kicker={`Phase ${phaseNumber} · ${phase.title}`}
      backTo={`/week/${lastWeek}`}
      backLabel={`Back to Week ${lastWeek}`}
      intro={
        <ul className="space-y-2">
          <li>
            • This quiz covers all of Phase {phaseNumber}: Weeks {weeks[0]!.number} to {lastWeek}.
          </li>
          <li>• It is longer than a weekly quiz. Give yourself about 25 minutes.</li>
          <li>• Each explanation links to the lesson, so you can go back and check.</li>
        </ul>
      }
      passedExtra={<PhaseMilestone phase={phaseNumber} />}
    />
  )
}
