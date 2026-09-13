import { S } from '@/content/sources'
import type { ToolkitChecklist } from '@/content/types'

const checklist: ToolkitChecklist = {
  id: 'news-story',
  title: 'News story check',
  summary: 'Run through this before you send a hard news story to an editor.',
  week: 3,
  groups: [
    {
      heading: 'The top',
      items: [
        'The headline has a subject and a verb, and is accurate.',
        'The lede says the most important thing that happened, in 30 words or fewer.',
        'The lede does not start with a date, time, venue or quote.',
        'The second paragraph supports or explains the lede.',
      ],
    },
    {
      heading: 'The body',
      items: [
        'The first direct quote comes by the third or fourth paragraph.',
        'Facts are in order of importance, with background near the end.',
        'The story answers who, what, when, where, why and how, or says what is not yet known.',
      ],
    },
    {
      heading: 'Quotes and attribution',
      items: [
        'Every quote uses the speaker’s exact words.',
        'I used "said" unless there was a clear reason not to.',
        'Every opinion, figure and accusation has a clear source.',
        'Quotes from press releases or social media say where they came from.',
      ],
    },
    {
      heading: 'Final checks',
      items: [
        'Every name, title, number and date is checked.',
        'The story follows one style for numbers, naira, dates and titles.',
        'I read the whole story again from the top.',
      ],
    },
  ],
  sources: [S.newsManualCh3, S.newsManualCh8, S.newsManualCh9, S.bbcStyleAll, S.poynterHeadlines],
}

export default checklist
