import { Dialog as RadixDialog } from 'radix-ui'
import { useEffect } from 'react'
import { Link } from 'react-router'
import { writtenWeeks } from '@/content'
import { getWeekOutline, PROGRAMME } from '@/content/course'
import { couponCode } from '@/lib/coupon'
import { useProgressData } from '@/lib/hooks'
import { weekProgress } from '@/lib/progress'
import { useProgress, type Reward } from '@/store/progress'
import { CouponActions } from './CouponActions'
import { useCouponImage } from './useCouponImage'

/**
 * Watches for newly completed weeks. Each one earns a treat coupon, and the
 * "week complete" message opens once for it.
 */
export function RewardWatcher() {
  const data = useProgressData()
  const earnReward = useProgress((s) => s.earnReward)
  const markRewardSeen = useProgress((s) => s.markRewardSeen)

  const newlyComplete = data.onboarded
    ? writtenWeeks()
        .map((w) => w.number)
        .filter((week) => !data.rewards[week] && weekProgress(week, data).complete)
    : []

  // A string key keeps the effect from re-running on every render.
  const newlyCompleteKey = newlyComplete.join(',')
  useEffect(() => {
    for (const week of newlyCompleteKey.split(',').filter(Boolean).map(Number)) {
      earnReward(week, couponCode(week))
    }
  }, [newlyCompleteKey, earnReward])

  const unseen = Object.values(data.rewards)
    .filter((r) => !r.seenAt)
    .sort((a, b) => a.week - b.week)[0]

  if (!unseen) return null
  return <WeekCompleteDialog key={unseen.week} reward={unseen} onClose={() => markRewardSeen(unseen.week)} />
}

function WeekCompleteDialog({ reward, onClose }: { reward: Reward; onClose: () => void }) {
  const { image, failed } = useCouponImage(reward.week, reward.earnedAt)
  const outline = getWeekOutline(reward.week)

  return (
    <RadixDialog.Root open onOpenChange={(open) => !open && onClose()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px]" />
        <RadixDialog.Content
          // Focus the dialog itself, not the first button, so no focus ring flashes on open.
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            ;(e.currentTarget as HTMLElement).focus()
          }}
          tabIndex={-1}
          className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius-box)] border border-rule-soft bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,0.25)] focus:outline-none sm:p-7">
          <div className="grid gap-6 sm:grid-cols-[1fr_14rem] sm:items-start">
            <div>
              <div className="kicker text-accent">Week {reward.week} complete</div>
              <RadixDialog.Title className="mt-2 font-serif text-[2rem] leading-tight font-semibold">
                Well done, {PROGRAMME.learnerName}.
              </RadixDialog.Title>
              <RadixDialog.Description asChild>
                <div className="mt-3 space-y-2 text-[0.9375rem] leading-relaxed text-ink-2">
                  <p>
                    You finished Week {reward.week}: {outline?.title}. Every lesson, assignment and quiz is done.
                  </p>
                  <p>
                    That earns you a treat. Send this coupon to {PROGRAMME.rewardsFrom} to claim an ice cream or a snack of
                    your choice.
                  </p>
                </div>
              </RadixDialog.Description>
              <CouponActions week={reward.week} blob={image?.blob ?? null} className="mt-5" />
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <RadixDialog.Close className="min-h-11 font-medium text-ink-2 hover:text-ink">Close</RadixDialog.Close>
                <Link to="/rewards" onClick={onClose} className="min-h-11 content-center font-medium text-accent hover:text-accent-strong">
                  See all your coupons
                </Link>
              </div>
            </div>
            <div className="order-first sm:order-last">
              {image ? (
                <img
                  src={image.url}
                  alt={`Treat coupon for Week ${reward.week}: one ice cream or snack of your choice, code ${reward.code}.`}
                  className="coupon-pop mx-auto w-48 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.18)] sm:w-full"
                />
              ) : (
                <div className="mx-auto flex aspect-[4/5] w-48 items-center justify-center rounded-lg bg-sunken text-sm text-ink-3 sm:w-full">
                  {failed ? 'Coupon could not be drawn' : 'Drawing your coupon'}
                </div>
              )}
            </div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
