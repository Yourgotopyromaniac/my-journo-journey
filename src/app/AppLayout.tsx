import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router'
import { ProgressBar } from '@/components/ui/progress-bar'
import { getWeekOutline } from '@/content/course'
import { cn } from '@/lib/cn'
import { formatLong } from '@/lib/dates'
import { useProgressData, useSchedule, useToday } from '@/lib/hooks'
import { currentLearningWeek, weekProgress } from '@/lib/progress'
import { programmeStatus } from '@/lib/schedule'
import { NAV_ITEMS, SETTINGS_ITEM, type NavItem } from './nav'
import { BackupStatus } from './BackupStatus'

function Brand() {
  return (
    <div className="flex items-center gap-2.5 px-2.5 pt-1.5 pb-5">
      <div className="flex size-7 items-center justify-center rounded-md bg-ink font-serif text-[0.8125rem] font-bold text-paper">
        MJ
      </div>
      <div className="font-serif text-[1.0625rem] leading-tight font-semibold">My Journo Journey</div>
    </div>
  )
}

function SidebarLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'flex min-h-11 items-center gap-2.5 rounded-md px-2.5 text-[0.9375rem] font-medium transition-colors',
          isActive
            ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]'
            : 'text-ink-2 hover:bg-surface/60 hover:text-ink',
        )
      }
    >
      <Icon className="size-[1.125rem]" strokeWidth={1.7} aria-hidden />
      {item.label}
    </NavLink>
  )
}

function RailLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      className={({ isActive }) =>
        cn(
          'flex min-h-14 w-16 flex-col items-center justify-center gap-1 rounded-md text-[0.6875rem] font-medium transition-colors',
          isActive ? 'bg-surface text-ink shadow-[0_1px_2px_rgba(0,0,0,0.06)]' : 'text-ink-2 hover:text-ink',
        )
      }
    >
      <Icon className="size-5" strokeWidth={1.7} aria-hidden />
      {item.short}
    </NavLink>
  )
}

function ThisWeek() {
  const data = useProgressData()
  const slots = useSchedule()
  const date = useToday()
  const status = programmeStatus(slots, date)

  if (status.state === 'not-started') {
    return (
      <div className="mx-2.5">
        <div className="text-xs font-medium text-ink-3">Starts</div>
        <div className="mt-1 text-[0.8125rem] font-medium">{formatLong(status.firstSlot.start)}</div>
      </div>
    )
  }

  const week = currentLearningWeek(data)
  const outline = getWeekOutline(week)
  const progress = weekProgress(week, data)
  return (
    <NavLink to={`/week/${week}`} className="mx-1 block rounded-md px-1.5 py-1.5 hover:bg-surface/60">
      <div className="text-xs font-medium text-ink-3">This week</div>
      <div className="mt-1 text-[0.8125rem] font-medium text-ink">
        Week {week} · {outline?.title}
      </div>
      <ProgressBar value={progress.fraction} label={`Week ${week} progress`} className="mt-2" />
    </NavLink>
  )
}

export function AppLayout() {
  return (
    <div className="min-h-dvh md:flex">
      {/* Tablet landscape and desktop: full sidebar */}
      <aside className="sticky top-0 hidden h-dvh w-62 shrink-0 flex-col border-r border-rule-soft bg-sunken px-3 py-4 lg:flex">
        <Brand />
        <nav aria-label="Main" className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <SidebarLink key={item.to} item={item} />
          ))}
        </nav>
        <div className="mt-6">
          <ThisWeek />
        </div>
        <div className="mt-auto flex flex-col gap-1">
          <BackupStatus />
          <SidebarLink item={SETTINGS_ITEM} />
        </div>
      </aside>

      {/* Tablet portrait: compact rail */}
      <aside className="sticky top-0 hidden h-dvh w-20 shrink-0 flex-col items-center border-r border-rule-soft bg-sunken py-4 md:flex lg:hidden">
        <div className="mb-5 flex size-9 items-center justify-center rounded-md bg-ink font-serif text-sm font-bold text-paper">
          MJ
        </div>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <RailLink key={item.to} item={item} />
          ))}
        </nav>
        <div className="mt-auto">
          <RailLink item={SETTINGS_ITEM} />
        </div>
      </aside>

      <main id="main" className="min-w-0 flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>

      {/* Phone: bottom bar */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-rule-soft bg-sunken/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {[...NAV_ITEMS, SETTINGS_ITEM].map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.625rem] font-medium',
                  isActive ? 'text-accent' : 'text-ink-2',
                )
              }
            >
              <Icon className="size-5" strokeWidth={1.7} aria-hidden />
              {item.short}
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}

/** Standard page wrapper inside the app layout. */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mx-auto w-full max-w-5xl px-5 py-7 sm:px-8 lg:px-12 lg:py-9', className)}>{children}</div>
}
