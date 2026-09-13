import type { ToolkitChecklist } from './types'

/**
 * Quick-reference checklists. Each one is added with the week that teaches it.
 * Checklists are practical guidance; any legal or factual point must cite a source.
 */
const modules = import.meta.glob<{ default: ToolkitChecklist }>('./checklists/*.ts', { eager: true })

export const CHECKLISTS: ToolkitChecklist[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.week - b.week)

export function getChecklist(id: string): ToolkitChecklist | undefined {
  return CHECKLISTS.find((c) => c.id === id)
}
