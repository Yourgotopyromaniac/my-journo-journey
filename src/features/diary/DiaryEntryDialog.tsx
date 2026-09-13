import { Check } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog } from '@/components/ui/dialog'
import { Field, Input, Textarea } from '@/components/ui/field'
import { NEWS_VALUES, PROGRAMME } from '@/content/course'
import { cn } from '@/lib/cn'
import { addDays, type IsoDate } from '@/lib/dates'
import type { DiaryEntry } from '@/store/progress'

export type DiaryFormState = Omit<DiaryEntry, 'id' | 'createdAt'> & { id?: string }

type Errors = Partial<Record<'headline' | 'outlet' | 'link', string>>

function validate(form: DiaryFormState): Errors {
  const errors: Errors = {}
  if (!form.headline.trim()) errors.headline = 'Add the headline, or a short description of the story.'
  if (!form.outlet.trim()) errors.outlet = 'Say where you saw it.'
  if (form.link.trim() && !/^https?:\/\/\S+$/.test(form.link.trim())) errors.link = 'Links start with https://'
  return errors
}

export function DiaryEntryDialog({
  initial,
  today,
  onSave,
  onClose,
}: {
  initial: DiaryFormState
  today: IsoDate
  onSave: (form: DiaryFormState) => void
  onClose: () => void
}) {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Errors>({})
  const formRef = useRef<HTMLFormElement>(null)
  const isEdit = Boolean(initial.id)

  const update = (patch: Partial<DiaryFormState>) => {
    setForm((f) => ({ ...f, ...patch }))
    // Clear an error as soon as she fixes that field.
    setErrors((e) => {
      const next = { ...e }
      for (const key of Object.keys(patch)) delete next[key as keyof Errors]
      return next
    })
  }

  const submit = () => {
    const found = validate(form)
    setErrors(found)
    if (Object.keys(found).length) {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    onSave({ ...form, headline: form.headline.trim(), outlet: form.outlet.trim(), link: form.link.trim(), why: form.why.trim() })
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={isEdit ? 'Edit story' : 'Add a story'}
      description="Note a story that caught your eye. A sentence or two is enough."
      className="w-[min(38rem,calc(100vw-2rem))]"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="diary-entry-form">
            {isEdit ? 'Save changes' : 'Save story'}
          </Button>
        </>
      }
    >
      <form
        id="diary-entry-form"
        ref={formRef}
        noValidate
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <Field label="Headline" error={errors.headline}>
          {(p) => (
            <Input
              {...p}
              placeholder="Type or paste the headline"
              value={form.headline}
              onChange={(e) => update({ headline: e.target.value })}
            />
          )}
        </Field>

        <div className="grid gap-5 sm:grid-cols-[1fr_14rem]">
          <Field label="Where you saw it" error={errors.outlet}>
            {(p) => (
              <Input
                {...p}
                placeholder="Premium Times, BBC Pidgin, X..."
                value={form.outlet}
                onChange={(e) => update({ outlet: e.target.value })}
              />
            )}
          </Field>
          <Field label="Date">
            {(p) => (
              <DatePicker
                {...p}
                value={form.date}
                onChange={(date) => update({ date })}
                max={today}
                min={addDays(PROGRAMME.startDate, -60)}
              />
            )}
          </Field>
        </div>

        <Field label="Link" optional error={errors.link}>
          {(p) => (
            <Input
              {...p}
              type="url"
              inputMode="url"
              placeholder="https://"
              value={form.link}
              onChange={(e) => update({ link: e.target.value })}
            />
          )}
        </Field>

        <Field label="Why it caught your attention" optional hint="What made you stop and read it?">
          {(p) => (
            <Textarea
              {...p}
              rows={3}
              className="min-h-24"
              placeholder="One or two sentences"
              value={form.why}
              onChange={(e) => update({ why: e.target.value })}
            />
          )}
        </Field>

        <fieldset>
          <legend className="flex items-baseline gap-1.5 text-sm font-semibold">
            News values it shows <span className="text-xs font-normal text-ink-3">Optional</span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {NEWS_VALUES.map((nv) => {
              const on = form.values.includes(nv.value)
              return (
                <button
                  key={nv.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() =>
                    update({ values: on ? form.values.filter((v) => v !== nv.value) : [...form.values, nv.value] })
                  }
                  className={cn(
                    'inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors',
                    on ? 'border-ink bg-ink text-paper' : 'border-rule bg-surface text-ink-2 hover:border-ink-3 hover:text-ink',
                  )}
                >
                  {on ? <Check className="size-3.5" strokeWidth={2.5} aria-hidden /> : null}
                  {nv.label}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-[0.8125rem] text-ink-3">Choose any that fit. You learn about news values in Week 2.</p>
        </fieldset>
      </form>
    </Dialog>
  )
}
