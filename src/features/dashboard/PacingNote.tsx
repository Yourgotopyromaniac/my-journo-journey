import type { Pacing } from '@/lib/progress'
import { cn } from '@/lib/cn'

export function pacingText(p: Pacing, daysLeft: number, flexAvailable: boolean): { label: string; detail: string } {
  const days = `${daysLeft} day${daysLeft === 1 ? '' : 's'} left this week.`
  switch (p.state) {
    case 'ahead':
      return {
        label: 'Ahead of plan',
        detail: `You are ${p.weeks} week${p.weeks === 1 ? '' : 's'} ahead. You can slow down or keep going.`,
      }
    case 'on-track':
      return { label: 'On track', detail: days }
    case 'little-behind':
      return {
        label: 'A little behind',
        detail: flexAvailable
          ? 'That is fine. Finish last week first. Your flex week can help if you need it.'
          : 'That is fine. Finish last week first, then carry on.',
      }
    case 'behind':
      return {
        label: `${p.weeks} weeks behind plan`,
        detail: flexAvailable
          ? 'Take it one lesson at a time. You can also take your flex week to catch up.'
          : 'Take it one lesson at a time. Short, steady sessions help most.',
      }
  }
}

export function PacingDot({ pacing }: { pacing: Pacing }) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-block size-2 shrink-0 rounded-full',
        pacing.state === 'on-track' || pacing.state === 'ahead' ? 'bg-success' : 'bg-warning',
      )}
    />
  )
}
