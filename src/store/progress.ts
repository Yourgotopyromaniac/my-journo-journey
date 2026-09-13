import { del, get, set } from 'idb-keyval'
import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { NewsValue } from '@/content/types'
import { addDays, today, type IsoDate } from '@/lib/dates'

export const STORE_KEY = 'mjj-progress'
export const SCHEMA_VERSION = 1

export type Theme = 'system' | 'light' | 'dark'
export type TextSize = 'standard' | 'large' | 'larger'
export type AssignmentStatus = 'not-started' | 'in-progress' | 'done'

export interface LessonProgress {
  completedAt?: string
  /** Last section heading id she read, used to resume. */
  lastSection?: string
  openedAt?: string
}

export interface AssignmentProgress {
  status: AssignmentStatus
  note: string
  link: string
  checklist: boolean[]
  updatedAt: string
}

export interface QuizAttempt {
  at: string
  correct: number
  total: number
  passed: boolean
  wrongQuestionIds: string[]
}

export interface ReviewItem {
  quizId: string
  questionId: string
  /** 0, 1 or 2: how many times it has been answered correctly in review. */
  step: number
  due: IsoDate
}

export interface JournalEntry {
  id: string
  createdAt: string
  updatedAt: string
  week?: number
  prompt?: string
  body: string
}

export interface DiaryEntry {
  id: string
  createdAt: string
  date: IsoDate
  headline: string
  outlet: string
  link: string
  why: string
  values: NewsValue[]
}

export interface ProgressData {
  onboarded: boolean
  startDate: IsoDate
  flexWeekTakenOn: IsoDate | null
  theme: Theme
  textSize: TextSize
  lessons: Record<string, LessonProgress>
  objectives: Record<string, boolean>
  assignments: Record<string, AssignmentProgress>
  quizAttempts: Record<string, QuizAttempt[]>
  review: Record<string, ReviewItem>
  journal: JournalEntry[]
  diary: DiaryEntry[]
  lastLesson: { week: number; slug: string } | null
  lastBackupAt: string | null
  /** Phases whose "complete" card she has closed on the dashboard. */
  dismissedMilestones: number[]
}

interface ProgressActions {
  completeOnboarding: () => void
  setTheme: (theme: Theme) => void
  setTextSize: (size: TextSize) => void
  takeFlexWeek: (monday: IsoDate) => void
  undoFlexWeek: () => void

  openLesson: (week: number, slug: string) => void
  setLessonSection: (week: number, slug: string, sectionId: string) => void
  setLessonComplete: (week: number, slug: string, complete: boolean) => void
  toggleObjective: (id: string) => void

  updateAssignment: (id: string, patch: Partial<Omit<AssignmentProgress, 'updatedAt'>>) => void

  recordQuizAttempt: (quizId: string, attempt: Omit<QuizAttempt, 'at'>) => void
  answerReview: (quizId: string, questionId: string, correct: boolean) => void

  saveJournalEntry: (entry: Partial<JournalEntry> & { body: string }) => string
  deleteJournalEntry: (id: string) => void

  saveDiaryEntry: (entry: Omit<DiaryEntry, 'id' | 'createdAt'> & { id?: string }) => void
  deleteDiaryEntry: (id: string) => void

  dismissMilestone: (phase: number) => void
  markBackedUp: () => void
  replaceAll: (data: ProgressData) => void
  resetAll: () => void
}

export type ProgressState = ProgressData & ProgressActions

export const initialData = (): ProgressData => ({
  onboarded: false,
  startDate: '2026-09-21',
  flexWeekTakenOn: null,
  theme: 'system',
  textSize: 'standard',
  lessons: {},
  objectives: {},
  assignments: {},
  quizAttempts: {},
  review: {},
  journal: [],
  diary: [],
  lastLesson: null,
  lastBackupAt: null,
  dismissedMilestones: [],
})

export const lessonKey = (week: number, slug: string) => `w${week}/${slug}`
export const reviewKey = (quizId: string, questionId: string) => `${quizId}/${questionId}`

/** Days until a missed question comes back, for each review step. */
export const REVIEW_INTERVALS = [2, 7, 21]

const idbStorage: StateStorage = {
  getItem: async (name) => (await get<string>(name)) ?? null,
  setItem: (name, value) => set(name, value),
  removeItem: (name) => del(name),
}

const now = () => new Date().toISOString()

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Theme and text size are mirrored to localStorage so index.html can apply them before first paint. */
function mirrorDisplayPrefs(theme: Theme, textSize: TextSize) {
  try {
    localStorage.setItem('mjj-theme', theme)
    localStorage.setItem('mjj-text-size', textSize)
  } catch {
    // Storage can be unavailable in private windows. The app still works.
  }
}

