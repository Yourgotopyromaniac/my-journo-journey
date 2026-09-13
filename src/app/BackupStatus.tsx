import { Link } from 'react-router'
import { daysBetween, today } from '@/lib/dates'
import { useProgress } from '@/store/progress'

/** Small reminder in the sidebar. Backups matter because progress only lives on this device. */
export function BackupStatus() {
  const lastBackupAt = useProgress((s) => s.lastBackupAt)
  const hasProgress = useProgress((s) => Object.keys(s.lessons).length > 0 || s.journal.length > 0 || s.diary.length > 0)

  if (!hasProgress) return null

  const days = lastBackupAt ? daysBetween(lastBackupAt.slice(0, 10), today()) : null
  const stale = days === null || days >= 7
  const text =
    days === null ? 'Not backed up yet' : days === 0 ? 'Backed up today' : `Backed up ${days} day${days === 1 ? '' : 's'} ago`

  return (
    <Link to="/settings#backup" className="flex min-h-9 items-center gap-2 rounded-md px-2.5 text-xs text-ink-3 hover:text-ink">
      <span className={stale ? 'size-1.5 rounded-full bg-warning' : 'size-1.5 rounded-full bg-success'} aria-hidden />
      {text}
    </Link>
  )
}
