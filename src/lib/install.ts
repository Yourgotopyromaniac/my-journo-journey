import { useEffect, useState } from 'react'

/**
 * Installing the app to the home screen.
 *
 * Chrome decides when a site can be installed and then fires `beforeinstallprompt`.
 * It needs the service worker to be registered and some user engagement first, so the
 * event may arrive late, or not at all on a first visit. index.html catches it as early
 * as possible and stores it on `window.__installPrompt`.
 *
 * If the event has not arrived yet, the app shows manual steps (Chrome menu > Install app).
 */

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

declare global {
  interface Window {
    __installPrompt?: InstallPromptEvent | null
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // Safari on iPhone and iPad
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

export type InstallResult = 'accepted' | 'dismissed' | 'unavailable'

export function useInstallPrompt() {
  const [canPrompt, setCanPrompt] = useState(() => Boolean(window.__installPrompt))
  const [installed, setInstalled] = useState(isStandalone)

  useEffect(() => {
    const sync = () => setCanPrompt(Boolean(window.__installPrompt))
    const onInstalled = () => setInstalled(true)
    window.addEventListener('mjj-install-ready', sync)
    window.addEventListener('appinstalled', onInstalled)
    const media = window.matchMedia('(display-mode: standalone)')
    const onDisplayChange = () => setInstalled(isStandalone())
    media.addEventListener('change', onDisplayChange)
    return () => {
      window.removeEventListener('mjj-install-ready', sync)
      window.removeEventListener('appinstalled', onInstalled)
      media.removeEventListener('change', onDisplayChange)
    }
  }, [])

  const promptInstall = async (): Promise<InstallResult> => {
    const event = window.__installPrompt
    if (!event) return 'unavailable'
    await event.prompt()
    const { outcome } = await event.userChoice
    // Chrome allows each prompt event to be used once.
    window.__installPrompt = null
    setCanPrompt(false)
    if (outcome === 'accepted') setInstalled(true)
    return outcome
  }

  return { canPrompt, installed, promptInstall }
}
