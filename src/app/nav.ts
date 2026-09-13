import { BookOpen, House, Map, Newspaper, NotebookPen, SlidersHorizontal, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  short: string
  icon: LucideIcon
  end?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Today', short: 'Today', icon: House, end: true },
  { to: '/roadmap', label: 'Roadmap', short: 'Roadmap', icon: Map },
  { to: '/journal', label: 'Journal', short: 'Journal', icon: NotebookPen },
  { to: '/diary', label: 'News diary', short: 'Diary', icon: Newspaper },
  { to: '/toolkit', label: 'Toolkit', short: 'Toolkit', icon: BookOpen },
]

export const SETTINGS_ITEM: NavItem = { to: '/settings', label: 'Settings', short: 'Settings', icon: SlidersHorizontal }
