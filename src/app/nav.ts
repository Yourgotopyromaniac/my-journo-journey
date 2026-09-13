import { BookOpen, House, Map, Newspaper, NotebookPen, Search, SlidersHorizontal, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  short: string
  icon: LucideIcon
  end?: boolean
  /** Phones have room for six items in the bottom bar. Search lives in the Toolkit there. */
  inBottomBar?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Today', short: 'Today', icon: House, end: true, inBottomBar: true },
  { to: '/roadmap', label: 'Roadmap', short: 'Roadmap', icon: Map, inBottomBar: true },
  { to: '/journal', label: 'Journal', short: 'Journal', icon: NotebookPen, inBottomBar: true },
  { to: '/diary', label: 'News diary', short: 'Diary', icon: Newspaper, inBottomBar: true },
  { to: '/toolkit', label: 'Toolkit', short: 'Toolkit', icon: BookOpen, inBottomBar: true },
  { to: '/search', label: 'Search', short: 'Search', icon: Search },
]

export const SETTINGS_ITEM: NavItem = {
  to: '/settings',
  label: 'Settings',
  short: 'Settings',
  icon: SlidersHorizontal,
  inBottomBar: true,
}
