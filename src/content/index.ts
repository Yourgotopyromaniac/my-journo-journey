import type { Lesson, Question, Quiz, WeekContent } from './types'

/**
 * Written weeks register themselves by living at ./weeks/week-NN/index.ts.
 * Week metadata loads eagerly (it is small). Lesson text loads on demand.
 */
const modules = import.meta.glob<{ default: WeekContent }>('./weeks/week-*/index.ts', { eager: true })

const WEEK_CONTENT = new Map<number, WeekContent>()
for (const mod of Object.values(modules)) {
  WEEK_CONTENT.set(mod.default.number, mod.default)
}

export function getWeekContent(week: number): WeekContent | undefined {
  return WEEK_CONTENT.get(week)
}

export function isWeekWritten(week: number): boolean {
  return WEEK_CONTENT.has(week)
}

export function getLesson(week: number, slug: string): Lesson | undefined {
  return WEEK_CONTENT.get(week)?.lessons.find((l) => l.slug === slug)
}

export function allQuizzes(): { week: number; quiz: Quiz }[] {
  return [...WEEK_CONTENT.values()].map((w) => ({ week: w.number, quiz: w.quiz }))
}

export function findQuestion(quizId: string, questionId: string): { week: number; quiz: Quiz; question: Question } | undefined {
  for (const { week, quiz } of allQuizzes()) {
    if (quiz.id !== quizId) continue
    const question = quiz.questions.find((q) => q.id === questionId)
    if (question) return { week, quiz, question }
  }
  return undefined
}
