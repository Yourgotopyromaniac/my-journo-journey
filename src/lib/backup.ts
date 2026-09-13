import { z } from 'zod'
import { SCHEMA_VERSION, initialData, snapshot, type ProgressData } from '@/store/progress'

const APP_ID = 'my-journo-journey'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
const newsValue = z.enum(['timeliness', 'proximity', 'prominence', 'impact', 'conflict', 'human-interest', 'novelty'])

const progressSchema = z.object({
  onboarded: z.boolean(),
  startDate: isoDate,
  flexWeekTakenOn: isoDate.nullable(),
  theme: z.enum(['system', 'light', 'dark']),
  textSize: z.enum(['standard', 'large', 'larger']),
  lessons: z.record(
    z.string(),
    z.object({
      completedAt: z.string().optional(),
      lastSection: z.string().optional(),
      openedAt: z.string().optional(),
    }),
  ),
  objectives: z.record(z.string(), z.boolean()),
  assignments: z.record(
    z.string(),
    z.object({
      status: z.enum(['not-started', 'in-progress', 'done']),
      note: z.string(),
      link: z.string(),
      checklist: z.array(z.boolean()),
      updatedAt: z.string(),
    }),
  ),
  quizAttempts: z.record(
    z.string(),
    z.array(
      z.object({
        at: z.string(),
        correct: z.number().int().nonnegative(),
        total: z.number().int().positive(),
        passed: z.boolean(),
        wrongQuestionIds: z.array(z.string()),
      }),
    ),
  ),
  review: z.record(
    z.string(),
    z.object({ quizId: z.string(), questionId: z.string(), step: z.number().int(), due: isoDate }),
  ),
  journal: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
      week: z.number().int().optional(),
      prompt: z.string().optional(),
      body: z.string(),
    }),
  ),
  diary: z.array(
    z.object({
      id: z.string(),
      createdAt: z.string(),
      date: isoDate,
      headline: z.string(),
      outlet: z.string(),
      link: z.string(),
      why: z.string(),
      values: z.array(newsValue),
    }),
  ),
  lastLesson: z.object({ week: z.number().int(), slug: z.string() }).nullable(),
  lastBackupAt: z.string().nullable(),
})

const backupSchema = z.object({
  app: z.literal(APP_ID),
  schemaVersion: z.number().int().positive(),
  exportedAt: z.string(),
  data: z.unknown(),
})

export function createBackup(): { filename: string; json: string } {
  const exportedAt = new Date().toISOString()
  const payload = { app: APP_ID, schemaVersion: SCHEMA_VERSION, exportedAt, data: snapshot() }
  return {
    filename: `my-journo-journey-backup-${exportedAt.slice(0, 10)}.json`,
    json: JSON.stringify(payload, null, 2),
  }
}

export function downloadBackup(): void {
  const { filename, json } = createBackup()
  const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export type ParsedBackup =
  | { ok: true; data: ProgressData; exportedAt: string }
  | { ok: false; message: string }

export function parseBackup(text: string): ParsedBackup {
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    return { ok: false, message: 'This file is not a backup. It could not be read.' }
  }
  const envelope = backupSchema.safeParse(raw)
  if (!envelope.success) {
    return { ok: false, message: 'This file is not a My Journo Journey backup.' }
  }
  if (envelope.data.schemaVersion > SCHEMA_VERSION) {
    return { ok: false, message: 'This backup is from a newer version of the app. Update the app and try again.' }
  }
  const merged = { ...initialData(), ...(envelope.data.data as object) }
  const data = progressSchema.safeParse(merged)
  if (!data.success) {
    return { ok: false, message: 'This backup is damaged, so it was not loaded. Your current progress is safe.' }
  }
  return { ok: true, data: data.data, exportedAt: envelope.data.exportedAt }
}
