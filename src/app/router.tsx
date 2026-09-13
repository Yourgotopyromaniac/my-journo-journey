import type { ComponentType } from 'react'
import { createBrowserRouter, Navigate, Outlet, ScrollRestoration, useLocation } from 'react-router'
import { RewardWatcher } from '@/features/rewards/RewardWatcher'
import { useProgress } from '@/store/progress'
import { AppLayout } from './AppLayout'
import { RouteError } from './RouteError'
import { UpdatePrompt } from './UpdatePrompt'

/** Sends first-time visitors to the welcome screen. */
function Gate() {
  const onboarded = useProgress((s) => s.onboarded)
  const { pathname } = useLocation()
  if (!onboarded && pathname !== '/welcome') return <Navigate to="/welcome" replace />
  return (
    <>
      <ScrollRestoration />
      <Outlet />
      <RewardWatcher />
      <UpdatePrompt />
    </>
  )
}

const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

export const router = createBrowserRouter([
  {
    element: <Gate />,
    errorElement: <RouteError />,
    HydrateFallback: () => null,
    children: [
      { path: '/welcome', lazy: page(() => import('@/features/onboarding/WelcomePage')) },
      {
        element: <AppLayout />,
        children: [
          { index: true, lazy: page(() => import('@/features/dashboard/DashboardPage')) },
          { path: '/roadmap', lazy: page(() => import('@/features/roadmap/RoadmapPage')) },
          { path: '/week/:week', lazy: page(() => import('@/features/week/WeekPage')) },
          { path: '/journal', lazy: page(() => import('@/features/journal/JournalPage')) },
          { path: '/diary', lazy: page(() => import('@/features/diary/DiaryPage')) },
          { path: '/toolkit', lazy: page(() => import('@/features/toolkit/ToolkitPage')) },
          { path: '/toolkit/:id', lazy: page(() => import('@/features/toolkit/ChecklistPage')) },
          { path: '/search', lazy: page(() => import('@/features/search/SearchPage')) },
          { path: '/rewards', lazy: page(() => import('@/features/rewards/RewardsPage')) },
          { path: '/settings', lazy: page(() => import('@/features/settings/SettingsPage')) },
          { path: '*', lazy: page(() => import('./NotFoundPage')) },
        ],
      },
      // Focused screens without the main navigation.
      { path: '/week/:week/lesson/:slug', lazy: page(() => import('@/features/lesson/LessonPage')) },
      { path: '/week/:week/assignment/:id', lazy: page(() => import('@/features/assignment/AssignmentPage')) },
      { path: '/week/:week/quiz', lazy: page(() => import('@/features/quiz/QuizPage')) },
      { path: '/phase/:phase/review', lazy: page(() => import('@/features/quiz/PhaseReviewPage')) },
      { path: '/review', lazy: page(() => import('@/features/review/ReviewPage')) },
    ],
  },
])
