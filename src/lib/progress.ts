import { PROGRAMME, WEEKS, weeksInPhase } from '@/content/course'
import { getWeekContent, phaseReviewForWeek } from '@/content'
import type { Assignment } from '@/content/types'
import { lessonKey, type AssignmentStatus, type ProgressData } from '@/store/progress'
import { summariseAttempts, type QuizSummary } from './quiz'
import { scheduledWeek, type Slot } from './schedule'
import type { IsoDate } from './dates'

/** Assignment status, including ones that complete themselves (such as the news diary). */
export function assignmentStatus(assignment: Assignment, data: ProgressData): AssignmentStatus {
  const saved = data.assignments[assignment.id]?.status ?? 'not-started'
  if (saved === 'done') return 'done'
  if (assignment.doneWhenDiaryEntries !== undefined) {
    if (data.diary.length >= assignment.doneWhenDiaryEntries) return 'done'
    if (data.diary.length > 0) return 'in-progress'
  }
  return saved
}

export interface WeekProgress {
  week: number
  written: boolean
  lessonsDone: number
  lessonsTotal: number
  assignmentsDone: number
  assignmentsTotal: number
  quiz: QuizSummary
  /** Present only in the last week of a phase that has a review quiz. */
  phaseReview?: QuizSummary
  itemsDone: number
  itemsTotal: number
  complete: boolean
  started: boolean
  /** 0 to 1, each lesson, assignment and quiz counting once. */
  fraction: number
}

const emptyQuiz: QuizSummary = { taken: false, passed: false, attempts: 0, bestCorrect: 0, total: 0 }

export function weekProgress(week: number, data: ProgressData): WeekProgress {
  const content = getWeekContent(week)
  if (!content) {
    return {
      week,
      written: false,
      lessonsDone: 0,
      lessonsTotal: 0,
      assignmentsDone: 0,
      assignmentsTotal: 0,
      quiz: emptyQuiz,
      itemsDone: 0,
      itemsTotal: 0,
      complete: false,
      started: false,
      fraction: 0,
    }
  }

  const lessonsDone = content.lessons.filter((l) => data.lessons[lessonKey(week, l.slug)]?.completedAt).length
  const assignmentsDone = content.assignments.filter((a) => assignmentStatus(a, data) === 'done').length
  const quiz = summariseAttempts(data.quizAttempts[content.quiz.id], content.quiz.questions.length)
  const review = phaseReviewForWeek(week)
  const phaseReview = review ? summariseAttempts(data.quizAttempts[review.quiz.id], review.quiz.questions.length) : undefined

  const itemsTotal = content.lessons.length + content.assignments.length + 1 + (phaseReview ? 1 : 0)
  const itemsDone = lessonsDone + assignmentsDone + (quiz.passed ? 1 : 0) + (phaseReview?.passed ? 1 : 0)
  const started =
    itemsDone > 0 ||
    content.lessons.some((l) => data.lessons[lessonKey(week, l.slug)]?.openedAt) ||
    content.assignments.some((a) => assignmentStatus(a, data) !== 'not-started') ||
    quiz.taken

  return {
    week,
    written: true,
    lessonsDone,
    lessonsTotal: content.lessons.length,
    assignmentsDone,
    assignmentsTotal: content.assignments.length,
    quiz,
    phaseReview,
    itemsDone,
    itemsTotal,
    complete: itemsDone === itemsTotal,
    started,
    fraction: itemsDone / itemsTotal,
  }
}

/** The first week that is not complete. */
export function currentLearningWeek(data: ProgressData): number {
  for (const w of WEEKS) {
    if (!weekProgress(w.number, data).complete) return w.number
  }
  return PROGRAMME.totalWeeks
}

export function isPhaseComplete(phase: number, data: ProgressData): boolean {
  const weeks = weeksInPhase(phase)
  return weeks.length > 0 && weeks.every((w) => weekProgress(w.number, data).complete)
}

/**
 * Phases open one at a time. Phase 1 is always open; each later phase opens once every week
 * of the phase before it is complete, including its review quiz. Weeks inside an open phase
 * are all open, so she can still move around within a phase.
 */
