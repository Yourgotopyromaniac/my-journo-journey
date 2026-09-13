import { Toaster as Sonner } from 'sonner'

/** Toasts in the style of shadcn/ui (Sonner), using the app's colours in both themes. */
export function Toaster() {
  return (
    <Sonner
      position="bottom-center"
      // Sit above the phone bottom bar.
      mobileOffset={{ bottom: 88 }}
      offset={{ bottom: 24 }}
      visibleToasts={2}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'pointer-events-auto flex w-[min(26rem,calc(100vw-2rem))] items-start gap-3 rounded-[var(--radius-box)] border border-rule-soft bg-surface p-4 font-sans text-ink shadow-[0_16px_40px_rgba(0,0,0,0.18)]',
          icon: 'mt-0.5 shrink-0 text-accent',
          content: 'min-w-0 flex-1',
          title: 'text-[0.9375rem] font-semibold leading-snug',
          description: 'mt-0.5 text-sm leading-snug text-ink-2',
          actionButton:
            'ml-2 shrink-0 self-center rounded-[var(--radius-control)] bg-ink px-3 py-2 text-sm font-medium text-paper hover:bg-ink-2',
          closeButton: 'text-ink-3',
        },
      }}
    />
  )
}
