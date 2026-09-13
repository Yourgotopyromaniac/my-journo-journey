import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Button } from '@/components/ui/button'

export function RouteError() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404
  // A failed chunk load usually means the app updated while it was open.
  const chunkFailed = error instanceof Error && /dynamically imported module|Loading chunk/i.test(error.message)

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-12">
      <div className="kicker text-accent">{notFound ? 'Page not found' : 'Something went wrong'}</div>
      <h1 className="mt-2 font-serif text-4xl font-semibold">
        {notFound ? 'This page does not exist.' : chunkFailed ? 'The app needs to reload.' : 'Sorry, this page did not load.'}
      </h1>
      <p className="mt-3 text-ink-2">
        {chunkFailed
          ? 'A new version was installed while the app was open. Reload to continue. Your progress is safe.'
          : 'Your progress is safe. Try reloading, or go back to today.'}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={() => window.location.reload()}>Reload</Button>
        <Button variant="secondary" asChild>
          <Link to="/">Go to today</Link>
        </Button>
      </div>
    </div>
  )
}
