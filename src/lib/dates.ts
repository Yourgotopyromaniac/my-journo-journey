/**
 * Calendar dates are handled as "YYYY-MM-DD" strings and calculated in UTC,
 * so daylight saving and time zones never shift a day.
 */

export type IsoDate = string

const DAY_MS = 86_400_000

export function toUtc(date: IsoDate): number {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number]
  return Date.UTC(y, m - 1, d)
}

export function fromUtc(ms: number): IsoDate {
  return new Date(ms).toISOString().slice(0, 10)
}

export function addDays(date: IsoDate, days: number): IsoDate {
  return fromUtc(toUtc(date) + days * DAY_MS)
}

export function daysBetween(from: IsoDate, to: IsoDate): number {
  return Math.round((toUtc(to) - toUtc(from)) / DAY_MS)
}

// Development only: ?date=2026-09-30 pretends today is that date, to preview later weeks.
const devDate = import.meta.env.DEV ? new URLSearchParams(globalThis.location?.search ?? '').get('date') : null

/** Today's date on this device, in local time. */
export function today(now: Date = new Date()): IsoDate {
  if (devDate && /^\d{4}-\d{2}-\d{2}$/.test(devDate)) return devDate
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Fixed short month names: some browsers print "Sept", others "Sep".
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const dayMonth = {
  format: (ms: number) => {
    const d = new Date(ms)
    return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`
  },
}
const dayMonthYear = {
  format: (ms: number) => `${dayMonth.format(ms)} ${new Date(ms).getUTCFullYear()}`,
}
const longDate = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  timeZone: 'UTC',
})
const dayName = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' })

/** "21 Sep" */
export function formatDay(date: IsoDate): string {
  return dayMonth.format(toUtc(date))
}

/** "21 Sep 2026" */
export function formatDayYear(date: IsoDate): string {
  return dayMonthYear.format(toUtc(date))
}

/** "Wednesday 30 September" */
export function formatLong(date: IsoDate): string {
  return longDate.format(toUtc(date)).replace(',', '')
}

/** "Monday" */
export function formatDayName(date: IsoDate): string {
  return dayName.format(toUtc(date))
}

/** "21–27 Sep" or "28 Sep–4 Oct" */
export function formatRange(start: IsoDate, end: IsoDate): string {
  const s = new Date(toUtc(start))
  const e = new Date(toUtc(end))
  if (s.getUTCMonth() === e.getUTCMonth()) {
    return `${s.getUTCDate()}–${formatDay(end)}`
  }
  return `${formatDay(start)}–${formatDay(end)}`
}

/** "28 Sep to 4 Oct", for sentences. */
export function formatRangeWords(start: IsoDate, end: IsoDate): string {
  return `${formatDay(start)} to ${formatDay(end)}`
}

/** Friendly time of day greeting. */
export function greeting(now: Date = new Date()): string {
  const h = now.getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
