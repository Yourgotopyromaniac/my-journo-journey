import { PROGRAMME, WEEKS } from '@/content/course'
import { getWeekContent } from '@/content'
import type { WeekContent } from '@/content/types'
import { lessonKey, type ProgressData } from '@/store/progress'
import { summariseAttempts, type QuizSummary } from './quiz'
import { scheduledWeek, slotForWeek, type Slot } from './schedule'
import type { IsoDate } from './dates'

export interface WeekProgress {
  week: number
  written: boolean
  lessonsDone: number
  lessonsTotal: number
  assignmentsDone: number
  assignmentsTotal: number
  quiz: QuizSummary
  complete: boolean
  started: boolean
  /** 0 to 1, lessons + assignments + quiz, each item counting once. */
  fraction: number
}

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
      quiz: { taken: false, passed: false, attempts: 0, bestCorrect: 0, total: 0 },
      complete: false,
      started: false,
      fraction: 0,
    }
  }
  return progressFor(content, data)
}

function progressFor(content: WeekContent, data: ProgressData): WeekProgress {
  const lessonsDone = content.lessons.filter((l) => data.lessons[lessonKey(content.number, l.slug)]?.completedAt).length
  const assignmentsDone = content.assignments.filter((a) => data.assignments[a.id]?.status === 'done').length
  const quiz = summariseAttempts(data.quizAttempts[content.quiz.id], content.quiz.questions.length)
  const totalItems = content.lessons.length + content.assignments.length + 1
  const doneItems = lessonsDone + assignmentsDone + (quiz.passed ? 1 : 0)
  const started =
    doneItems > 0 ||
    content.lessons.some((l) => data.lessons[lessonKey(content.number, l.slug)]?.openedAt) ||
    content.assignments.some((a) => (data.assignments[a.id]?.status ?? 'not-started') !== 'not-started') ||
    quiz.taken
  return {
    week: content.number,
    written: true,
    lessonsDone,
    lessonsTotal: content.lessons.length,
    assignmentsDone,
    assignmentsTotal: content.assignments.length,
    quiz,
    complete: doneItems === totalItems,
    started,
    fraction: doneItems / totalItems,
  }
}

/** The first week that is not complete. */
export function currentLearningWeek(data: ProgressData): number {
  for (const w of WEEKS) {
    if (!weekProgress(w.number, data).complete) return w.number
  }
  return PROGRAMME.totalWeeks
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

export function diaryCountInWeek(data: ProgressData, slots: Slot[], week: number): number {
  const slot = slotForWeek(slots, week)
  if (!slot) return 0
  return data.diary.filter((d) => d.date >= slot.start && d.date <= slot.end).length
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
    if (data.assignments[a.id]?.status !== 'done') {
      steps.push({ kind: 'assignment', week, id: a.id, title: a.title, minutes: a.minutes })
    }
  }
  if (!summariseAttempts(data.quizAttempts[content.quiz.id], content.quiz.questions.length).passed) {
    steps.push({ kind: 'quiz', week, title: 'Checkpoint quiz', questions: content.quiz.questions.length })
  }
  return steps.length ? steps.slice(0, limit) : [{ kind: 'done', week }]
}

export function stepMinutes(step: NextStep): number | undefined {
  if (step.kind === 'lesson' || step.kind === 'assignment') return step.minutes
  if (step.kind === 'quiz') return Math.max(5, Math.round(step.questions * 1.25))
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
    default:
      return `/week/${step.week}`
  }
}
