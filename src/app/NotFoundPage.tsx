import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { useDocumentTitle } from '@/lib/hooks'
import { Page } from './AppLayout'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <Page>
      <div className="kicker text-accent">Page not found</div>
      <h1 className="mt-2 font-serif text-4xl font-semibold">This page does not exist.</h1>
      <p className="mt-3 text-ink-2">The link may be old. Your progress is safe.</p>
      <Button className="mt-6" asChild>
        <Link to="/">Go to today</Link>
      </Button>
    </Page>
  )
}
