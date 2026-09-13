import { useEffect, useMemo, useState } from 'react'
import { PROGRAMME } from '@/content/course'
import { snapshot, useProgress, type ProgressData } from '@/store/progress'
import { today, type IsoDate } from './dates'
import { buildSchedule, type Slot } from './schedule'

/** Today's date, refreshed when the app comes back into view (tablets stay open for days). */
export function useToday(): IsoDate {
  const [date, setDate] = useState(today)
  useEffect(() => {
    const refresh = () => setDate(today())
    document.addEventListener('visibilitychange', refresh)
    const timer = window.setInterval(refresh, 60_000)
    return () => {
      document.removeEventListener('visibilitychange', refresh)
      window.clearInterval(timer)
    }
  }, [])
  return date
}

export function useSchedule(): Slot[] {
  // The start date always comes from course.ts. The copy saved on the device is ignored,
  // so changing the start date there takes effect for everyone.
  const flexWeekTakenOn = useProgress((s) => s.flexWeekTakenOn)
  return useMemo(() => buildSchedule({ startDate: PROGRAMME.startDate, flexWeekTakenOn }), [flexWeekTakenOn])
}

/** All saved data as a plain object. Re-renders when any of it changes. */
export function useProgressData(): ProgressData {
  // Subscribing to the whole store is fine: the data is small and changes on user actions only.
  useProgress()
  return snapshot()
}

export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · My Journo Journey` : 'My Journo Journey'
  }, [title])
}

export function useOnline(): boolean {
  const [online, setOnline] = useState(() => navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}
