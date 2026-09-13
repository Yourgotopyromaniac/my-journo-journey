import { ArrowRight, ChevronRight, Plus } from 'lucide-react'
import { Link } from 'react-router'
import { Page } from '@/app/AppLayout'
import { Box, SectionHeading } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { ProgressBar } from '@/components/ui/progress-bar'
import { getLesson, isWeekWritten } from '@/content'
import { getPhase, getWeekOutline, PROGRAMME } from '@/content/course'
import { addDays, formatLong, formatRangeWords, greeting } from '@/lib/dates'
import { useDocumentTitle, useProgressData, useSchedule, useToday } from '@/lib/hooks'
import {
  currentLearningWeek,
  diaryCountBetween,
  dueReviewCount,
  nextSteps,
  pacing,
  stepHref,
  stepMinutes,
  weekProgress,
  type NextStep,
} from '@/lib/progress'
import { canTakeFlexWeek, daysLeftInSlot, programmeStatus, slotForWeek } from '@/lib/schedule'
import { lessonKey } from '@/store/progress'
import { WeekChecklist } from '../week/WeekChecklist'
import { PacingDot, pacingText } from './PacingNote'

function stepLabel(step: NextStep): string {
  switch (step.kind) {
    case 'lesson':
      return 'Lesson'
    case 'assignment':
      return 'Assignment'
    case 'quiz':
      return 'Quiz'
    default:
      return ''
  }
}

export default function DashboardPage() {
  useDocumentTitle('Today')
  const data = useProgressData()
  const slots = useSchedule()
  const date = useToday()
  const status = programmeStatus(slots, date)

  const week = currentLearningWeek(data)
  const outline = getWeekOutline(week)!
  const phase = getPhase(outline.phase)!
  const progress = weekProgress(week, data)
  const weekSlot = slotForWeek(slots, week)

  // The calendar week she is in now, for diary counts and days left.
  const calendarSlot = status.state === 'running' ? status.slot : null
  const diaryStart = calendarSlot?.start ?? addDays(date, -6)
  const diaryEnd = calendarSlot?.end ?? date
  const diaryCount = diaryCountBetween(data, diaryStart, diaryEnd)
  const reviewDue = dueReviewCount(data, date)

  const pace = pacing(data, slots, date)
  const flexAvailable = canTakeFlexWeek(slots, date, data.flexWeekTakenOn)
  const pace_ = pacingText(pace, calendarSlot ? daysLeftInSlot(calendarSlot, date) : 7, flexAvailable)

  // "Continue" prefers the lesson she last opened, if it is unfinished.
  const last = data.lastLesson
  const lastLesson = last ? getLesson(last.week, last.slug) : undefined
  const lastUnfinished = last && lastLesson && !data.lessons[lessonKey(last.week, last.slug)]?.completedAt
  const steps = nextSteps(week, data, 4)
  const primary: NextStep | undefined = lastUnfinished
    ? { kind: 'lesson', week: last.week, slug: last.slug, title: lastLesson.title, minutes: lastLesson.minutes }
    : steps[0]

  return (
    <Page>
      <p className="text-[0.8125rem] text-ink-3">{formatLong(date)}</p>
      <h1 className="mt-1 font-serif text-[2.25rem] leading-tight font-semibold tracking-[-0.01em]">
        {greeting()}, {PROGRAMME.learnerName}
      </h1>
      <p className="mt-1 text-[0.9375rem] text-ink-2">
        {status.state === 'not-started'
          ? `Your course starts on ${formatLong(status.firstSlot.start)}.`
          : `Week ${week} of ${PROGRAMME.totalWeeks} · Phase ${phase.number}: ${phase.title}`}
      </p>

      {status.state === 'not-started' ? <BeforeStart daysToGo={status.daysToGo} /> : null}
      {calendarSlot?.kind === 'flex' ? <FlexWeekNote christmas={calendarSlot.flex === 'christmas'} /> : null}

      {primary && primary.kind !== 'not-written' && primary.kind !== 'done' ? (
        <Box className="mt-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-accent">{lastUnfinished ? 'Continue' : 'Up next'}</div>
            <div className="mt-0.5 font-serif text-xl font-semibold">{primary.title}</div>
            <div className="mt-0.5 text-[0.8125rem] text-ink-3">
              {stepLabel(primary)} · Week {primary.week}
              {stepMinutes(primary) ? ` · About ${stepMinutes(primary)} min` : ''}
            </div>
          </div>
          <Button asChild size="lg" className="self-start sm:self-auto">
            <Link to={stepHref(primary)}>
              {lastUnfinished ? 'Continue' : 'Start'} <ArrowRight />
            </Link>
          </Button>
        </Box>
      ) : null}

      <div className="mt-8 grid gap-7 lg:grid-cols-[1.55fr_1fr]">
        <section>
          <SectionHeading
            title={`Week ${week}: ${outline.title}`}
            aside={weekSlot ? formatRangeWords(weekSlot.start, weekSlot.end) : undefined}
          />
          {isWeekWritten(week) ? (
            <WeekChecklist week={week} data={data} />
          ) : (
            <Box className="p-5 text-[0.9375rem] text-ink-2">
              The lessons for this week are being written. They will be ready before the week starts.
            </Box>
          )}
          <Link
            to={`/week/${week}`}
            className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-accent hover:text-accent-strong"
          >
            See the week plan <ChevronRight className="size-4" />
          </Link>
        </section>

        <aside className="flex flex-col gap-3.5 lg:pt-7">
          <Box className="p-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Weekly goal</h2>
              {status.state === 'running' ? (
                <div className="flex items-center gap-1.5 text-[0.8125rem]">
                  <PacingDot pacing={pace} />
                  {pace_.label}
                </div>
              ) : null}
            </div>
            {status.state === 'running' ? <p className="mt-1 text-[0.8125rem] text-ink-3">{pace_.detail}</p> : null}
            <dl className="mt-3.5 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3 text-[0.8125rem]">
              <GoalRow label="Lessons" done={progress.lessonsDone} total={progress.lessonsTotal} />
              <GoalRow label="Assignments" done={progress.assignmentsDone} total={progress.assignmentsTotal} />
              <GoalRow
                label="Checkpoint quiz"
                done={progress.quiz.passed ? 1 : 0}
                total={1}
                text={progress.quiz.passed ? 'Passed' : progress.quiz.taken ? 'Try again' : 'Not taken'}
              />
              <GoalRow label="News diary" done={Math.min(diaryCount, PROGRAMME.diaryTarget)} total={PROGRAMME.diaryTarget} text={`${diaryCount}/${PROGRAMME.diaryTarget}`} />
            </dl>
          </Box>

          <Box className="flex items-center justify-between gap-3 p-4">
            <div>
              <h2 className="text-sm font-semibold">News diary</h2>
              <p className="mt-0.5 text-[0.8125rem] text-ink-3">
                {diaryCount} of {PROGRAMME.diaryTarget} stories this week
              </p>
            </div>
            <Button variant="secondary" size="sm" asChild>
              <Link to="/diary?new=1">
                <Plus /> Add a story
              </Link>
            </Button>
          </Box>

          {reviewDue > 0 ? (
            <Box className="flex items-center justify-between gap-3 p-4">
              <div>
                <h2 className="text-sm font-semibold">Review</h2>
                <p className="mt-0.5 text-[0.8125rem] text-ink-3">
                  {reviewDue} question{reviewDue === 1 ? '' : 's'} to practise again
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/review">
                  Start <ChevronRight />
                </Link>
              </Button>
            </Box>
          ) : null}
        </aside>
      </div>
    </Page>
  )
}

