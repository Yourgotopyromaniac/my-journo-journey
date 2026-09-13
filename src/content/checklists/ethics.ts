import { S } from '@/content/sources'
import type { ToolkitChecklist } from '@/content/types'

const checklist: ToolkitChecklist = {
  id: 'ethics',
  title: 'Ethics check',
  summary: 'Questions to ask yourself before you publish, especially on sensitive stories.',
  week: 5,
  groups: [
    {
      heading: 'Truth and fairness',
      items: [
        'Everything is as accurate as I can make it, and facts are kept separate from comment.',
        'People I report on had a real chance to reply.',
        'I have not relied on one unchecked source for a serious claim.',
        'The headline matches what the story can prove.',
      ],
    },
    {
      heading: 'Independence',
      items: [
        'I did not accept money, gifts or favours from anyone in the story.',
        'I have no personal, financial or political interest in the story, or I have told my editor.',
        'No one outside the newsroom decided what I wrote.',
      ],
    },
    {
      heading: 'Harm',
      items: [
        'Any private information serves the public interest.',
        'No child is identified where they should be protected.',
        'Survivors of violence cannot be identified from details in the story.',
        'I approached grieving or shocked people with care, and respected a "no".',
        'I only mention ethnicity or religion where it is truly relevant.',
        'If the story involves suicide, I followed the WHO guidance and included where to get help.',
      ],
    },
    {
      heading: 'Honesty',
      items: [
        'Other people’s work is credited.',
        'If I find a mistake after publishing, I will tell my editor and correct it clearly.',
      ],
    },
  ],
  sources: [S.nigerianCode, S.ejnPrinciples, S.whoSuicide2023, S.cjidGbvHandbook, S.apiCorrections],
}

export default checklist
