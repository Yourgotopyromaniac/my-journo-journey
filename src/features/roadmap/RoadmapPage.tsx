import { ChevronDown, Flag } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { Page } from '@/app/AppLayout'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui/dialog'
import { ProgressBar } from '@/components/ui/progress-bar'
import { StatusIcon } from '@/components/ui/status-icon'
import { getPhase, PHASES, PROGRAMME } from '@/content/course'
import { cn } from '@/lib/cn'
import { formatDay, formatDayYear, formatRange } from '@/lib/dates'
import { useDocumentTitle, useProgressData, useSchedule, useToday } from '@/lib/hooks'
import { currentLearningWeek, weekProgress } from '@/lib/progress'
import { canTakeFlexWeek, programmeStatus, type Slot } from '@/lib/schedule'
import { WEEKS } from '@/content/course'
import { useProgress } from '@/store/progress'

type PhaseGroup = { phase: number; slots: Slot[] }

function groupByPhase(slots: Slot[]): PhaseGroup[] {
  const groups: PhaseGroup[] = PHASES.map((p) => ({ phase: p.number, slots: [] }))
  let lastPhase = 1
  for (const slot of slots) {
    if (slot.kind === 'week') {
      lastPhase = WEEKS.find((w) => w.number === slot.week)!.phase
    }
    // A flex week belongs to the phase of the week before it.
    groups[lastPhase - 1]!.slots.push(slot)
  }
  return groups
}

