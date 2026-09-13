import type { GlossaryTerm } from './types'

/** Plain definitions. Keep each one to one or two short sentences. */
export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'attribution',
    term: 'Attribution',
    definition: 'Saying where a fact or quote came from, for example "the police said".',
  },
  {
    id: 'beat',
    term: 'Beat',
    definition: 'The subject area a reporter covers regularly, such as politics, health or entertainment.',
  },
  {
    id: 'byline',
    term: 'Byline',
    definition: 'The line that names the writer of a story.',
  },
  {
    id: 'editor',
    term: 'Editor',
    definition: 'The person who decides what a newsroom publishes and is responsible for it.',
  },
  {
    id: 'hard-news',
    term: 'Hard news',
    definition: 'Timely reporting of important events, such as a court ruling, an election result or an accident.',
  },
  {
    id: 'feature',
    term: 'Feature',
    definition: 'A longer story that explores people, places or issues in more depth. It is less tied to the day\'s events.',
  },
  {
    id: 'inverted-pyramid',
    term: 'Inverted pyramid',
    definition: 'A way of writing news with the most important facts first and the least important last.',
  },
  {
    id: 'lede',
    term: 'Lede',
    definition: 'The opening sentence or short paragraph of a news story.',
    also: 'Also called the "lead", or in British English the "intro".',
  },
  {
    id: 'news-values',
    term: 'News values',
    definition: 'The qualities that make an event likely to be reported, such as timeliness, impact and conflict.',
  },
  {
    id: 'press-release',
    term: 'Press release',
    definition: 'A statement an organisation sends to journalists to announce something. It is written to promote that organisation.',
  },
  {
    id: 'public-interest',
    term: 'Public interest',
    definition: 'Information people need to understand and take part in society. It is not the same as what the public finds interesting.',
  },
  {
    id: 'source',
    term: 'Source',
    definition: 'A person, document or record that gives a journalist information.',
  },
  {
    id: 'sub-editor',
    term: 'Sub-editor',
    definition: 'An editor who checks and improves stories before they are published, including headlines and errors.',
    also: 'Also called a copy editor.',
  },
  {
    id: 'verification',
    term: 'Verification',
    definition: 'Checking that information is true before you publish it.',
  },
  {
    id: 'wire-service',
    term: 'Wire service',
    definition: 'A news agency that sells or shares stories with many outlets, such as the News Agency of Nigeria or Reuters.',
  },
  {
    id: '5ws-and-h',
    term: 'The 5 Ws and H',
    definition: 'Who, what, when, where, why and how. The basic questions a news story answers.',
  },
]

export function getTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.id === id)
}
