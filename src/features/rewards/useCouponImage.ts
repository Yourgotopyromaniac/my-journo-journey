import { useEffect, useState } from 'react'
import { renderCoupon } from '@/lib/coupon'

/** Draws a week's coupon and returns the image blob plus a URL for <img>. */
export function useCouponImage(week: number, earnedAt: string) {
  const [image, setImage] = useState<{ blob: Blob; url: string } | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let url: string | null = null
    let cancelled = false
    renderCoupon(week, earnedAt)
      .then((blob) => {
        if (cancelled) return
        url = URL.createObjectURL(blob)
        setImage({ blob, url })
      })
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
      if (url) URL.revokeObjectURL(url)
    }
  }, [week, earnedAt])

  return { image, failed }
}
