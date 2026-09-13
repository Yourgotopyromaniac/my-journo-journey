import { PROGRAMME } from '@/content/course'
import { addDays, daysBetween, type IsoDate } from './dates'

export type Slot =
  | { kind: 'week'; index: number; week: number; start: IsoDate; end: IsoDate }
  | { kind: 'flex'; index: number; flex: 'christmas' | 'floating'; start: IsoDate; end: IsoDate }

export interface ScheduleOptions {
  startDate?: IsoDate
  /** Monday of the week the learner chose for her floating flex week, if she has taken it. */
  flexWeekTakenOn?: IsoDate | null
}

/**
 * Lays out every calendar week of the programme.
 * The Christmas flex week is fixed to its date. The floating flex week sits at the end
 * unless it has been taken, in which case every later week moves back by one.
 */
export function buildSchedule({
  startDate = PROGRAMME.startDate,
  flexWeekTakenOn = null,
}: ScheduleOptions = {}): Slot[] {
  const slots: Slot[] = []
  let nextWeek = 1
  let floatingPlaced = false
  let index = 0

  while (nextWeek <= PROGRAMME.totalWeeks || !floatingPlaced) {
    const start = addDays(startDate, index * 7)
    const end = addDays(start, 6)

    if (start === PROGRAMME.christmasFlexStart) {
      slots.push({ kind: 'flex', index, flex: 'christmas', start, end })
    } else if (!floatingPlaced && (start === flexWeekTakenOn || nextWeek > PROGRAMME.totalWeeks)) {
      slots.push({ kind: 'flex', index, flex: 'floating', start, end })
      floatingPlaced = true
    } else {
      slots.push({ kind: 'week', index, week: nextWeek, start, end })
      nextWeek += 1
    }
    index += 1
  }

  return slots
}

export type ProgrammeStatus =
  | { state: 'not-started'; daysToGo: number; firstSlot: Slot }
  | { state: 'running'; slot: Slot }
  | { state: 'finished'; lastSlot: Slot }

export function programmeStatus(slots: Slot[], date: IsoDate): ProgrammeStatus {
  const first = slots[0]!
  const last = slots[slots.length - 1]!
  if (date < first.start) {
    return { state: 'not-started', daysToGo: daysBetween(date, first.start), firstSlot: first }
  }
  if (date > last.end) {
    return { state: 'finished', lastSlot: last }
  }
  const slot = slots.find((s) => date >= s.start && date <= s.end)!
  return { state: 'running', slot }
}

export function slotForWeek(slots: Slot[], week: number): Extract<Slot, { kind: 'week' }> | undefined {
  return slots.find((s): s is Extract<Slot, { kind: 'week' }> => s.kind === 'week' && s.week === week)
}

/**
 * The content week the calendar says the learner should be on.
 * During a flex week this is the next week to come.
 */
export function scheduledWeek(slots: Slot[], date: IsoDate): number {
  const status = programmeStatus(slots, date)
  if (status.state === 'not-started') return 1
  if (status.state === 'finished') return PROGRAMME.totalWeeks
  if (status.slot.kind === 'week') return status.slot.week
  const next = slots.slice(status.slot.index + 1).find((s) => s.kind === 'week')
  return next && next.kind === 'week' ? next.week : PROGRAMME.totalWeeks
}

export function canTakeFlexWeek(slots: Slot[], date: IsoDate, flexWeekTakenOn: IsoDate | null): boolean {
  if (flexWeekTakenOn) return false
  const status = programmeStatus(slots, date)
  return status.state === 'running' && status.slot.kind === 'week'
}

export function daysLeftInSlot(slot: Slot, date: IsoDate): number {
  return daysBetween(date, slot.end) + 1
}