export function isPhaseUnlocked(phase: number, data: ProgressData): boolean {
  if (phase <= 1) return true
  return isPhaseComplete(phase - 1, data) && isPhaseUnlocked(phase - 1, data)
}

export function isWeekUnlocked(week: number, data: ProgressData): boolean {
  const outline = WEEKS.find((w) => w.number === week)
  return outline ? isPhaseUnlocked(outline.phase, data) : false
}

/** The highest phase she can open right now. */
export function currentUnlockedPhase(data: ProgressData): number {
  let phase = 1
  while (phase < 5 && isPhaseUnlocked(phase + 1, data)) phase += 1
  return phase
}

export type Pacing =
  | { state: 'ahead'; weeks: number }
  | { state: 'on-track' }
  | { state: 'little-behind' }
  | { state: 'behind'; weeks: number }

export function pacing(data: ProgressData, slots: Slot[], date: IsoDate): Pacing {
  const learning = currentLearningWeek(data)
  const scheduled = scheduledWeek(slots, date)
  const gap = scheduled - learning
  if (gap < 0) return { state: 'ahead', weeks: -gap }
  if (gap === 0) return { state: 'on-track' }
  if (gap === 1) return { state: 'little-behind' }
  return { state: 'behind', weeks: gap }
}

export function diaryCountBetween(data: ProgressData, start: IsoDate, end: IsoDate): number {
  return data.diary.filter((d) => d.date >= start && d.date <= end).length
}

export function dueReviewCount(data: ProgressData, date: IsoDate): number {
  return Object.values(data.review).filter((r) => r.due <= date).length
}

/** Next unfinished thing in a week, in the order she should do it. */
export type NextStep =
  | { kind: 'lesson'; week: number; slug: string; title: string; minutes: number }
  | { kind: 'assignment'; week: number; id: string; title: string; minutes: number }
  | { kind: 'quiz'; week: number; title: string; questions: number }
  | { kind: 'phase-review'; week: number; phase: number; title: string; questions: number }
  | { kind: 'done'; week: number }
  | { kind: 'not-written'; week: number }

export function nextSteps(week: number, data: ProgressData, limit = 3): NextStep[] {
  const content = getWeekContent(week)
  if (!content) return [{ kind: 'not-written', week }]
  const steps: NextStep[] = []
  for (const l of content.lessons) {
    if (!data.lessons[lessonKey(week, l.slug)]?.completedAt) {
      steps.push({ kind: 'lesson', week, slug: l.slug, title: l.title, minutes: l.minutes })
    }
  }
  for (const a of content.assignments) {
    if (assignmentStatus(a, data) !== 'done') {
      steps.push({ kind: 'assignment', week, id: a.id, title: a.title, minutes: a.minutes })
    }
  }
  if (!summariseAttempts(data.quizAttempts[content.quiz.id], content.quiz.questions.length).passed) {
    steps.push({ kind: 'quiz', week, title: 'Checkpoint quiz', questions: content.quiz.questions.length })
  }
  const review = phaseReviewForWeek(week)
  if (review && !summariseAttempts(data.quizAttempts[review.quiz.id], review.quiz.questions.length).passed) {
    steps.push({
      kind: 'phase-review',
      week,
      phase: review.phase,
      title: `Phase ${review.phase} review quiz`,
      questions: review.quiz.questions.length,
    })
  }
  return steps.length ? steps.slice(0, limit) : [{ kind: 'done', week }]
}

export function stepMinutes(step: NextStep): number | undefined {
  if (step.kind === 'lesson' || step.kind === 'assignment') return step.minutes
  if (step.kind === 'quiz' || step.kind === 'phase-review') return Math.max(5, Math.round(step.questions * 1.25))
  return undefined
}

export function stepHref(step: NextStep): string {
  switch (step.kind) {
    case 'lesson':
      return `/week/${step.week}/lesson/${step.slug}`
    case 'assignment':
      return `/week/${step.week}/assignment/${step.id}`
    case 'quiz':
      return `/week/${step.week}/quiz`
    case 'phase-review':
      return `/phase/${step.phase}/review`
    default:
      return `/week/${step.week}`
  }
}
