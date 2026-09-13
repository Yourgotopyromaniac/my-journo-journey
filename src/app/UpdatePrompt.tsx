import { WifiOff } from 'lucide-react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/button'
import { useOnline } from '@/lib/hooks'

/** Tells her when a new version (for example, new lessons) is ready, and when she is offline. */
export function UpdatePrompt() {
  const online = useOnline()
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // Check for new lessons every hour while the app is open.
      if (registration) setInterval(() => registration.update(), 60 * 60 * 1000)
    },
  })

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 md:bottom-5">
      {!online ? (
        <div
          role="status"
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-rule bg-surface px-4 py-2 text-sm text-ink-2 shadow-sm"
        >
          <WifiOff className="size-4" aria-hidden />
          You are offline. Your lessons still work.
        </div>
      ) : null}
      {needRefresh ? (
        <div
          role="status"
          className="pointer-events-auto flex flex-wrap items-center gap-3 rounded-[var(--radius-box)] border border-rule bg-surface py-2 pr-2 pl-4 text-sm shadow-md"
        >
          <span>A new version is ready.</span>
          <Button size="sm" variant="secondary" onClick={() => setNeedRefresh(false)}>
            Later
          </Button>
          <Button size="sm" onClick={() => updateServiceWorker(true)}>
            Update now
          </Button>
        </div>
      ) : null}
    </div>
  )
}
