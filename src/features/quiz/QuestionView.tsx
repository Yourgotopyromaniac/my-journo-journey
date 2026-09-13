import { ArrowDown, ArrowUp, Check, X } from 'lucide-react'
import type { Question } from '@/content/types'
import { cn } from '@/lib/cn'
import { isCorrect, type Response } from '@/lib/quiz'

const LETTERS = 'ABCDEFGH'

/**
 * Renders one question. Before checking, options are selectable.
 * After checking, it shows what was right and wrong.
 */
export function QuestionView({
  question,
  optionOrder,
  response,
  onChange,
  checked,
}: {
  question: Question
  /** Display order of option or item ids (shuffled once per attempt). */
  optionOrder: string[]
  response: Response | undefined
  onChange: (response: Response) => void
  checked: boolean
}) {
  return (
    <div>
      {question.context ? (
        <blockquote className="mb-5 rounded-[var(--radius-box)] border border-rule-soft bg-surface px-5 py-4 font-serif text-lg leading-relaxed">
          {question.context}
        </blockquote>
      ) : null}
      {question.type === 'single' || question.type === 'multi' ? (
        <ChoiceList question={question} order={optionOrder} response={response} onChange={onChange} checked={checked} />
      ) : question.type === 'truefalse' ? (
        <TrueFalse question={question} response={response} onChange={onChange} checked={checked} />
      ) : (
        <OrderList question={question} response={response} onChange={onChange} checked={checked} order={optionOrder} />
      )}
    </div>
  )
}

function optionClasses(state: 'idle' | 'selected' | 'correct' | 'wrong' | 'missed' | 'faded') {
  return cn(
    'flex min-h-14 w-full items-center gap-3.5 rounded-[var(--radius-box)] border px-4 py-2.5 text-left text-base transition-colors',
    state === 'idle' && 'border-rule-soft bg-surface hover:border-rule hover:bg-sunken/40',
    state === 'selected' && 'border-accent bg-accent-soft/50 font-medium',
    state === 'correct' && 'border-success bg-success-soft font-medium',
    state === 'wrong' && 'border-accent bg-accent-soft/60',
    state === 'missed' && 'border-dashed border-success bg-surface',
    state === 'faded' && 'border-rule-soft bg-surface text-ink-3',
  )
}

function Key({ children, state }: { children: string; state: 'idle' | 'selected' | 'correct' | 'wrong' | 'missed' | 'faded' }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-7 shrink-0 items-center justify-center rounded-md border text-xs font-semibold',
        state === 'selected' && 'border-accent bg-accent text-on-accent',
        state === 'correct' && 'border-success bg-success text-paper',
        state === 'wrong' && 'border-accent bg-accent text-on-accent',
        (state === 'idle' || state === 'faded' || state === 'missed') && 'border-rule text-ink-2',
      )}
    >
      {children}
    </span>
  )
}

