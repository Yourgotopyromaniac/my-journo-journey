import { Download, Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PROGRAMME } from '@/content/course'
import { couponFilename, saveBlob, sendCoupon } from '@/lib/coupon'
import { cn } from '@/lib/cn'
import { useProgress } from '@/store/progress'

/** "Send to Abiola" and "Save image" buttons, with a short status message after. */
export function CouponActions({
  week,
  blob,
  className,
  compact = false,
}: {
  week: number
  blob: Blob | null
  className?: string
  /** Full-width send button with an icon-only save button, for cards. */
  compact?: boolean
}) {
  const markRewardSent = useProgress((s) => s.markRewardSent)
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const send = async () => {
    if (!blob) return
    setBusy(true)
    const result = await sendCoupon(blob, week)
    setBusy(false)
    if (result === 'shared') {
      markRewardSent(week)
      setStatus('Sent. Enjoy your treat.')
    } else if (result === 'saved') {
      markRewardSent(week)
      setStatus(`The coupon was saved to your downloads. Send it to ${PROGRAMME.rewardsFrom} on WhatsApp.`)
    }
  }

  const save = () => {
    if (!blob) return
    saveBlob(blob, couponFilename(week))
    setStatus(`Saved to your downloads. Send it to ${PROGRAMME.rewardsFrom} to claim your treat.`)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {compact ? (
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Button onClick={send} disabled={!blob || busy}>
            <Send /> Send to {PROGRAMME.rewardsFrom}
          </Button>
          <Button variant="secondary" size="icon" onClick={save} disabled={!blob} aria-label="Save image" title="Save image">
            <Download />
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          <Button onClick={send} disabled={!blob || busy}>
            <Send /> Send to {PROGRAMME.rewardsFrom}
          </Button>
          <Button variant="secondary" onClick={save} disabled={!blob}>
            <Download /> Save image
          </Button>
        </div>
      )}
      {status || !compact ? (
        <p role="status" aria-live="polite" className={cn('text-sm text-ink-2', !compact && 'min-h-5')}>
          {status}
        </p>
      ) : null}
    </div>
  )
}
