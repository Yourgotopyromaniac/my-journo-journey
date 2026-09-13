import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Button } from '@/components/ui/button'

function errorText(error: unknown): string {
  if (isRouteErrorResponse(error)) return `${error.status} ${error.statusText}`
  if (error instanceof Error) return error.message
  return String(error)
}

export function RouteError() {
  const error = useRouteError()
  const notFound = isRouteErrorResponse(error) && error.status === 404
  // Part of the app failed to download: after an update, on a bad connection, or a stale dev server.
  const chunkFailed = error instanceof Error && /dynamically imported module|Loading chunk|Importing a module script failed/i.test(error.message)

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6 py-12">
      <div className="kicker text-accent">{notFound ? 'Page not found' : 'Something went wrong'}</div>
      <h1 className="mt-2 font-serif text-4xl font-semibold">
        {notFound ? 'This page does not exist.' : chunkFailed ? 'Part of the app did not load.' : 'Sorry, this page did not load.'}
      </h1>
      <p className="mt-3 text-ink-2">
        {chunkFailed
          ? 'This can happen after an update, or if the connection dropped. Reload to try again. Your progress is safe.'
          : 'Your progress is safe. Try reloading, or go back to today.'}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={() => window.location.reload()}>Reload</Button>
        <Button variant="secondary" asChild>
          <Link to="/">Go to today</Link>
        </Button>
      </div>

      {!notFound ? (
        <details className="mt-8 text-sm text-ink-3">
          <summary className="min-h-11 cursor-pointer content-center">Details for whoever fixes this</summary>
          <pre className="mt-2 overflow-x-auto rounded-[var(--radius-control)] border border-rule-soft bg-sunken p-3 text-xs whitespace-pre-wrap">
            {errorText(error)}
          </pre>
          {import.meta.env.DEV && chunkFailed ? (
            <p className="mt-2">
              Development tip: if this keeps happening after installing packages, the dev server's dependency cache is out of
              date. Stop it and run <code>npm run dev -- --force</code>.
            </p>
          ) : null}
        </details>
      ) : null}
    </div>
  )
}