function ChoiceList({
  question,
  order,
  response,
  onChange,
  checked,
}: {
  question: Extract<Question, { type: 'single' | 'multi' }>
  order: string[]
  response: Response | undefined
  onChange: (r: Response) => void
  checked: boolean
}) {
  const multi = question.type === 'multi'
  const selected = new Set(multi ? ((response as string[] | undefined) ?? []) : response ? [response as string] : [])
  const answers = new Set(multi ? question.answer : [question.answer])
  const options = order.map((id) => question.options.find((o) => o.id === id)!)

  return (
    <div role={multi ? 'group' : 'radiogroup'} aria-label="Answers" className="flex flex-col gap-2">
      {multi ? <p className="mb-1 text-sm text-ink-3">Choose all that apply.</p> : null}
      {options.map((option, i) => {
        const isSelected = selected.has(option.id)
        const isAnswer = answers.has(option.id)
        const state = !checked
          ? isSelected
            ? 'selected'
            : 'idle'
          : isAnswer && isSelected
            ? 'correct'
            : isSelected
              ? 'wrong'
              : isAnswer
                ? multi
                  ? 'missed'
                  : 'correct'
                : 'faded'
        return (
          <button
            key={option.id}
            type="button"
            role={multi ? 'checkbox' : 'radio'}
            aria-checked={isSelected}
            disabled={checked}
            onClick={() => {
              if (multi) {
                const next = new Set(selected)
                if (next.has(option.id)) next.delete(option.id)
                else next.add(option.id)
                onChange([...next])
              } else {
                onChange(option.id)
              }
            }}
            className={cn(optionClasses(state), 'disabled:cursor-default')}
          >
            <Key state={state}>{LETTERS[i]!}</Key>
            <span className="flex-1">{option.text}</span>
            {checked && (state === 'correct' || state === 'missed') ? (
              <Check className="size-5 text-success" aria-label="Correct answer" />
            ) : null}
            {checked && state === 'wrong' ? <X className="size-5 text-accent" aria-label="Your answer, incorrect" /> : null}
          </button>
        )
      })}
    </div>
  )
}

function TrueFalse({
  question,
  response,
  onChange,
  checked,
}: {
  question: Extract<Question, { type: 'truefalse' }>
  response: Response | undefined
  onChange: (r: Response) => void
  checked: boolean
}) {
  return (
    <div role="radiogroup" aria-label="Answers" className="grid grid-cols-2 gap-2">
      {[true, false].map((value) => {
        const isSelected = response === value
        const isAnswer = question.answer === value
        const state = !checked ? (isSelected ? 'selected' : 'idle') : isAnswer ? 'correct' : isSelected ? 'wrong' : 'faded'
        return (
          <button
            key={String(value)}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={checked}
            onClick={() => onChange(value)}
            className={cn(optionClasses(state), 'justify-center disabled:cursor-default')}
          >
            {value ? 'True' : 'False'}
          </button>
        )
      })}
    </div>
  )
}

function OrderList({
  question,
  response,
  onChange,
  checked,
  order,
}: {
  question: Extract<Question, { type: 'order' }>
  response: Response | undefined
  onChange: (r: Response) => void
  checked: boolean
  order: string[]
}) {
  const current = (Array.isArray(response) ? response : order) as string[]
  const move = (from: number, to: number) => {
    if (to < 0 || to >= current.length) return
    const next = [...current]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item!)
    onChange(next)
  }
  const correct = checked && isCorrect(question, current)

  return (
    <div>
      <p className="mb-2 text-sm text-ink-3">Use the arrows to put these in the right order, from first to last.</p>
      <ol className="flex flex-col gap-2">
        {current.map((id, i) => {
          const item = question.items.find((it) => it.id === id)!
          const inPlace = question.items[i]?.id === id
          const state = !checked ? 'idle' : inPlace ? 'correct' : 'wrong'
          return (
            <li key={id} className={cn(optionClasses(state), 'py-1.5 pr-1.5')}>
              <Key state={state === 'idle' ? 'idle' : state}>{String(i + 1)}</Key>
              <span className="flex-1">{item.text}</span>
              {!checked ? (
                <span className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                    aria-label={`Move "${item.text}" up`}
                    className="flex size-11 items-center justify-center rounded-md text-ink-2 hover:bg-sunken disabled:opacity-30"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, i + 1)}
                    disabled={i === current.length - 1}
                    aria-label={`Move "${item.text}" down`}
                    className="flex size-11 items-center justify-center rounded-md text-ink-2 hover:bg-sunken disabled:opacity-30"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
      {checked && !correct ? (
        <div className="mt-4 rounded-[var(--radius-box)] border border-rule-soft bg-surface px-4 py-3 text-sm">
          <div className="font-semibold">The right order</div>
          <ol className="mt-1.5 list-decimal space-y-1 pl-5 text-ink-2">
            {question.items.map((it) => (
              <li key={it.id}>{it.text}</li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  )
}
