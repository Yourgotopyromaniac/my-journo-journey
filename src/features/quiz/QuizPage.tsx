import { useParams } from 'react-router'
import NotFoundPage from '@/app/NotFoundPage'
import { getWeekContent } from '@/content'
import { useDocumentTitle } from '@/lib/hooks'
import { QuizRunner } from './QuizRunner'

export default function QuizPage() {
  const params = useParams()
  const week = Number(params.week)
  const content = getWeekContent(week)
  useDocumentTitle(content ? `Week ${week} quiz` : 'Page not found')
  if (!content) return <NotFoundPage />

  return (
    <QuizRunner
      key={week}
      quiz={content.quiz}
      week={week}
      heading={`Checkpoint quiz · Week ${week}`}
      kicker={`Week ${week}`}
      backTo={`/week/${week}`}
      backLabel={`Back to Week ${week}`}
      intro={
        <ul className="space-y-2">
          <li>• You see the answer and a short explanation after each question.</li>
          <li>• Questions you miss come back later for practice.</li>
        </ul>
      }
    />
  )
}
