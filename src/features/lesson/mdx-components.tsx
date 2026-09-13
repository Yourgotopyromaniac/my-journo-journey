import { ExternalLink, Info, Lightbulb, MapPin, PencilLine, TriangleAlert } from 'lucide-react'
import type { MDXComponents } from 'mdx/types'
import { Popover } from 'radix-ui'
import { Children, isValidElement, type ComponentProps, type ReactNode } from 'react'
import { getTerm } from '@/content/glossary'
import { cn } from '@/lib/cn'

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function textOf(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(textOf).join('')
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children)
  return ''
}

function H2({ children, ...props }: ComponentProps<'h2'>) {
  return (
    <h2 id={slugify(textOf(children))} data-section {...props}>
      {children}
    </h2>
  )
}

const calloutStyles = {
  practice: { label: 'In practice', icon: Lightbulb },
  nigeria: { label: 'In Nigeria', icon: MapPin },
  watch: { label: 'Watch out', icon: TriangleAlert },
  note: { label: 'Note', icon: Info },
} as const

export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: keyof typeof calloutStyles
  title?: string
  children: ReactNode
}) {
  const style = calloutStyles[type]
  const Icon = style.icon
  return (
    <aside
      className={cn(
        'not-prose rounded-[var(--radius-box)] border px-5 py-4 font-sans',
        type === 'watch' ? 'border-warning/30 bg-warning-soft/60' : 'border-rule-soft bg-sunken/60',
      )}
    >
      <div className="flex items-center gap-2 text-[0.8125rem] font-semibold text-ink">
        <Icon className={cn('size-4', type === 'watch' ? 'text-warning' : 'text-accent')} aria-hidden strokeWidth={1.9} />
        {title ?? style.label}
      </div>
      <div className="mt-1.5 font-serif text-[1.0625rem] leading-relaxed text-ink [&>p+p]:mt-2">{children}</div>
    </aside>
  )
}

export function Compare({
  items,
  note,
}: {
  items: { label: string; text: string; good?: boolean }[]
  note?: string
}) {
  return (
    <figure className="font-sans">
      <div className="overflow-hidden rounded-[var(--radius-box)] border border-rule-soft bg-surface">
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              'grid gap-1 px-5 py-4 sm:grid-cols-[6rem_1fr] sm:gap-4',
              i > 0 && 'border-t border-rule-soft',
              item.good && 'bg-accent-soft/35',
            )}
          >
            <div className={cn('pt-0.5 text-xs font-semibold', item.good ? 'text-accent' : 'text-ink-3')}>{item.label}</div>
            <div className="font-serif text-[1.0625rem] leading-relaxed">{item.text}</div>
          </div>
        ))}
      </div>
      {note ? <figcaption className="mt-2 text-xs text-ink-3">{note}</figcaption> : null}
    </figure>
  )
}

export function Try({ title = 'Try it', children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="rounded-[var(--radius-box)] border border-dashed border-rule bg-surface px-5 py-4 font-sans">
      <div className="flex items-center gap-2 text-[0.8125rem] font-semibold">
        <PencilLine className="size-4 text-accent" aria-hidden strokeWidth={1.9} />
        {title}
      </div>
      <div className="mt-1.5 font-serif text-[1.0625rem] leading-relaxed [&_li+li]:mt-1 [&_ol]:list-decimal [&_ol]:pl-5 [&>*+*]:mt-2">
        {children}
      </div>
    </aside>
  )
}

export function Term({ id, children }: { id: string; children: ReactNode }) {
  const term = getTerm(id)
  if (!term) return <>{children}</>
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="cursor-help text-inherit underline decoration-accent decoration-dotted decoration-[1.5px] underline-offset-[5px] hover:text-accent-strong"
        >
          {children}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={6}
          collisionPadding={16}
          className="z-50 w-[min(19rem,calc(100vw-2rem))] rounded-[var(--radius-box)] bg-ink px-4 py-3 text-paper shadow-[0_12px_30px_rgba(0,0,0,0.2)] focus:outline-none"
        >
          <div className="text-[0.8125rem] font-semibold">{term.term}</div>
          <p className="mt-1 text-[0.8125rem] leading-relaxed opacity-85">{term.definition}</p>
          {term.also ? <p className="mt-1 text-[0.8125rem] leading-relaxed opacity-85">{term.also}</p> : null}
          <Popover.Arrow className="fill-ink" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function Resource({
  href,
  title,
  publisher,
  minutes,
  children,
}: {
  href: string
  title: string
  publisher: string
  minutes?: number
  children?: ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-start gap-3 rounded-[var(--radius-box)] border border-rule-soft bg-surface px-5 py-4 font-sans no-underline! hover:bg-sunken/60"
    >
      <div className="min-w-0 flex-1">
        <div className="text-[0.9375rem] font-semibold text-ink">{title}</div>
        <div className="mt-0.5 text-xs text-ink-3">
          {publisher}
          {minutes ? ` · ${minutes} min` : ''} · Opens in a new tab
        </div>
        {Children.count(children) ? <div className="mt-1.5 text-sm text-ink-2">{children}</div> : null}
      </div>
      <ExternalLink className="mt-1 size-4 shrink-0 text-ink-3" aria-hidden />
    </a>
  )
}

/** Inverted pyramid: widest band (most important) at the top. */
export function Pyramid({ layers }: { layers: { label: string; detail: string }[] }) {
  const n = layers.length
  return (
    <figure className="font-sans" aria-label="Inverted pyramid diagram">
      <div className="flex flex-col items-center gap-1">
        {layers.map((layer, i) => {
          const top = 100 - (i / n) * 70
          const bottom = 100 - ((i + 1) / n) * 70
          const inset = (100 - bottom) / 2
          const insetTop = (100 - top) / 2
          return (
            <div
              key={layer.label}
              className={cn('flex w-full flex-col items-center justify-center px-[18%] py-3 text-center', i === 0 ? 'bg-ink text-paper' : i === 1 ? 'bg-ink-2 text-paper' : 'bg-sunken text-ink')}
              style={{ clipPath: `polygon(${insetTop}% 0, ${100 - insetTop}% 0, ${100 - inset}% 100%, ${inset}% 100%)`, minHeight: '4.25rem' }}
            >
              <div className="text-sm font-semibold">{layer.label}</div>
              <div className={cn('text-xs leading-snug', i < 2 ? 'opacity-80' : 'text-ink-2')}>{layer.detail}</div>
            </div>
          )
        })}
      </div>
      <figcaption className="mt-2 text-center text-xs text-ink-3">Most important at the top. Least important at the bottom.</figcaption>
    </figure>
  )
}

function A({ href = '', ...props }: ComponentProps<'a'>) {
  const external = /^https?:/.test(href)
  return <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...props} />
}

export const mdxComponents: MDXComponents = { h2: H2, a: A, Callout, Compare, Try, Term, Resource, Pyramid }
