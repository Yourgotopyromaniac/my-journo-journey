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
  root.render(
    <StrictMode>
      <ThemeSync />
      <RouterProvider router={router} />
    </StrictMode>,
  )
})
