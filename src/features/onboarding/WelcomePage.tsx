import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { PHASES, PROGRAMME } from '@/content/course'
import { requestPersistentStorage } from '@/lib/storage'
import { formatLong } from '@/lib/dates'
import { useDocumentTitle } from '@/lib/hooks'
import { useProgress } from '@/store/progress'

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const STEPS = ['welcome', 'how', 'install'] as const

export default function WelcomePage() {
  useDocumentTitle('Welcome')
  const navigate = useNavigate()
  const onboarded = useProgress((s) => s.onboarded)
  const completeOnboarding = useProgress((s) => s.completeOnboarding)
  const [step, setStep] = useState<(typeof STEPS)[number]>('welcome')
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(() => window.matchMedia('(display-mode: standalone)').matches)

  useEffect(() => {
    if (onboarded) navigate('/', { replace: true })
  }, [onboarded, navigate])

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault()
      setInstallEvent(e as InstallPromptEvent)
    }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const finish = async () => {
    await requestPersistentStorage()
    completeOnboarding()
    navigate('/', { replace: true })
  }

  const stepIndex = STEPS.indexOf(step)

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 pt-6">
        <div className="font-serif text-lg font-semibold">My Journo Journey</div>
        <div className="flex gap-1.5" aria-label={`Step ${stepIndex + 1} of ${STEPS.length}`}>
          {STEPS.map((s, i) => (
            <span key={s} className={i <= stepIndex ? 'h-1 w-6 rounded-full bg-accent' : 'h-1 w-6 rounded-full bg-rule-soft'} />
          ))}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-10">
        {step === 'welcome' ? (
          <>
            <div className="border-b border-ink pb-3">
              <div className="kicker text-accent">{formatLong(PROGRAMME.startDate)}</div>
            </div>
            <h1 className="mt-6 font-serif text-[3.25rem] leading-[1.02] font-bold tracking-[-0.02em] sm:text-[4rem]">
              Welcome, {PROGRAMME.learnerName}.
            </h1>
            <p className="mt-5 max-w-xl font-serif text-[1.375rem] leading-snug text-ink-2 italic">
              This is your own course in digital journalism. Over 24 weeks you will learn to find, check and write news, then
              focus on politics and entertainment.
            </p>
            <div className="mt-10">
              <Button size="lg" onClick={() => setStep('how')}>
                See how it works <ArrowRight />
              </Button>
            </div>
          </>
        ) : null}

        {step === 'how' ? (
          <>
            <h1 className="font-serif text-[2.5rem] leading-tight font-semibold">How it works</h1>
            <ul className="mt-6 divide-y divide-rule-soft border-y border-rule-soft">
              {[
                ['About 8 hours a week', 'Each week has short lessons, practice assignments and a checkpoint quiz.'],
                ['Quizzes help you check yourself', 'You need 75% to pass, and you can try as often as you like.'],
                ['Two flex weeks', 'One is over Christmas. You can take the other one any time you need a break.'],
                ['A journal and a news diary', 'Reflect on what you learn, and note stories that catch your eye.'],
                ['Private to you', 'There are no accounts. Your progress stays on this tablet.'],
              ].map(([title, text]) => (
                <li key={title} className="grid gap-1 py-4 sm:grid-cols-[15rem_1fr] sm:gap-6">
                  <div className="font-semibold">{title}</div>
                  <div className="text-ink-2">{text}</div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[0.8125rem] text-ink-3">
              {PHASES.map((p) => (
                <span key={p.number}>
                  {p.number}. {p.title}
                </span>
              ))}
            </div>
            <div className="mt-10 flex gap-2">
              <Button size="lg" onClick={() => setStep('install')}>
                Next <ArrowRight />
              </Button>
              <Button size="lg" variant="ghost" onClick={() => setStep('welcome')}>
                Back
              </Button>
            </div>
          </>
        ) : null}

        {step === 'install' ? (
          <>
            <h1 className="font-serif text-[2.5rem] leading-tight font-semibold">Keep it on your home screen</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-2">
              Installing the app puts it on your home screen, lets lessons work without internet, and helps keep your progress
              safe.
            </p>
            <div className="mt-6 max-w-xl rounded-[var(--radius-box)] border border-rule-soft bg-surface p-5">
              {installed ? (
                <p className="font-medium">The app is installed. You are all set.</p>
              ) : installEvent ? (
                <>
                  <p className="text-ink-2">Tap the button to add it to your home screen.</p>
                  <Button
                    className="mt-3"
                    onClick={async () => {
                      await installEvent.prompt()
                      const { outcome } = await installEvent.userChoice
                      if (outcome === 'accepted') setInstalled(true)
                      setInstallEvent(null)
                    }}
                  >
                    Install the app
                  </Button>
                </>
              ) : (
                <ol className="list-decimal space-y-1.5 pl-5 text-ink-2">
                  <li>In Chrome, tap the menu (three dots) at the top right.</li>
                  <li>Tap “Add to home screen” or “Install app”.</li>
                  <li>Open My Journo Journey from your home screen from now on.</li>
                </ol>
              )}
            </div>
            <p className="mt-4 max-w-xl text-[0.9375rem] text-ink-3">
              Also, save a backup of your progress every week or two. You can do this in Settings.
            </p>
            <div className="mt-10 flex gap-2">
              <Button size="lg" onClick={finish}>
                Start learning <ArrowRight />
              </Button>
              <Button size="lg" variant="ghost" onClick={() => setStep('how')}>
                Back
              </Button>
            </div>
          </>
        ) : null}
      </main>
    </div>
  )
}
