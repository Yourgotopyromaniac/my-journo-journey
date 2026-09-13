import { Check, Download, EllipsisVertical } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useInstallPrompt } from '@/lib/install'

/**
 * "Install the app" button that is always shown until the app is installed.
 * It opens Chrome's install prompt when Chrome allows it. Otherwise it shows the manual steps.
 */
export function InstallApp({ compact = false }: { compact?: boolean }) {
  const { canPrompt, installed, promptInstall } = useInstallPrompt()
  const [showSteps, setShowSteps] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (installed) {
    return (
      <p className="flex items-center gap-2 font-medium">
        <Check className="size-5 text-success" aria-hidden /> The app is installed on this device.
      </p>
    )
  }

  const install = async () => {
    const result = await promptInstall()
    if (result === 'unavailable') setShowSteps(true)
    if (result === 'dismissed') setDismissed(true)
  }

  return (
    <div>
      <Button onClick={install} size={compact ? 'md' : 'lg'} variant={compact ? 'secondary' : 'primary'}>
        <Download /> Install the app
      </Button>

      {dismissed && !showSteps ? (
        <p className="mt-2 text-sm text-ink-3">
          No problem. You can install it later from Settings, or from the Chrome menu.
        </p>
      ) : null}

      {showSteps ? (
        <div className="mt-3 rounded-[var(--radius-box)] border border-rule-soft bg-sunken/50 p-4 text-[0.9375rem]">
          <p className="text-ink-2">Chrome is not ready to show its install button yet. You can install from the menu instead:</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-ink-2">
            <li>
              Tap the menu <EllipsisVertical className="inline size-4 align-[-3px]" aria-label="three dots" /> at the top
              right of Chrome.
            </li>
            <li>Tap “Install app” or “Add to home screen”.</li>
            <li>Open My Journo Journey from your home screen from now on.</li>
          </ol>
          {canPrompt ? (
            <Button className="mt-3" size="sm" onClick={install}>
              Chrome is ready now. Install
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
