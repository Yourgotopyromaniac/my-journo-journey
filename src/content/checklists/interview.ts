import { S } from '@/content/sources'
import type { ToolkitChecklist } from '@/content/types'

const checklist: ToolkitChecklist = {
  id: 'interview',
  title: 'Interview check',
  summary: 'Use this before, during and after any interview.',
  week: 4,
  groups: [
    {
      heading: 'Before',
      items: [
        'I read what has already been reported and looked up the person.',
        'I have a list of the things I need to know, with my three most important questions marked.',
        'Most of my questions are open questions.',
        'My tablet or phone is charged, with space to record, and I have a notebook as backup.',
        'I agreed a safe meeting place, and someone knows where I am going and when I will be back.',
      ],
    },
    {
      heading: 'At the start',
      items: [
        'I said who I am and what the interview is for.',
        'I asked permission to record.',
        'We agreed the ground rules. If anything is off the record, I asked exactly what that means.',
      ],
    },
    {
      heading: 'During',
      items: [
        'I asked one question at a time and listened to the answers.',
        'I followed up on vague answers and politely asked again when a question was avoided.',
        'I checked the spelling of names, titles and any numbers.',
        'I asked: "Is there anything else I should know?"',
        'I know how to contact them again.',
      ],
    },
    {
      heading: 'After',
      items: [
        'I typed up my notes the same day and marked the best quotes.',
        'My notes and recording are stored safely.',
        'I added the person to my contacts book.',
      ],
    },
  ],
  sources: [S.newsManualCh16, S.mhmInterviewTips, S.apTellingTheStory, S.iawrtSafety],
}

export default checklist
