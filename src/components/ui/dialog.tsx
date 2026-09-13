import { AlertDialog, Dialog as RadixDialog } from 'radix-ui'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Button } from './button'

const overlay = 'fixed inset-0 z-50 bg-ink/40 backdrop-blur-[1px]'
const panel =
  'fixed top-1/2 left-1/2 z-50 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-box)] border border-rule-soft bg-surface p-6 shadow-[0_20px_50px_rgba(0,0,0,0.18)] focus:outline-none'

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  destructive = false,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: ReactNode
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  destructive?: boolean
  children?: ReactNode
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={overlay} />
        <AlertDialog.Content className={panel}>
          <AlertDialog.Title className="font-serif text-2xl font-semibold">{title}</AlertDialog.Title>
          <AlertDialog.Description asChild>
            <div className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{description}</div>
          </AlertDialog.Description>
          {children}
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">{cancelLabel}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button variant={destructive ? 'danger' : 'primary'} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={overlay} />
        <RadixDialog.Content className={cn(panel, 'max-h-[calc(100dvh-2rem)] overflow-y-auto', className)}>
          <RadixDialog.Title className="font-serif text-2xl font-semibold">{title}</RadixDialog.Title>
          {description ? (
            <RadixDialog.Description className="mt-1 text-[0.9375rem] text-ink-2">{description}</RadixDialog.Description>
          ) : (
            <RadixDialog.Description className="sr-only">{title}</RadixDialog.Description>
          )}
          <div className="mt-5">{children}</div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  )
}
