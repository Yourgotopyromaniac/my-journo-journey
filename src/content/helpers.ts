import type { Lesson } from './types'

/** Used by week files: pairs a lesson's details with a lazy loader for its MDX text. */
export function lesson(meta: Omit<Lesson, 'load'>, load: Lesson['load']): Lesson {
  return { ...meta, load }
}
