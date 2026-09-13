import { useEffect } from 'react'
import { useProgress } from '@/store/progress'

/** Keeps the <html> theme and text size attributes in step with settings and the system theme. */
export function ThemeSync() {
  const theme = useProgress((s) => s.theme)
  const textSize = useProgress((s) => s.textSize)

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && media.matches)
      document.documentElement.dataset.theme = dark ? 'dark' : 'light'
      document
        .querySelectorAll('meta[name="theme-color"]')
        .forEach((m) => m.setAttribute('content', dark ? '#15130F' : '#F5F0E6'))
    }
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  useEffect(() => {
    document.documentElement.dataset.textSize = textSize
  }, [textSize])

  return null
}
