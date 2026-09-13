import { getWeekOutline, isLastWeekOfPhase } from './course'
import type { Lesson, PhaseReview, Question, Quiz, Resource, WeekContent } from './types'

/**
 * Written weeks register themselves by living at ./weeks/week-NN/index.ts.
 * Phase reviews live at ./phases/phase-N.ts.
 * Metadata loads eagerly (it is small). Lesson text loads on demand.
 */
const weekModules = import.meta.glob<{ default: WeekContent }>('./weeks/week-*/index.ts', { eager: true })
const phaseModules = import.meta.glob<{ default: PhaseReview }>('./phases/phase-*.ts', { eager: true })

const WEEK_CONTENT = new Map<number, WeekContent>()
for (const mod of Object.values(weekModules)) WEEK_CONTENT.set(mod.default.number, mod.default)

const PHASE_REVIEWS = new Map<number, PhaseReview>()
for (const mod of Object.values(phaseModules)) PHASE_REVIEWS.set(mod.default.phase, mod.default)

export function getWeekContent(week: number): WeekContent | undefined {
  return WEEK_CONTENT.get(week)
}

export function isWeekWritten(week: number): boolean {
  return WEEK_CONTENT.has(week)
}

export function writtenWeeks(): WeekContent[] {
  return [...WEEK_CONTENT.values()].sort((a, b) => a.number - b.number)
}

export function getLesson(week: number, slug: string): Lesson | undefined {
  return WEEK_CONTENT.get(week)?.lessons.find((l) => l.slug === slug)
}

export function getPhaseReview(phase: number): PhaseReview | undefined {
  return PHASE_REVIEWS.get(phase)
}

/** The phase review that belongs to a week, if that week is the last of its phase. */
export function phaseReviewForWeek(week: number): PhaseReview | undefined {
  const outline = getWeekOutline(week)
  if (!outline || !isLastWeekOfPhase(week)) return undefined
  return PHASE_REVIEWS.get(outline.phase)
}

export interface QuizEntry {
  quiz: Quiz
  kind: 'checkpoint' | 'phase'
  /** Week the quiz belongs to. */
  week: number
  href: string
  label: string
}

export function allQuizzes(): QuizEntry[] {
  const list: QuizEntry[] = []
  for (const w of writtenWeeks()) {
    list.push({ quiz: w.quiz, kind: 'checkpoint', week: w.number, href: `/week/${w.number}/quiz`, label: `Week ${w.number} quiz` })
    const review = phaseReviewForWeek(w.number)
    if (review) {
      list.push({
        quiz: review.quiz,
        kind: 'phase',
        week: w.number,
        href: `/phase/${review.phase}/review`,
        label: `Phase ${review.phase} review`,
      })
    }
  }
  return list
}

export function findQuestion(quizId: string, questionId: string): (QuizEntry & { question: Question }) | undefined {
  for (const entry of allQuizzes()) {
    if (entry.quiz.id !== quizId) continue
    const question = entry.quiz.questions.find((q) => q.id === questionId)
    if (question) return { ...entry, question }
  }
  return undefined
}

/** Every external resource from written weeks, with the week it belongs to. */
export function allResources(): (Resource & { week: number })[] {
  const seen = new Set<string>()
  const out: (Resource & { week: number })[] = []
  for (const w of writtenWeeks()) {
    for (const r of w.resources) {
      if (seen.has(r.url)) continue
      seen.add(r.url)
      out.push({ ...r, week: w.number })
    }
  }
  return out
}
