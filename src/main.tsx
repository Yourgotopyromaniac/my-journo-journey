import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { router } from '@/app/router'
import { ThemeSync } from '@/app/ThemeSync'
import { useProgress, whenHydrated } from '@/store/progress'
import '@/styles/index.css'

const root = createRoot(document.getElementById('root')!)

// Wait for saved progress to load from the device before the first render,
// so the welcome screen never flashes for someone who has already started.
whenHydrated().then(() => {
  // Development only: ?onboarded skips the welcome screen when previewing pages.
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('onboarded')) {
    useProgress.getState().completeOnboarding()
  }
  // Development only: console helpers. Type __dev.help() in the browser console.
  if (import.meta.env.DEV) {
    import('@/lib/devtools').then(({ devtools }) => {
      Object.assign(window, { __progress: useProgress, __dev: devtools })
      console.info('Dev helpers ready. Type __dev.help() for a list.')
    })
  }
  root.render(
    <StrictMode>
      <ThemeSync />
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