function GoalRow({ label, done, total, text }: { label: string; done: number; total: number; text?: string }) {
  return (
    <>
      <dt>
        <div className="text-ink">{label}</div>
        <ProgressBar value={total ? done / total : 0} label={label} tone="ink" className="mt-1.5" />
      </dt>
      <dd className="min-w-16 text-right text-ink-2">{text ?? `${done}/${total}`}</dd>
    </>
  )
}

function BeforeStart({ daysToGo }: { daysToGo: number }) {
  return (
    <Box className="mt-6 p-5">
      <div className="kicker text-accent">Getting ready</div>
      <p className="mt-2 font-serif text-2xl font-semibold">
        {daysToGo === 1 ? 'Week 1 starts tomorrow.' : `Week 1 starts in ${daysToGo} days.`}
      </p>
      <p className="mt-2 max-w-prose text-[0.9375rem] text-ink-2">
        You can look around now. The lessons for Week 1 are open, so you can start early if you want to.
      </p>
    </Box>
  )
}

function FlexWeekNote({ christmas }: { christmas: boolean }) {
  return (
    <Box className="mt-6 p-5">
      <div className="kicker text-accent">Flex week</div>
      <p className="mt-2 font-serif text-2xl font-semibold">{christmas ? 'Enjoy your Christmas break.' : 'This is your flex week.'}</p>
      <p className="mt-2 max-w-prose text-[0.9375rem] text-ink-2">
        There is no new work this week. Rest, or catch up on anything you have not finished.
      </p>
    </Box>
  )
}
