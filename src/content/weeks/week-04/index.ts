import { lesson } from '@/content/helpers'
import { R, S } from '@/content/sources'
import type { WeekContent } from '@/content/types'

const week: WeekContent = {
  number: 4,
  overview:
    'This week you learn to interview people and build sources. You will prepare questions, listen well, record and take notes, agree ground rules, and keep yourself and the people you interview safe. By Sunday you will have done a real practice interview and started your contacts book.',
  objectives: [
    'Prepare for an interview with research and a list of open questions.',
    'Listen, follow up and check facts during an interview.',
    'Record and take notes with permission, and keep them safe.',
    'Agree ground rules such as "on the record" before an interview.',
    'Build a contacts book, and interview children and people in distress with care.',
  ],
  lessons: [
    lesson(
      {
        slug: 'preparing-for-an-interview',
        title: 'Preparing for an interview',
        summary: 'Research, a list of things you need to know, and questions that get real answers.',
        minutes: 11,
        sources: [S.newsManualCh16, S.mhmInterviewTips],
      },
      () => import('./lessons/01-preparing-for-an-interview.mdx'),
    ),
    lesson(
      {
        slug: 'during-the-interview',
        title: 'During the interview',
        summary: 'Listening, following up, and interviewing by phone, messaging, email and video.',
        minutes: 12,
        sources: [S.newsManualCh16, S.newsManualCh17, S.poynterInterviewing, S.mhmInterviewTips, S.mhmRemoteInterview],
      },
      () => import('./lessons/02-during-the-interview.mdx'),
    ),
    lesson(
      {
        slug: 'recording-notes-and-ground-rules',
        title: 'Recording, notes and ground rules',
        summary: 'Recording with permission, taking good notes, and what "off the record" really means.',
        minutes: 13,
        sources: [
          S.mhmRemoteInterview,
          S.constitutionS37,
          S.pulseRecordingCalls,
          S.nigerianCode,
          S.newsManualCh15,
          S.newsManualCh16,
          S.apTellingTheStory,
          S.mhmOffTheRecord,
          S.cpjSources,
        ],
      },
      () => import('./lessons/03-recording-notes-and-ground-rules.mdx'),
    ),
    lesson(
      {
        slug: 'sources-and-safety',
        title: 'Sources, care and safety',
        summary: 'Kinds of sources, building your contacts, interviewing with care, and staying safe.',
        minutes: 14,
        sources: [
          S.newsManualCh59,
          S.newsManualCh15,
          S.gijnInterviewing,
          S.reutersStandards,
          S.nigerianCode,
          S.childsRightAct,
          S.unicefGuidelines,
          S.gcjtVictims,
          S.mhmTrauma,
          S.iawrtSafety,
          S.cpjSources,
        ],
      },
      () => import('./lessons/04-sources-and-safety.mdx'),
    ),
  ],
  assignments: [
    {
      id: 'w4-practice-interview',
      title: 'Practice interview and write-up',
      minutes: 100,
      brief:
        'The best way to learn interviewing is to do it. Interview someone about their work or a topic they know well, then write it up as a short story.\n\nChoose someone you feel safe with, such as a family friend, a trader you know, or a lecturer. Tell them it is a practice interview for your course.',
      steps: [
        'Choose your interviewee and agree a time and place. Tell someone where you will be.',
        'Research the person and topic. Write at least 10 questions, most of them open.',
        'At the start, explain who you are and what the interview is for. Ask permission to record.',
        'Agree the ground rules: everything is on the record unless you both agree otherwise.',
        'Do the interview in 20 to 30 minutes. Follow up on at least two answers.',
        'Before you finish, check spellings of names, titles and any numbers.',
        'Type up your notes the same day. Mark the three best quotes.',
        'Write a 300 to 400 word story or profile using at least three direct quotes.',
      ],
      deliverable: 'A Google Doc with your question list, your typed notes, and a 300 to 400 word write-up with at least three quotes.',
      checklist: [
        'Most of my questions were open questions.',
        'I asked permission before recording.',
        'I followed up on at least two answers.',
        'I checked spellings and numbers before the interview ended.',
        'My write-up uses at least three exact quotes, attributed with "said".',
      ],
    },
    {
      id: 'w4-source-map',
      title: 'Source map and contacts book',
      minutes: 45,
      brief:
        'Good reporters know who to call. In this task you plan the sources for a story, then start the contacts book you will use for the rest of your career.',
      steps: [
        'Imagine you are reporting a story on rising food prices in your area.',
        'List at least eight different sources you could talk to. Include people, documents and data.',
        'For each, write one line on what they could tell you and how you would reach them.',
        'Mark each source as primary, secondary, document or expert.',
        'Create a Google Sheet called "Contacts book" with these columns: name, job title, organisation, phone, email, subject, how you met, notes.',
        'Add at least five real contacts who could help with future stories.',
      ],
      deliverable: 'A source map for the food prices story, and a contacts book in Google Sheets with at least five entries.',
      checklist: [
        'My source map has at least eight sources.',
        'It includes at least one document or data source.',
        'It includes voices from different sides, such as traders and shoppers.',
        'My contacts book has the right columns and at least five entries.',
      ],
    },
  ],
  quiz: {
    id: 'w4-checkpoint',
    title: 'Interviewing and sources',
    questions: [
      {
        id: 'q1',
        type: 'single',
        prompt: 'Which of these is an open question?',
        options: [
          { id: 'a', text: 'How did the flood affect your shop?' },
          { id: 'b', text: 'Did the flood damage your shop?' },
          { id: 'c', text: 'Is your shop still closed?' },
          { id: 'd', text: 'Were you there when the water came in?' },
        ],
        answer: 'a',
        explanation:
          'An open question invites the person to explain or describe. The others can all be answered with yes or no, which gives you less to work with.',
        lessonSlug: 'preparing-for-an-interview',
      },
      {
        id: 'q2',
        type: 'single',
        prompt: 'You have a difficult question that may make the person end the interview. When should you usually ask it?',
        options: [
          { id: 'a', text: 'Near the end, after you have asked your other important questions' },
          { id: 'b', text: 'First, to get it out of the way' },
          { id: 'c', text: 'Never, because difficult questions are rude' },
          { id: 'd', text: 'By sending it in writing before the interview' },
        ],
        answer: 'a',
        explanation:
          'Save the hardest question for near the end, so you do not lose the rest of the interview if they stop. Ask your most important questions early, and do not send questions in advance.',
        lessonSlug: 'preparing-for-an-interview',
      },
      {
        id: 'q3',
        type: 'truefalse',
        prompt: 'In a face-to-face interview, staying quiet after an answer can help the person say more.',
        answer: true,
        explanation:
          'Silence is a useful tool. People often keep talking and add something important. It works less well on the phone, where the person cannot see you waiting.',
        lessonSlug: 'during-the-interview',
      },
      {
        id: 'q4',
        type: 'single',
        prompt: 'You are interviewing someone on WhatsApp who says they are a government official. What should you do before using their answers?',
        options: [
          { id: 'a', text: 'Confirm their identity another way, such as calling a known office number.' },
          { id: 'b', text: 'Check that their profile photo looks official.' },
          { id: 'c', text: 'Nothing, because WhatsApp messages are a written record.' },
          { id: 'd', text: 'Ask them to promise they are who they say they are.' },
        ],
        answer: 'a',
        explanation:
          'Anyone can pretend to be someone else online. A written record shows what was typed, not who typed it. Check their identity through a separate, trusted channel.',
        lessonSlug: 'during-the-interview',
      },
      {
        id: 'q5',
        type: 'single',
        prompt: 'What is the safe rule for recording an interview in Nigeria?',
        options: [
          { id: 'a', text: 'Tell the person you are recording and ask if they agree before you start.' },
          { id: 'b', text: 'Record secretly, because the law allows it.' },
          { id: 'c', text: 'Only record if the person is a public official.' },
          { id: 'd', text: 'Never record interviews.' },
        ],
        answer: 'a',
        explanation:
          'Nigerian law is not clear on recording conversations, and the Nigerian code calls for open and honest means. Recording protects you, so do record, but tell people and ask first.',
        lessonSlug: 'recording-notes-and-ground-rules',
      },
      {
        id: 'q6',
        type: 'single',
        prompt: 'Halfway through an interview, a source says "this is off the record". What should you do?',
        options: [
          { id: 'a', text: 'Ask exactly what they mean, and agree the terms before they continue.' },
          { id: 'b', text: 'Publish it anyway, because they already started talking.' },
          { id: 'c', text: 'Assume it means you can use it without their name.' },
          { id: 'd', text: 'End the interview immediately.' },
        ],
        answer: 'a',
        explanation:
          'People understand "off the record" differently. Some mean "do not publish", others mean "do not name me". Stop, ask, and agree the terms clearly. Then keep your promise.',
        lessonSlug: 'recording-notes-and-ground-rules',
      },
      {
        id: 'q7',
        type: 'truefalse',
        prompt: 'Under the Nigerian code, a journalist should not identify a 14-year-old who witnessed a crime.',
        answer: true,
        explanation:
          'Article 9 says journalists should not identify or interview children under 16 involved in cases about crimes, sexual offences, or rituals or witchcraft, whether as victims, witnesses or defendants. The Child’s Rights Act protects all under-18s whose cases are in court.',
        lessonSlug: 'sources-and-safety',
      },
      {
        id: 'q8',
        type: 'multi',
        prompt: 'You are meeting a new contact for the first time. Which are safe habits? Choose all that apply.',
        options: [
          { id: 'a', text: 'Tell someone where you are going and when you expect to be back.' },
          { id: 'b', text: 'Meet in a busy public place.' },
          { id: 'c', text: 'Agree a time to send a check-in message.' },
          { id: 'd', text: 'Go to their home alone if they insist.' },
        ],
        answer: ['a', 'b', 'c'],
        explanation:
          'Telling someone your plans, meeting in public and checking in are all good habits. Avoid meeting someone at their home alone. If you feel unsure, ask for a phone interview or cancel.',
        lessonSlug: 'sources-and-safety',
      },
    ],
  },
  journalPrompt:
    'How did your practice interview go? What was one moment where you felt unsure what to ask next? What would you do differently next time?',
  resources: [R.mhmRemoteInterview, R.gijnInterviewing, R.iawrtSafety],
}

export default week
