import { PROGRAMME } from '@/content/course'
import type { Question } from '@/content/types'
import type { QuizAttempt } from '@/store/progress'

export type Response = string | string[] | boolean

export function isCorrect(question: Question, response: Response | undefined): boolean {
  if (response === undefined) return false
  switch (question.type) {
    case 'single':
      return response === question.answer
    case 'truefalse':
      return response === question.answer
    case 'multi': {
      if (!Array.isArray(response)) return false
      const want = [...question.answer].sort()
      const got = [...response].sort()
      return want.length === got.length && want.every((id, i) => id === got[i])
    }
    case 'order': {
      if (!Array.isArray(response)) return false
      return question.items.every((item, i) => response[i] === item.id)
    }
  }
}

export function hasAnswer(question: Question, response: Response | undefined): boolean {
  if (response === undefined) return false
  if (question.type === 'multi') return Array.isArray(response) && response.length > 0
  return true
}

export function passed(correct: number, total: number): boolean {
  return total > 0 && correct / total >= PROGRAMME.passMark
}

/** Fisher-Yates shuffle that never returns the original order for lists longer than one. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items]
  if (out.length < 2) return out
  do {
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[out[i], out[j]] = [out[j]!, out[i]!]
    }
  } while (out.every((item, i) => item === items[i]))
  return out
}

export interface QuizSummary {
  taken: boolean
  passed: boolean
  attempts: number
  bestCorrect: number
  total: number
}

export function summariseAttempts(attempts: QuizAttempt[] | undefined, total: number): QuizSummary {
  const list = attempts ?? []
  const best = list.reduce((max, a) => Math.max(max, a.correct), 0)
  return {
    taken: list.length > 0,
    passed: list.some((a) => a.passed),
    attempts: list.length,
    bestCorrect: best,
    total,
  }
}
