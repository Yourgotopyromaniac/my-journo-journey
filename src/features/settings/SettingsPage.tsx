import { Download, Upload } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { Page } from '@/app/AppLayout'
import { InstallApp } from '@/components/InstallApp'
import { Box } from '@/components/ui/box'
import { Button } from '@/components/ui/button'
import { ChoiceGroup } from '@/components/ui/choice-group'
import { ConfirmDialog } from '@/components/ui/dialog'
import { downloadBackup, parseBackup, type ParsedBackup } from '@/lib/backup'
import { addDays, formatDayYear, formatRangeWords } from '@/lib/dates'
import { useDocumentTitle } from '@/lib/hooks'
import { PROGRAMME } from '@/content/course'
import { useProgress, type TextSize, type Theme } from '@/store/progress'

function Row({
  title,
  description,
  children,
  id,
}: {
  title: string
  description?: ReactNode
  children: ReactNode
  id?: string
}) {
  return (
    <div
      id={id}
      className="flex scroll-mt-6 flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="max-w-md">
        <div className="font-semibold">{title}</div>
        {description ? (
          <div className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-3">{description}</div>
        ) : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  useDocumentTitle('Settings')
  const { hash } = useLocation()
  const theme = useProgress((s) => s.theme)
  const textSize = useProgress((s) => s.textSize)
  const setTheme = useProgress((s) => s.setTheme)
  const setTextSize = useProgress((s) => s.setTextSize)
  const lastBackupAt = useProgress((s) => s.lastBackupAt)
  const flexWeekTakenOn = useProgress((s) => s.flexWeekTakenOn)
  const markBackedUp = useProgress((s) => s.markBackedUp)
  const replaceAll = useProgress((s) => s.replaceAll)
  const resetAll = useProgress((s) => s.resetAll)

  const fileInput = useRef<HTMLInputElement>(null)
  const [pending, setPending] = useState<Extract<ParsedBackup, { ok: true }> | null>(null)
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)
  const [confirmReset, setConfirmReset] = useState(false)

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
  }, [hash])

  const onFile = async (file: File | undefined) => {
    if (!file) return
    const result = parseBackup(await file.text())
    if (fileInput.current) fileInput.current.value = ''
    if (!result.ok) setMessage({ tone: 'error', text: result.message })
    else setPending(result)
  }

  return (
    <Page>
      <h1 className="font-serif text-[2.25rem] leading-tight font-semibold">Settings</h1>

      <section className="mt-7 max-w-3xl">
        <h2 className="mb-2.5 text-sm font-semibold">Display</h2>
        <Box className="divide-y divide-rule-soft">
          <Row title="Theme" description="System follows your tablet's light or dark setting.">
            <ChoiceGroup<Theme>
              label="Theme"
              value={theme}
              onChange={setTheme}
              options={[
                { value: 'system', label: 'System' },
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
              ]}
            />
          </Row>
          <Row title="Text size" description="Makes all text in the app bigger or smaller.">
            <ChoiceGroup<TextSize>
              label="Text size"
              value={textSize}
              onChange={setTextSize}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'large', label: 'Large' },
                { value: 'larger', label: 'Larger' },
              ]}
            />
          </Row>
        </Box>
      </section>

      <section className="mt-8 max-w-3xl">
        <h2 className="mb-2.5 text-sm font-semibold">App</h2>
        <Box>
          <Row
            title="Install on this device"
            description="Puts the app on your home screen, lets lessons work without internet, and helps keep your progress safe."
          >
            <InstallApp compact />
          </Row>
        </Box>
      </section>

      <section className="mt-8 max-w-3xl">
        <h2 className="mb-2.5 text-sm font-semibold">Your progress</h2>
        <Box className="divide-y divide-rule-soft">
          <Row
            id="backup"
            title="Back up your progress"
            description={
              <>
                Your progress is saved on this tablet only. Save a backup file to Google Drive every week or
                two, in case the tablet is lost or the browser data is cleared.
                <span className="mt-1 block">
                  {lastBackupAt
                    ? `Last backup: ${formatDayYear(lastBackupAt.slice(0, 10))}.`
                    : 'You have not made a backup yet.'}
                </span>
              </>
            }
          >
            <Button
              onClick={() => {
                downloadBackup()
                markBackedUp()
                setMessage({
                  tone: 'ok',
                  text: 'Backup file saved to your downloads. Move it to Google Drive to keep it safe.',
                })
              }}
            >
              <Download /> Save backup
            </Button>
          </Row>
          <Row
            title="Restore from a backup"
            description="Replaces the progress on this device with the progress in the file."
          >
            <input
              ref={fileInput}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              aria-label="Choose a backup file"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
            <Button variant="secondary" onClick={() => fileInput.current?.click()}>
              <Upload /> Choose file
            </Button>
          </Row>
          {flexWeekTakenOn ? (
            <Row
              title="Flex week"
              description={`Your flex week is ${formatRangeWords(flexWeekTakenOn, addDays(flexWeekTakenOn, 6))}. You can cancel it on the Roadmap while that week has not ended.`}
            >
              <span />
            </Row>
          ) : null}
        </Box>
        {message ? (
          <p
            role="status"
            className={message.tone === 'ok' ? 'mt-3 text-sm text-success' : 'mt-3 text-sm text-accent'}
          >
            {message.text}
          </p>
        ) : null}
      </section>

      <section className="mt-8 max-w-3xl">
        <h2 className="mb-2.5 text-sm font-semibold">Start over</h2>
        <Box>
          <Row
            title="Clear all progress"
            description="Deletes your lesson progress, quiz results, journal and news diary from this device."
          >
            <Button variant="danger" onClick={() => setConfirmReset(true)}>
              Clear progress
            </Button>
          </Row>
        </Box>
      </section>

      <p className="mt-10 text-xs text-ink-3">
        My Journo Journey · Made for {PROGRAMME.learnerName} with ❤️ from {PROGRAMME.rewardsFrom} 😌 · Your progress stays
        on this device.
      </p>

      <ConfirmDialog
        open={pending !== null}
        onOpenChange={(o) => !o && setPending(null)}
        title="Restore this backup?"
        description={
          pending ? (
            <>
              This backup was made on {formatDayYear(pending.exportedAt.slice(0, 10))}. It will replace all
              progress on this device. Save a backup of your current progress first if you might need it.
            </>
          ) : null
        }
        confirmLabel="Restore backup"
        destructive
        onConfirm={() => {
          if (pending) replaceAll(pending.data)
          setPending(null)
          setMessage({ tone: 'ok', text: 'Your backup was restored.' })
        }}
      />

      <ConfirmDialog
        open={confirmReset}
        onOpenChange={setConfirmReset}
        title="Clear all progress?"
        description="Everything you have done in the app will be deleted from this device. This cannot be undone unless you have a backup."
        confirmLabel="Yes, clear everything"
        destructive
        onConfirm={() => {
          resetAll()
          setConfirmReset(false)
          setMessage({ tone: 'ok', text: 'Your progress was cleared.' })
        }}
      />
    </Page>
  )
}
