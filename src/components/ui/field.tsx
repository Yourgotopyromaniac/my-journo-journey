import type { ComponentProps, ReactNode } from 'react'
import { useId } from 'react'
import { cn } from '@/lib/cn'

const control =
  'w-full rounded-[var(--radius-control)] border border-rule bg-surface px-3.5 text-base text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent'

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: (props: { id: string; 'aria-describedby'?: string }) => ReactNode
  className?: string
}) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {hint ? (
        <p id={hintId} className="-mt-1 text-[0.8125rem] text-ink-3">
          {hint}
        </p>
      ) : null}
      {children({ id, 'aria-describedby': hintId })}
    </div>
  )
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(control, 'min-h-11', className)} {...props} />
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea className={cn(control, 'min-h-28 py-2.5 leading-relaxed', className)} {...props} />
}