export default function RoadmapPage() {
  useDocumentTitle('Roadmap')
  const data = useProgressData()
  const slots = useSchedule()
  const date = useToday()
  const status = programmeStatus(slots, date)
  const learningWeek = currentLearningWeek(data)
  const currentPhase = WEEKS.find((w) => w.number === learningWeek)!.phase
  const groups = groupByPhase(slots)
  const completedWeeks = WEEKS.filter((w) => weekProgress(w.number, data).complete).length

  const [open, setOpen] = useState<Set<number>>(() => new Set([currentPhase, Math.min(currentPhase + 1, PHASES.length)]))
  const toggle = (phase: number) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(phase)) next.delete(phase)
      else next.add(phase)
      return next
    })

  const first = slots[0]!
  const last = slots[slots.length - 1]!

  return (
    <Page>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2.25rem] leading-tight font-semibold">Roadmap</h1>
          <p className="mt-1 text-[0.9375rem] text-ink-2">
            {PROGRAMME.totalWeeks} weeks of learning and 2 flex weeks · {formatDayYear(first.start)} to{' '}
            {formatDayYear(last.end)}
          </p>
        </div>
        <FlexWeekControl />
      </div>

      <div className="mt-5 max-w-md">
        <div className="flex justify-between text-[0.8125rem] text-ink-2">
          <span>
            {completedWeeks} of {PROGRAMME.totalWeeks} weeks complete
          </span>
        </div>
        <ProgressBar value={completedWeeks / PROGRAMME.totalWeeks} label="Course progress" className="mt-2" />
      </div>

      <Box className="mt-6 overflow-hidden">
        {groups.map((group, gi) => {
          const phase = getPhase(group.phase)!
          const isOpen = open.has(group.phase)
          const weekSlots = group.slots.filter((s) => s.kind === 'week')
          const hasFlex = group.slots.some((s) => s.kind === 'flex')
          const start = group.slots[0]
          const end = group.slots[group.slots.length - 1]
          const panelId = `phase-${group.phase}`
          let lastTrack: string | undefined

          return (
            <section key={group.phase} className={cn(gi > 0 && 'border-t border-rule-soft')}>
              <h2>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(group.phase)}
                  className="grid min-h-13 w-full grid-cols-[1.25rem_1fr_auto] items-center gap-3 bg-sunken/50 px-4 py-2 text-left hover:bg-sunken"
                >
                  <ChevronDown
                    className={cn('size-4 transition-transform', !isOpen && '-rotate-90')}
                    aria-hidden
                    strokeWidth={1.8}
                  />
                  <span className="font-semibold">
                    Phase {phase.number} · {phase.title}
                    <span className="font-normal text-ink-3">
                      {' '}
                      · {weekSlots.length} weeks{hasFlex ? ' and a flex week' : ''}
                    </span>
                  </span>
                  {start && end ? (
                    <span className="hidden text-[0.8125rem] text-ink-3 sm:block">
                      {formatDay(start.start)} to {formatDay(end.end)}
                    </span>
                  ) : null}
                </button>
              </h2>
              {isOpen ? (
                <ul id={panelId}>
                  {group.slots.map((slot) => {
                    if (slot.kind === 'flex') {
                      const isNow = status.state === 'running' && status.slot.index === slot.index
                      return (
                        <li
                          key={`flex-${slot.index}`}
                          className={cn(
                            'grid min-h-12 grid-cols-[1.25rem_4rem_1fr_auto] items-center gap-3 border-t border-rule-soft px-4 text-ink-2',
                            isNow && 'bg-accent-soft/40',
                          )}
                        >
                          <Flag className="size-4" aria-hidden strokeWidth={1.8} />
                          <span className="text-[0.8125rem] text-ink-3">Flex</span>
                          <span className="font-serif italic">
                            {slot.flex === 'christmas' ? 'Flex week (Christmas)' : 'Flex week'}
                          </span>
                          <span className="text-[0.8125rem] text-ink-3">{formatRange(slot.start, slot.end)}</span>
                        </li>
                      )
                    }
                    const outline = WEEKS.find((w) => w.number === slot.week)!
                    const p = weekProgress(slot.week, data)
                    const isCurrent = slot.week === learningWeek
                    const showTrack = outline.track && outline.track !== lastTrack
                    lastTrack = outline.track
                    return (
                      <li key={slot.week}>
                        {showTrack ? (
                          <div className="kicker border-t border-rule-soft px-4 pt-3 pb-1 text-ink-3">{outline.track}</div>
                        ) : null}
                        <Link
                          to={`/week/${slot.week}`}
                          className={cn(
                            'grid min-h-12 grid-cols-[1.25rem_1fr_auto] items-center gap-3 border-t border-rule-soft px-4 py-2 hover:bg-sunken/60 sm:grid-cols-[1.25rem_4rem_1fr_7rem_6rem]',
                            showTrack && 'border-t-0',
                            isCurrent && 'bg-accent-soft/40',
                          )}
                        >
                          <StatusIcon status={p.complete ? 'done' : p.started || isCurrent ? 'current' : 'todo'} />
                          <span className="hidden text-[0.8125rem] text-ink-3 sm:block">Week {slot.week}</span>
                          <span className={cn('min-w-0', isCurrent && 'font-medium')}>
                            <span className="sm:hidden">{slot.week}. </span>
                            {outline.title}
                          </span>
                          <span className="hidden text-[0.8125rem] text-ink-3 sm:block">
                            {formatRange(slot.start, slot.end)}
                          </span>
                          <span className="text-right text-xs">
                            {p.complete ? (
                              <span className="text-ink-3">Done</span>
                            ) : isCurrent ? (
                              <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-on-accent">You are here</span>
                            ) : null}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </section>
          )
        })}
      </Box>

      <p className="mt-4 flex items-start gap-2 text-[0.8125rem] text-ink-3">
        <Flag className="mt-0.5 size-4 shrink-0" aria-hidden strokeWidth={1.8} />
        You have two flex weeks. The first is set for Christmas. You can take the second one at any time, and the weeks after it
        move back by one.
      </p>
    </Page>
  )
}

function FlexWeekControl() {
  const slots = useSchedule()
  const date = useToday()
  const flexWeekTakenOn = useProgress((s) => s.flexWeekTakenOn)
  const takeFlexWeek = useProgress((s) => s.takeFlexWeek)
  const undoFlexWeek = useProgress((s) => s.undoFlexWeek)
  const [confirm, setConfirm] = useState<'take' | 'undo' | null>(null)
  const status = programmeStatus(slots, date)

  const canTake = canTakeFlexWeek(slots, date, flexWeekTakenOn)
  // She can undo the flex week while it is still this week or in the future.
  const canUndo = flexWeekTakenOn !== null && status.state === 'running' && flexWeekTakenOn >= status.slot.start

  if (!canTake && !canUndo) return null

  return (
    <>
      <Button variant="secondary" onClick={() => setConfirm(canUndo ? 'undo' : 'take')}>
        <Flag /> {canUndo ? 'Cancel flex week' : 'Take a flex week'}
      </Button>
      <ConfirmDialog
        open={confirm === 'take'}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Take your flex week now?"
        description={
          <>
            <p>This week becomes a week off. Every week after it moves back by one week.</p>
            <p className="mt-2">You only have one flex week you can move, so use it when you need it.</p>
          </>
        }
        confirmLabel="Take flex week"
        onConfirm={() => {
          if (status.state === 'running') takeFlexWeek(status.slot.start)
          setConfirm(null)
        }}
      />
      <ConfirmDialog
        open={confirm === 'undo'}
        onOpenChange={(o) => !o && setConfirm(null)}
        title="Cancel your flex week?"
        description="Your weeks move back to their earlier dates, and the flex week returns to the end of the course."
        confirmLabel="Cancel flex week"
        cancelLabel="Keep it"
        onConfirm={() => {
          undoFlexWeek()
          setConfirm(null)
        }}
      />
    </>
  )
}
