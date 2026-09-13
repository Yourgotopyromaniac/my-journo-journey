import type { ComponentProps, ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

const control =
  'w-full rounded-[var(--radius-control)] border border-rule bg-surface px-3.5 text-base text-ink transition-[border-color,box-shadow] placeholder:text-ink-3 focus:border-ink-2 focus:ring-3 focus:ring-accent/15 focus:outline-none aria-[invalid=true]:border-accent aria-[invalid=true]:ring-accent/20'

export function Field({
  label,
  hint,
  error,
  optional = false,
  children,
  className,
}: {
  label: string
  hint?: string
  error?: string
  optional?: boolean
  children: (props: { id: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean }) => ReactNode
  className?: string
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="flex items-baseline gap-1.5 text-sm font-semibold text-ink">
        {label}
        {optional ? <span className="text-xs font-normal text-ink-3">Optional</span> : null}
      </label>
      {children({ id, 'aria-describedby': describedBy, 'aria-invalid': error ? true : undefined })}
      {error ? (
        <p id={errorId} className="text-[0.8125rem] text-accent">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-[0.8125rem] text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(control, 'min-h-11', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(control, 'min-h-28 py-2.5 leading-relaxed', className)} {...props} />
}
