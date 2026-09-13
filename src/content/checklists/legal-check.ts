import { S } from '@/content/sources'
import type { ToolkitChecklist } from '@/content/types'

const checklist: ToolkitChecklist = {
  id: 'legal-check',
  title: 'Pre-publication legal check',
  summary:
    'Run through this before you send a story to your editor. It does not replace legal advice, but it catches the most common problems.',
  week: 6,
  groups: [
    {
      heading: 'Facts and fairness',
      items: [
        'Every serious claim is true, and I have evidence I could show: notes, recordings or documents.',
        'Every claim is clearly attributed to a named source or document.',
        'Anyone accused of wrongdoing was contacted, told what I plan to publish, and given time to respond.',
        'Their response is included, or the story says they did not reply.',
        'Opinion is clearly marked as opinion and based on facts in the story.',
        'I have not relied on the word "allegedly" to make an unproven claim safe.',
      ],
    },
    {
      heading: 'Courts and official information',
      items: [
        'If a case is going on, I only report what was said in open court, fairly and accurately.',
        'Nothing in the story suggests someone is guilty before a court decides.',
        'I have not published anything from a private hearing.',
        'If I hold documents marked secret or classified, my editor knows.',
      ],
    },
    {
      heading: 'Other people’s work and data',
      items: [
        'I took the photos myself, have permission, or the use is a fair short extract with credit.',
        'Music, video clips and quotes from other outlets are credited, and I used no more than I needed.',
        'I only include personal details that the story needs and that serve the public interest.',
        'Children, victims and vulnerable people are protected from being identified where needed.',
      ],
    },
    {
      heading: 'Online and on social media',
      items: [
        'My social media posts about the story are as accurate as the story itself.',
        'I have kept copies of my evidence in case anyone complains.',
        'My editor knows if the story is likely to anger someone powerful.',
      ],
    },
  ],
  sources: [S.carterRuckNigeria, S.criminalCode, S.copyrightAct, S.ndpaExplained, S.officialSecretsAct],
}

export default checklist
