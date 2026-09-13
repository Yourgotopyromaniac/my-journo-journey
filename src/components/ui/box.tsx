import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Bordered surface used for cards and lists. */
export function Box({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('rounded-[var(--radius-box)] border border-rule-soft bg-surface', className)} {...props} />
  )
}

export function SectionHeading({
  title,
  aside,
  className,
  as: Tag = 'h2',
}: {
  title: string
  aside?: ReactNode
  className?: string
  as?: 'h2' | 'h3'
}) {
  return (
    <div className={cn('mb-2.5 flex items-baseline justify-between gap-4', className)}>
      <Tag className="text-sm font-semibold text-ink">{title}</Tag>
      {aside ? <div className="text-[0.8125rem] text-ink-3">{aside}</div> : null}
    </div>
  )
}
