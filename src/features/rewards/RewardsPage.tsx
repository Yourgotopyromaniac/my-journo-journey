import { Check } from 'lucide-react'
import { useState } from 'react'
import { Page } from '@/app/AppLayout'
import { Box } from '@/components/ui/box'
import { Dialog } from '@/components/ui/dialog'
import { ProgressBar } from '@/components/ui/progress-bar'
import { getWeekOutline, PROGRAMME } from '@/content/course'
import { formatDayYear } from '@/lib/dates'
import { useDocumentTitle } from '@/lib/hooks'
import { useProgress, type Reward } from '@/store/progress'
import { CouponActions } from './CouponActions'
import { useCouponImage } from './useCouponImage'

export default function RewardsPage() {
  useDocumentTitle('Treat coupons')
  const rewards = useProgress((s) => s.rewards)
  const list = Object.values(rewards).sort((a, b) => b.week - a.week)

  return (
    <Page>
      <h1 className="font-serif text-[2.25rem] leading-tight font-semibold">Treat coupons</h1>
      <p className="mt-1 max-w-prose text-[0.9375rem] text-ink-2">
        Every week you finish earns a coupon for an ice cream or a snack of your choice. Send each one to{' '}
        {PROGRAMME.rewardsFrom} to claim it.
      </p>

      <div className="mt-5 max-w-md">
        <div className="text-[0.8125rem] text-ink-2">
          {list.length} of {PROGRAMME.totalWeeks} coupons earned
        </div>
        <ProgressBar value={list.length / PROGRAMME.totalWeeks} label="Coupons earned" className="mt-2" />
      </div>

      {list.length === 0 ? (
        <Box className="mt-7 max-w-2xl p-5 text-[0.9375rem] leading-relaxed text-ink-2">
          No coupons yet. Finish every lesson, assignment and quiz in a week to earn your first one.
        </Box>
      ) : (
        <ul className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((reward) => (
            <li key={reward.week}>
              <CouponCard reward={reward} />
            </li>
          ))}
        </ul>
      )}
    </Page>
  )
}

function CouponCard({ reward }: { reward: Reward }) {
  const { image } = useCouponImage(reward.week, reward.earnedAt)
  const outline = getWeekOutline(reward.week)
  const [enlarged, setEnlarged] = useState(false)
  const alt = `Treat coupon for Week ${reward.week}: one ice cream or snack of your choice, code ${reward.code}.`

  return (
    <Box className="flex h-full flex-col overflow-hidden">
      <button
        type="button"
        onClick={() => setEnlarged(true)}
        disabled={!image}
        aria-label={`View the Week ${reward.week} coupon full size`}
        className="group flex justify-center border-b border-rule-soft bg-sunken px-6 py-5"
      >
        {image ? (
          <img
            src={image.url}
            alt={alt}
            className="aspect-[4/5] w-full max-w-[13rem] rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-transform group-hover:-rotate-1 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="aspect-[4/5] w-full max-w-[13rem] animate-pulse rounded-lg bg-rule-soft" />
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-serif text-xl leading-tight font-semibold">Week {reward.week}</div>
            <div className="mt-0.5 text-sm text-ink-2">{outline?.title}</div>
          </div>
          {reward.sentAt ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-soft px-2.5 py-1 text-xs font-medium text-success">
              <Check className="size-3.5" aria-hidden /> Sent
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">To send</span>
          )}
        </div>
        <div className="mt-2 text-xs text-ink-3">
          Earned {formatDayYear(reward.earnedAt.slice(0, 10))} · <span className="font-mono tracking-wide">{reward.code}</span>
        </div>
        <CouponActions compact week={reward.week} blob={image?.blob ?? null} className="mt-auto pt-4" />
      </div>

      <Dialog open={enlarged} onOpenChange={setEnlarged} title={`Week ${reward.week} coupon`}>
        {image ? <img src={image.url} alt={alt} className="mx-auto w-full max-w-sm rounded-lg" /> : null}
        <CouponActions week={reward.week} blob={image?.blob ?? null} className="mt-4" />
      </Dialog>
    </Box>
  )
}
