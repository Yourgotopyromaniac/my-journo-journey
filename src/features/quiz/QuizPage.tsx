import { ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import NotFoundPage from '@/app/NotFoundPage'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/dialog'
import { SegmentedProgress } from '@/components/ui/progress-bar'
import { getWeekContent } from '@/content'
import { PROGRAMME } from '@/content/course'
import type { Question, Quiz } from '@/content/types'
import { cn } from '@/lib/cn'
import { useDocumentTitle } from '@/lib/hooks'
import { hasAnswer, isCorrect, passed, shuffle, summariseAttempts, type Response } from '@/lib/quiz'
import { useProgress } from '@/store/progress'
import { QuestionView } from './QuestionView'

export default function QuizPage() {
  const params = useParams()
  const week = Number(params.week)
  const content = getWeekContent(week)
  useDocumentTitle(content ? `Week ${week} quiz` : 'Page not found')
  if (!content) return <NotFoundPage />
  return <QuizRunner key={week} week={week} quiz={content.quiz} lessonTitles={Object.fromEntries(content.lessons.map((l) => [l.slug, l.title]))} />
}

interface Attempt {
  questions: Question[]
  /** Shuffled option/item ids per question. */
  orders: Record<string, string[]>
}

function newAttempt(quiz: Quiz): Attempt {
  const questions = shuffle(quiz.questions)
  const orders: Record<string, string[]> = {}
  for (const q of questions) {
    if (q.type === 'single' || q.type === 'multi') orders[q.id] = shuffle(q.options.map((o) => o.id))
    if (q.type === 'order') orders[q.id] = shuffle(q.items.map((i) => i.id))
  }
  return { questions, orders }
}

function QuizRunner({ week, quiz, lessonTitles }: { week: number; quiz: Quiz; lessonTitles: Record<string, string> }) {
  const navigate = useNavigate()
  const attempts = useProgress((s) => s.quizAttempts[quiz.id])
  const recordQuizAttempt = useProgress((s) => s.recordQuizAttempt)
  const summary = summariseAttempts(attempts, quiz.questions.length)

  const [started, setStarted] = useState(false)
  const [attempt, setAttempt] = useState(() => newAttempt(quiz))
  const [index, setIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, Response>>({})
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [finished, setFinished] = useState(false)
  const [confirmLeave, setConfirmLeave] = useState(false)

  const question = attempt.questions[index]!
  const total = attempt.questions.length
  const isChecked = !!checked[question.id]
  const correctSoFar = useMemo(
    () => attempt.questions.filter((q) => checked[q.id] && isCorrect(q, responses[q.id])).length,
    [attempt, checked, responses],
  )

  const restart = () => {
    setAttempt(newAttempt(quiz))
    setIndex(0)
    setResponses({})
    setChecked({})
    setFinished(false)
    setStarted(true)
  }

  const check = () => {
    // Order questions count the starting order as an answer if she did not move anything.
    if (question.type === 'order' && responses[question.id] === undefined) {
      setResponses((r) => ({ ...r, [question.id]: attempt.orders[question.id]! }))
    }
    setChecked((c) => ({ ...c, [question.id]: true }))
  }

  const goNext = () => {
    if (index + 1 < total) {
      setIndex(index + 1)
      return
    }
    const wrong = attempt.questions.filter((q) => !isCorrect(q, responses[q.id])).map((q) => q.id)
    const correct = total - wrong.length
    recordQuizAttempt(quiz.id, { correct, total, passed: passed(correct, total), wrongQuestionIds: wrong })
    setFinished(true)
  }

  const close = () => {
    if (started && !finished && Object.keys(checked).length > 0) setConfirmLeave(true)
    else navigate(`/week/${week}`)
  }

  const header = (
    <header className="sticky top-0 z-30 border-b border-rule-soft bg-paper/95 backdrop-blur">
      <div className="mx-auto flex min-h-15 max-w-5xl items-center justify-between gap-3 px-3 sm:px-5">
        <Button variant="ghost" onClick={close}>
          <X /> Close
        </Button>
        <div className="truncate font-serif text-lg font-semibold">Checkpoint quiz · Week {week}</div>
        <div className="w-20 text-right text-sm text-ink-3">{started && !finished ? `${index + 1} / ${total}` : ''}</div>
      </div>
    </header>
  )

  if (!started) {
    return (
      <div className="min-h-dvh bg-paper">
        {header}
        <main className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
          <div className="kicker text-accent">Week {week}</div>
          <h1 className="mt-2 font-serif text-[2.5rem] leading-tight font-semibold">{quiz.title}</h1>
          <p className="mt-3 text-lg text-ink-2">
            {total} questions. You pass with {Math.ceil(total * PROGRAMME.passMark)} or more right. You can try as many times as
            you like.
          </p>
          <ul className="mt-5 space-y-2 text-[0.9375rem] text-ink-2">
            <li>• You see the answer and a short explanation after each question.</li>
            <li>• Questions you miss come back later for practice.</li>
          </ul>
          {summary.taken ? (
            <Box className="mt-6 p-4 text-sm">
              {summary.passed ? 'You have passed this quiz. ' : 'You have not passed this quiz yet. '}
              Best score: {summary.bestCorrect} of {summary.total}.
            </Box>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-2">
            <Button size="lg" onClick={() => setStarted(true)}>
              {summary.taken ? 'Take the quiz again' : 'Start quiz'} <ArrowRight />
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to={`/week/${week}`}>Not now</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  if (finished) {
    const wrong = attempt.questions.filter((q) => !isCorrect(q, responses[q.id]))
    const correct = total - wrong.length
    const didPass = passed(correct, total)
    return (
      <div className="min-h-dvh bg-paper">
        {header}
        <main className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
          <SegmentedProgress total={total} done={total} label="Quiz finished" />
          <div className={cn('kicker mt-10', didPass ? 'text-success' : 'text-accent')}>{didPass ? 'Passed' : 'Not passed yet'}</div>
          <h1 className="mt-2 font-serif text-[2.75rem] leading-tight font-semibold">
            {correct} of {total} right.
          </h1>
          <p className="mt-3 text-lg text-ink-2">
            {didPass
              ? correct === total
                ? 'Well done. You got every question right.'
                : 'Well done. You passed this checkpoint.'
              : `You need ${Math.ceil(total * PROGRAMME.passMark)} to pass. Read the explanations, look back at the lessons, and try again.`}
          </p>

          {wrong.length ? (
            <section className="mt-8">
              <h2 className="text-sm font-semibold">Questions to look at again</h2>
              <Box className="mt-2.5 overflow-hidden">
                <ul>
                  {wrong.map((q, i) => (
                    <li key={q.id} className={cn('px-4 py-3', i > 0 && 'border-t border-rule-soft')}>
                      <div className="text-[0.9375rem] font-medium">{q.prompt}</div>
                      <p className="mt-1 text-sm leading-relaxed text-ink-2">{q.explanation}</p>
                      {q.lessonSlug && lessonTitles[q.lessonSlug] ? (
                        <Link
                          to={`/week/${week}/lesson/${q.lessonSlug}`}
                          className="mt-1 inline-flex min-h-11 items-center text-sm font-medium text-accent"
                        >
                          Read again: {lessonTitles[q.lessonSlug]}
                        </Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Box>
              <p className="mt-2 text-xs text-ink-3">These questions will come back in your review in a few days.</p>
            </section>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-2">
            {didPass ? (
              <Button size="lg" asChild>
                <Link to={`/week/${week}`}>
                  Back to Week {week} <ArrowRight />
                </Link>
              </Button>
            ) : null}
            <Button size="lg" variant={didPass ? 'secondary' : 'primary'} onClick={restart}>
              <RotateCcw /> Try again
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const correctNow = isChecked && isCorrect(question, responses[question.id])

  return (
    <div className="min-h-dvh bg-paper">
      {header}
      <main className="mx-auto flex max-w-2xl flex-col px-5 pt-8 pb-12 sm:px-8">
        <SegmentedProgress total={total} done={index + (isChecked ? 1 : 0)} current={isChecked ? undefined : index} label={`Question ${index + 1} of ${total}`} />
        <p className="mt-8 text-[0.8125rem] text-ink-3">
          Question {index + 1}
          {question.lessonSlug && lessonTitles[question.lessonSlug] ? ` · ${lessonTitles[question.lessonSlug]}` : ''}
        </p>
        <h1 className="mt-2 mb-5 font-serif text-[1.625rem] leading-snug font-semibold">{question.prompt}</h1>

        <QuestionView
          question={question}
          optionOrder={attempt.orders[question.id] ?? []}
          response={responses[question.id]}
          onChange={(r) => setResponses((prev) => ({ ...prev, [question.id]: r }))}
          checked={isChecked}
        />

        <div aria-live="polite">
          {isChecked ? (
            <Box className="mt-5 p-4">
              <div className={cn('flex items-center gap-2 font-semibold', correctNow ? 'text-success' : 'text-accent')}>
                {correctNow ? <Check className="size-5" /> : <X className="size-5" />}
                {correctNow ? 'Correct' : 'Not quite'}
              </div>
              <p className="mt-1.5 font-serif text-[1.0625rem] leading-relaxed">{question.explanation}</p>
              {question.lessonSlug && lessonTitles[question.lessonSlug] ? (
                <Link
                  to={`/week/${week}/lesson/${question.lessonSlug}`}
                  className="mt-1 inline-flex min-h-11 items-center text-sm font-medium text-accent hover:text-accent-strong"
                >
                  Read the lesson again: {lessonTitles[question.lessonSlug]}
                </Link>
              ) : null}
            </Box>
          ) : null}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <span className="text-sm text-ink-3">{correctSoFar} correct so far</span>
          {isChecked ? (
            <Button size="lg" onClick={goNext}>
              {index + 1 < total ? 'Next question' : 'See your result'} <ArrowRight />
            </Button>
          ) : (
            <Button size="lg" onClick={check} disabled={question.type !== 'order' && !hasAnswer(question, responses[question.id])}>
              Check answer
            </Button>
          )}
        </div>
      </main>

      <ConfirmDialog
        open={confirmLeave}
        onOpenChange={setConfirmLeave}
        title="Leave the quiz?"
        description="Your answers for this attempt will not be saved. You can start again any time."
        confirmLabel="Leave quiz"
        cancelLabel="Keep going"
        destructive
        onConfirm={() => navigate(`/week/${week}`)}
      />
    </div>
  )
}
