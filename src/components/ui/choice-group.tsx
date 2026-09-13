import { RadioGroup } from 'radix-ui'
import { cn } from '@/lib/cn'

/** Segmented control for a small set of options, such as theme or text size. */
export function ChoiceGroup<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: { value: T; label: string }[]
}) {
  return (
    <RadioGroup.Root
      aria-label={label}
      value={value}
      onValueChange={(v) => onChange(v as T)}
      className="inline-flex flex-wrap gap-1 rounded-[var(--radius-control)] border border-rule bg-sunken p-1"
    >
      {options.map((o) => (
        <RadioGroup.Item
          key={o.value}
          value={o.value}
          className={cn(
            'min-h-10 rounded-[calc(var(--radius-control)-2px)] px-4 text-sm font-medium text-ink-2 transition-colors',
            'hover:text-ink data-[state=checked]:bg-surface data-[state=checked]:text-ink data-[state=checked]:shadow-[0_1px_2px_rgba(0,0,0,0.08)]',
          )}
        >
          {o.label}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}
