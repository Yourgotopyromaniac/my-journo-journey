import type { MDXContent } from 'mdx/types'

export type NewsValue =
  | 'timeliness'
  | 'proximity'
  | 'prominence'
  | 'impact'
  | 'conflict'
  | 'human-interest'
  | 'novelty'

export interface Phase {
  number: number
  title: string
  /** Short name for tight spaces such as roadmap headers. */
  shortTitle: string
  summary: string
}

/** Outline entry for every week, written or not. */
export interface WeekOutline {
  number: number
  phase: number
  title: string
  summary: string
  /** Optional sub-group label inside a phase, e.g. "Politics". */
  track?: string
}

export interface Source {
  title: string
  publisher: string
  url: string
  /** ISO date the link was last checked. */
  checked: string
}

export interface Resource extends Source {
  kind: 'article' | 'course' | 'video' | 'guide' | 'tool' | 'podcast'
  minutes?: number
  note: string
}

export interface Lesson {
  slug: string
  title: string
  summary: string
  minutes: number
  /** Loaded on demand so each lesson is its own small chunk. */
  load: () => Promise<{ default: MDXContent }>
  sources: Source[]
}

export interface Assignment {
  id: string
  title: string
  minutes: number
  /** What to do, in one or two short paragraphs. */
  brief: string
  steps: string[]
  /** Practice material to work from, such as fact sets or jumbled paragraphs. */
  materials?: { title: string; note?: string; items: string[]; ordered?: boolean }[]
  deliverable: string
  checklist: string[]
  /** Marks the assignment done automatically once she has this many news diary entries. */
  doneWhenDiaryEntries?: number
}

interface QuestionBase {
  id: string
  prompt: string
  /** Optional text to judge, such as a headline or a short story extract. */
  context?: string
  explanation: string
  /** Lesson to point back to after answering. */
  lessonSlug?: string
  /** Week of that lesson, when it differs from the quiz's own week (phase reviews). */
  lessonWeek?: number
}

export interface SingleChoiceQuestion extends QuestionBase {
  type: 'single'
  options: { id: string; text: string }[]
  answer: string
}

export interface MultiChoiceQuestion extends QuestionBase {
  type: 'multi'
  options: { id: string; text: string }[]
  answer: string[]
}

export interface TrueFalseQuestion extends QuestionBase {
  type: 'truefalse'
  answer: boolean
}

export interface OrderQuestion extends QuestionBase {
  type: 'order'
  /** Items listed in the correct order. They are shuffled when shown. */
  items: { id: string; text: string }[]
}

export type Question = SingleChoiceQuestion | MultiChoiceQuestion | TrueFalseQuestion | OrderQuestion

export interface Quiz {
  id: string
  title: string
  questions: Question[]
}

export interface WeekContent {
  number: number
  overview: string
  objectives: string[]
  lessons: Lesson[]
  assignments: Assignment[]
  quiz: Quiz
  journalPrompt: string
  resources: Resource[]
}

/** Longer quiz covering a whole phase. It sits in the last week of the phase. */
export interface PhaseReview {
  phase: number
  quiz: Quiz
}

export interface ToolkitChecklist {
  id: string
  title: string
  summary: string
  /** Week that teaches it. Shown from that week on. */
  week: number
  groups: { heading?: string; items: string[] }[]
  sources: Source[]
}

export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  also?: string
}