export const useProgress = create<ProgressState>()(
  persist(
    (setState, getState) => ({
      ...initialData(),

      completeOnboarding: () => setState({ onboarded: true }),

      setTheme: (theme) => {
        mirrorDisplayPrefs(theme, getState().textSize)
        setState({ theme })
      },

      setTextSize: (textSize) => {
        mirrorDisplayPrefs(getState().theme, textSize)
        setState({ textSize })
      },

      takeFlexWeek: (monday) => setState({ flexWeekTakenOn: monday }),
      undoFlexWeek: () => setState({ flexWeekTakenOn: null }),

      openLesson: (week, slug) =>
        setState((s) => {
          const key = lessonKey(week, slug)
          return {
            lastLesson: { week, slug },
            lessons: { ...s.lessons, [key]: { ...s.lessons[key], openedAt: s.lessons[key]?.openedAt ?? now() } },
          }
        }),

      setLessonSection: (week, slug, sectionId) =>
        setState((s) => {
          const key = lessonKey(week, slug)
          if (s.lessons[key]?.lastSection === sectionId) return s
          return { lessons: { ...s.lessons, [key]: { ...s.lessons[key], lastSection: sectionId } } }
        }),

      setLessonComplete: (week, slug, complete) =>
        setState((s) => {
          const key = lessonKey(week, slug)
          return {
            lessons: {
              ...s.lessons,
              [key]: { ...s.lessons[key], completedAt: complete ? now() : undefined },
            },
          }
        }),

      toggleObjective: (id) => setState((s) => ({ objectives: { ...s.objectives, [id]: !s.objectives[id] } })),

      updateAssignment: (id, patch) =>
        setState((s) => {
          const current = s.assignments[id] ?? { status: 'not-started', note: '', link: '', checklist: [] }
          const next = { ...current, ...patch, updatedAt: now() }
          if (next.status === 'not-started' && (next.note || next.link || next.checklist.some(Boolean))) {
            next.status = 'in-progress'
          }
          return { assignments: { ...s.assignments, [id]: next } }
        }),

      recordQuizAttempt: (quizId, attempt) =>
        setState((s) => {
          const review = { ...s.review }
          const due = addDays(today(), REVIEW_INTERVALS[0]!)
          for (const questionId of attempt.wrongQuestionIds) {
            review[reviewKey(quizId, questionId)] = { quizId, questionId, step: 0, due }
          }
          return {
            quizAttempts: { ...s.quizAttempts, [quizId]: [...(s.quizAttempts[quizId] ?? []), { ...attempt, at: now() }] },
            review,
          }
        }),

      answerReview: (quizId, questionId, correct) =>
        setState((s) => {
          const key = reviewKey(quizId, questionId)
          const item = s.review[key]
          if (!item) return s
          const review = { ...s.review }
          if (!correct) {
            review[key] = { ...item, step: 0, due: addDays(today(), REVIEW_INTERVALS[0]!) }
          } else if (item.step + 1 >= REVIEW_INTERVALS.length) {
            delete review[key]
          } else {
            const step = item.step + 1
            review[key] = { ...item, step, due: addDays(today(), REVIEW_INTERVALS[step]!) }
          }
          return { review }
        }),

      saveJournalEntry: (entry) => {
        const id = entry.id ?? newId()
        setState((s) => {
          const existing = s.journal.find((j) => j.id === id)
          const stamp = now()
          const saved: JournalEntry = existing
            ? { ...existing, ...entry, id, updatedAt: stamp }
            : { createdAt: stamp, ...entry, id, updatedAt: stamp }
          return {
            journal: existing ? s.journal.map((j) => (j.id === id ? saved : j)) : [saved, ...s.journal],
          }
        })
        return id
      },

      deleteJournalEntry: (id) => setState((s) => ({ journal: s.journal.filter((j) => j.id !== id) })),

      saveDiaryEntry: (entry) =>
        setState((s) => {
          if (entry.id && s.diary.some((d) => d.id === entry.id)) {
            return { diary: s.diary.map((d) => (d.id === entry.id ? { ...d, ...entry, id: d.id } : d)) }
          }
          const created: DiaryEntry = { ...entry, id: newId(), createdAt: now() }
          return { diary: [created, ...s.diary] }
        }),

      deleteDiaryEntry: (id) => setState((s) => ({ diary: s.diary.filter((d) => d.id !== id) })),

      dismissMilestone: (phase) =>
        setState((s) => ({ dismissedMilestones: [...new Set([...s.dismissedMilestones, phase])] })),

      markBackedUp: () => setState({ lastBackupAt: now() }),

      replaceAll: (data) => {
        mirrorDisplayPrefs(data.theme, data.textSize)
        setState({ ...data })
      },

      resetAll: () => {
        mirrorDisplayPrefs('system', 'standard')
        setState({ ...initialData(), onboarded: true })
      },
    }),
    {
      name: STORE_KEY,
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => idbStorage),
      partialize: (state): ProgressData => {
        const data: Partial<ProgressState> = { ...state }
        for (const key of Object.keys(data) as (keyof ProgressState)[]) {
          if (typeof data[key] === 'function') delete data[key]
        }
        return data as ProgressData
      },
      // Future schema changes add migration steps here, keyed by the stored version.
      migrate: (persisted) => ({ ...initialData(), ...(persisted as Partial<ProgressData>) }),
      merge: (persisted, current) => ({ ...current, ...initialData(), ...(persisted as Partial<ProgressData>) }),
    },
  ),
)

/** Resolves once saved progress has loaded from IndexedDB. */
export function whenHydrated(): Promise<void> {
  if (useProgress.persist.hasHydrated()) return Promise.resolve()
  return new Promise((resolve) => {
    const unsub = useProgress.persist.onFinishHydration(() => {
      unsub()
      resolve()
    })
  })
}

/** Plain data snapshot, for backups. */
export function snapshot(): ProgressData {
  const state = useProgress.getState()
  const data: Partial<ProgressState> = { ...state }
  for (const key of Object.keys(data) as (keyof ProgressState)[]) {
    if (typeof data[key] === 'function') delete data[key]
  }
  return data as ProgressData
}
