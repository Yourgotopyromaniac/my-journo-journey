import type { NewsValue, Phase, WeekOutline } from './types'

export const NEWS_VALUES: { value: NewsValue; label: string }[] = [
  { value: 'timeliness', label: 'Timeliness' },
  { value: 'proximity', label: 'Proximity' },
  { value: 'prominence', label: 'Prominence' },
  { value: 'impact', label: 'Impact' },
  { value: 'conflict', label: 'Conflict' },
  { value: 'human-interest', label: 'Human interest' },
  { value: 'novelty', label: 'Novelty' },
]

export const PROGRAMME = {
  learnerName: 'Tunmi',
  /** Monday of Week 1. */
  startDate: '2026-09-14',
  /** Monday of the fixed Christmas flex week. */
  christmasFlexStart: '2026-12-21',
  totalWeeks: 24,
  passMark: 0.75,
  diaryTarget: 5,
  /** The person who redeems treat coupons. Shown on each coupon. */
  rewardsFrom: 'Biola',
} as const

export const PHASES: Phase[] = [
  {
    number: 1,
    title: 'Foundations of journalism',
    shortTitle: 'Foundations',
    summary: 'What news is, how to write it, how to interview, and the ethics and law that guide it.',
  },
  {
    number: 2,
    title: 'Truth and verification',
    shortTitle: 'Truth and verification',
    summary: 'How to research, check facts and use numbers without being misled.',
  },
  {
    number: 3,
    title: 'Digital craft',
    shortTitle: 'Digital craft',
    summary: 'Writing for the web, features, social media, photos, video and audio.',
  },
  {
    number: 4,
    title: 'Your two beats',
    shortTitle: 'Your two beats',
    summary: 'Politics and entertainment reporting in Nigeria.',
  },
  {
    number: 5,
    title: 'Newsroom ready',
    shortTitle: 'Newsroom ready',
    summary: 'Your best work, your CV, and how to get hired.',
  },
]

export const WEEKS: WeekOutline[] = [
  {
    number: 1,
    phase: 1,
    title: 'How news works',
    summary: 'What journalism is for, how news reaches people today, and how Nigerian media is set up.',
  },
  {
    number: 2,
    phase: 1,
    title: 'News values and ledes',
    summary: 'What makes something news, the 5 Ws and H, the inverted pyramid, and writing a strong first line.',
  },
  {
    number: 3,
    phase: 1,
    title: 'Structure, quotes and style',
    summary: 'How a news story is built, how to use quotes and attribution, and why style guides matter.',
  },
  {
    number: 4,
    phase: 1,
    title: 'Interviewing',
    summary: 'Preparing questions, listening well, taking notes, and building sources.',
  },
  {
    number: 5,
    phase: 1,
    title: 'Ethics',
    summary: 'The Nigerian code of ethics, "brown envelopes", conflicts of interest and avoiding harm.',
  },
  {
    number: 6,
    phase: 1,
    title: 'Media law in Nigeria',
    summary: 'Press freedom, defamation, the FOI Act, cybercrime law, copyright and data protection.',
  },
  {
    number: 7,
    phase: 2,
    title: 'Research and records',
    summary: 'Primary and secondary sources, smart searching, and public records in Nigeria.',
  },
  {
    number: 8,
    phase: 2,
    title: 'Fact-checking',
    summary: 'Checking claims, images and videos, and spotting fakes.',
  },
  {
    number: 9,
    phase: 2,
    title: 'Numbers for journalists',
    summary: 'Percentages, averages, inflation and misleading charts.',
  },
  {
    number: 10,
    phase: 3,
    title: 'Writing for the web',
    summary: 'Web writing, headlines, SEO basics and publishing in a CMS.',
  },
  {
    number: 11,
    phase: 3,
    title: 'Features and profiles',
    summary: 'The nut graf, setting a scene, and writing about people.',
  },
  {
    number: 12,
    phase: 3,
    title: 'Social media and safety',
    summary: 'Finding stories on social media, staying safe online, and handling harassment.',
  },
  {
    number: 13,
    phase: 3,
    title: 'Photos and charts',
    summary: 'Taking and captioning news photos, simple graphics and charts.',
  },
  {
    number: 14,
    phase: 3,
    title: 'Mobile video',
    summary: 'Filming and editing short news videos on a tablet or phone.',
  },
  {
    number: 15,
    phase: 3,
    title: 'Audio and AI tools',
    summary: 'Recording audio reports, and using AI tools with care.',
  },
  {
    number: 16,
    phase: 3,
    title: 'Core skills capstone',
    summary: 'One full reported story that uses everything so far.',
  },
  {
    number: 17,
    phase: 4,
    track: 'Politics',
    title: 'How Nigeria is governed',
    summary: 'The constitution, arms and tiers of government, and key institutions.',
  },
  {
    number: 18,
    phase: 4,
    track: 'Politics',
    title: 'Covering elections',
    summary: 'Campaigns, polls, election day, and fact-checking politicians.',
  },
  {
    number: 19,
    phase: 4,
    track: 'Politics',
    title: 'Following the money',
    summary: 'Budgets, FOI requests in practice, and accountability stories.',
  },
  {
    number: 20,
    phase: 4,
    track: 'Entertainment',
    title: 'The entertainment industries',
    summary: 'How Nollywood, Afrobeats, reality TV and creators make money.',
  },
  {
    number: 21,
    phase: 4,
    track: 'Entertainment',
    title: 'Entertainment reporting',
    summary: 'Interviews, reviews, profiles and event coverage.',
  },
  {
    number: 22,
    phase: 4,
    track: 'Entertainment',
    title: 'Ethics and the crossover',
    summary: 'PR pressure, rumours and privacy, rights, and where politics meets entertainment.',
  },
  {
    number: 23,
    phase: 5,
    title: 'Beat capstone',
    summary: 'One politics piece and one entertainment piece, and choosing your best work.',
  },
  {
    number: 24,
    phase: 5,
    title: 'Getting hired',
    summary: 'How newsrooms hire, your CV, pitching, and interviews.',
  },
]

export function getWeekOutline(number: number): WeekOutline | undefined {
  return WEEKS.find((w) => w.number === number)
}

export function getPhase(number: number): Phase | undefined {
  return PHASES.find((p) => p.number === number)
}

export function weeksInPhase(phase: number): WeekOutline[] {
  return WEEKS.filter((w) => w.phase === phase)
}

export function isLastWeekOfPhase(week: number): boolean {
  const outline = getWeekOutline(week)
  if (!outline) return false
  const inPhase = weeksInPhase(outline.phase)
  return inPhase[inPhase.length - 1]?.number === week
}
