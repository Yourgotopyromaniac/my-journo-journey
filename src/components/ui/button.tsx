import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--radius-control)] font-medium whitespace-nowrap transition-colors select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.125rem] [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-accent text-on-accent hover:bg-accent-strong',
        ink: 'bg-ink text-paper hover:bg-ink-2',
        secondary: 'border border-rule bg-surface text-ink hover:bg-sunken',
        ghost: 'text-ink hover:bg-sunken',
        link: 'px-0 text-accent underline-offset-4 hover:text-accent-strong hover:underline',
        danger: 'border border-accent/40 bg-surface text-accent hover:bg-accent-soft',
      },
      size: {
        md: 'min-h-11 px-4 text-[0.9375rem]',
        lg: 'min-h-12 px-5 text-base',
        sm: 'min-h-11 px-3 text-sm',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, type, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...(asChild ? {} : { type: type ?? 'button' })}
      {...props}
    />
  )
}
