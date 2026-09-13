import { ArrowRight, Check, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { FocusBar } from '@/app/FocusBar'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { SegmentedProgress } from '@/components/ui/progress-bar'
import { findQuestion } from '@/content'
import { cn } from '@/lib/cn'
import { useDocumentTitle, useToday } from '@/lib/hooks'
import { hasAnswer, isCorrect, shuffle, type Response } from '@/lib/quiz'
import { useProgress, type ReviewItem } from '@/store/progress'
import { QuestionView } from '../quiz/QuestionView'

export default function ReviewPage() {
  useDocumentTitle('Review')
  const date = useToday()
  const answerReview = useProgress((s) => s.answerReview)

  // Fix the list when the session starts, so answering does not reshuffle it.
  const [items] = useState(() =>
    shuffle(
      Object.values(useProgress.getState().review)
        .filter((r) => r.due <= date)
        .map((r) => ({ item: r, found: findQuestion(r.quizId, r.questionId) }))
        .filter((x): x is { item: ReviewItem; found: NonNullable<ReturnType<typeof findQuestion>> } => !!x.found),
    ).slice(0, 10),
  )
  const [orders] = useState(() =>
    Object.fromEntries(
      items.map(({ found: { question: q } }) => [
        q.id,
        q.type === 'single' || q.type === 'multi'
          ? shuffle(q.options.map((o) => o.id))
          : q.type === 'order'
            ? shuffle(q.items.map((i) => i.id))
            : [],
      ]),
    ),
  )
  const [index, setIndex] = useState(0)
  const [response, setResponse] = useState<Response | undefined>()
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)

  const current = items[index]

  if (!current || index >= items.length) {
    return (
      <div className="min-h-dvh bg-paper">
        <FocusBar backTo="/" backLabel="Back to today" crumbs="Review" />
        <main className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
          <div className="kicker text-accent">Review</div>
          <h1 className="mt-2 font-serif text-[2.5rem] leading-tight font-semibold">
            {items.length ? `${score} of ${items.length} right.` : 'Nothing to review today.'}
          </h1>
          <p className="mt-3 text-lg text-ink-2">
            {items.length
              ? 'Questions you got right come back less often. Ones you missed come back in two days.'
              : 'Questions you miss in quizzes come back here after a few days.'}
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link to="/">
              Back to today <ArrowRight />
            </Link>
          </Button>
        </main>
      </div>
    )
  }

  const { question } = current.found
  const correct = checked && isCorrect(question, response)

  const check = () => {
    const final = question.type === 'order' && response === undefined ? orders[question.id] : response
    setResponse(final)
    const ok = isCorrect(question, final)
    answerReview(current.item.quizId, question.id, ok)
    if (ok) setScore((s) => s + 1)
    setChecked(true)
  }

  const next = () => {
    setIndex((i) => i + 1)
    setResponse(undefined)
    setChecked(false)
  }

  return (
    <div className="min-h-dvh bg-paper">
      <FocusBar backTo="/" backLabel="Back to today" crumbs={`Review · ${index + 1} of ${items.length}`} />
      <main className="mx-auto max-w-2xl px-5 pt-8 pb-12 sm:px-8">
        <SegmentedProgress total={items.length} done={index + (checked ? 1 : 0)} current={checked ? undefined : index} label="Review progress" />
        <p className="mt-8 text-[0.8125rem] text-ink-3">From Week {current.found.week}</p>
        <h1 className="mt-2 mb-5 font-serif text-[1.625rem] leading-snug font-semibold">{question.prompt}</h1>
        <QuestionView
          question={question}
          optionOrder={orders[question.id] ?? []}
          response={response}
          onChange={setResponse}
          checked={checked}
        />
        <div aria-live="polite">
          {checked ? (
            <Box className="mt-5 p-4">
              <div className={cn('flex items-center gap-2 font-semibold', correct ? 'text-success' : 'text-accent')}>
                {correct ? <Check className="size-5" /> : <X className="size-5" />}
                {correct ? 'Correct' : 'Not quite'}
              </div>
              <p className="mt-1.5 font-serif text-[1.0625rem] leading-relaxed">{question.explanation}</p>
            </Box>
          ) : null}
        </div>
        <div className="mt-8 flex justify-end">
          {checked ? (
            <Button size="lg" onClick={next}>
              {index + 1 < items.length ? 'Next question' : 'Finish'} <ArrowRight />
            </Button>
          ) : (
            <Button size="lg" onClick={check} disabled={question.type !== 'order' && !hasAnswer(question, response)}>
              Check answer
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
