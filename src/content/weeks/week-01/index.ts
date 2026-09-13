import { lesson } from '@/content/helpers'
import { R, S } from '@/content/sources'
import type { WeekContent } from '@/content/types'

const week: WeekContent = {
  number: 1,
  overview:
    'Welcome to Week 1. This week you learn what journalism is for, how Nigerians get their news today, and how Nigeria’s media is set up. You will also meet the people who work in a newsroom, and start the news diary you will keep for the whole course.',
  objectives: [
    'Explain what journalism is for, using at least three core principles.',
    'Describe how many Nigerians get news today, and one limit of that data.',
    'Name the main types of Nigerian news outlets, with an example of each.',
    'Say what the NBC, the Nigerian Press Council, the NUJ and NAN do.',
    'Describe the main newsroom roles and how a story moves from idea to publication.',
  ],
  lessons: [
    lesson(
      {
        slug: 'what-journalism-is-for',
        title: 'What journalism is for',
        summary: 'Anyone can share information. These are the principles that make journalism different.',
        minutes: 12,
        sources: [S.ejnPrinciples, S.elementsOfJournalism, S.nigerianCode, S.codeAdoption],
      },
      () => import('./lessons/01-what-journalism-is-for.mdx'),
    ),
    lesson(
      {
        slug: 'how-news-reaches-people',
        title: 'How news reaches people today',
        summary: 'News now moves through phones, apps and messaging groups. Here is what that looks like in Nigeria.',
        minutes: 12,
        sources: [S.dnrNigeria2026],
      },
      () => import('./lessons/02-how-news-reaches-people.mdx'),
    ),
    lesson(
      {
        slug: 'nigerias-media',
        title: 'How Nigeria’s media is set up',
        summary: 'Newspapers, broadcasters, digital outlets, fact-checkers, and the bodies that regulate them.',
        minutes: 15,
        sources: [
          S.nta,
          S.frcn,
          S.von,
          S.premiumTimes,
          S.nan,
          S.dubawa,
          S.factCheckHub,
          S.nbc,
          S.pressCouncilAbout,
          S.nuj,
          S.nge,
          S.dnrNigeria2026,
        ],
      },
      () => import('./lessons/03-nigerias-media.mdx'),
    ),
    lesson(
      {
        slug: 'who-does-what',
        title: 'Who does what in a newsroom',
        summary: 'Reporters, sub-editors, editors and more, and how a story travels from idea to publication.',
        minutes: 10,
        sources: [S.mhmRoles, S.gouwsRoles, S.pressGazetteJargon],
      },
      () => import('./lessons/04-who-does-what.mdx'),
    ),
  ],
  assignments: [
    {
      id: 'w1-media-audit',
      title: 'Media audit of five Nigerian outlets',
      minutes: 90,
      brief:
        'Before you can work in Nigerian media, you need to know it well. In this audit you study five different outlets, then compare how two of them covered the same story.\n\nTake your time. You will come back to this document when you choose where to apply for jobs.',
      steps: [
        'Create a new Google Doc called "Week 1: Media audit".',
        'Choose five outlets of different types: a newspaper, a TV or radio station, a digital-native outlet, a fact-checker, and one more of your choice.',
        'For each outlet, visit its website and social media. Fill in the questions below.',
        'Find one news story from today that at least two of your outlets covered.',
        'Compare the two versions: the headline, the first sentence, the sources they quote, and anything one has that the other does not.',
        'Finish with a reflection of about 300 words. Which outlet would you most like to work for, and why?',
      ],
      materials: [
        {
          title: 'Questions for each outlet',
          ordered: true,
          items: [
            'What type of outlet is it: newspaper, broadcaster, digital-native, fact-checker or other?',
            'Who owns or runs it? Check the "About us" page. If you cannot find out, write that down.',
            'Who do you think its audience is?',
            'What topics does it cover most?',
            'What formats does it use: articles, video, audio, social posts, newsletters?',
            'How often does it publish, and how quickly did it cover today’s biggest story?',
            'Does it cover politics, entertainment, or both? How?',
          ],
        },
      ],
      deliverable:
        'A Google Doc with notes on five outlets, a comparison of one story covered by two of them, and a 300-word reflection.',
      checklist: [
        'I chose five outlets of different types.',
        'I answered every question for each outlet, or said where I could not find the answer.',
        'I compared the same story from two outlets.',
        'My comparison looks at headlines, first sentences and sources.',
        'I wrote a reflection of about 300 words.',
      ],
    },
    {
      id: 'w1-news-diary',
      title: 'Start your news diary',
      minutes: 30,
      brief:
        'Journalists read, watch and listen to a lot of news. Your news diary builds that habit, and trains your eye for what makes a story work.\n\nYou will keep this diary for the whole course. Aim for five entries a week. Each one takes a few minutes.',
      steps: [
        'Open News diary from the menu.',
        'Add at least five stories this week. Try to use at least three different outlets.',
        'For each story, write where you saw it and one or two sentences on why it caught your attention.',
        'Include at least one story that reached you through WhatsApp or social media. Can you find which outlet first reported it?',
        'Skip the news values for now if you are not sure. You learn them in Week 2.',
      ],
      deliverable: 'At least five entries in your news diary, from at least three different outlets.',
      checklist: [
        'I added at least five stories.',
        'My stories come from at least three different outlets.',
        'Each entry says why the story caught my attention.',
        'I tried to trace one social media story back to the outlet that first reported it.',
      ],
    },
  ],
  quiz: {
    id: 'w1-checkpoint',
    title: 'How news works',
    questions: [
      {
        id: 'q1',
        type: 'single',
        prompt: 'According to Kovach and Rosenstiel in The Elements of Journalism, what is journalism’s first obligation?',
        options: [
          { id: 'a', text: 'To the truth' },
          { id: 'b', text: 'To be first with the news' },
          { id: 'c', text: 'To the people who own the outlet' },
          { id: 'd', text: 'To the government' },
        ],
        answer: 'a',
        explanation:
          'Their first element is that journalism’s first obligation is to the truth. Its first loyalty is to citizens. Speed matters, but never more than being right.',
        lessonSlug: 'what-journalism-is-for',
      },
      {
        id: 'q2',
        type: 'truefalse',
        prompt: 'If a story has been shared by many people on WhatsApp, it is probably true.',
        answer: false,
        explanation:
          'How widely something is shared tells you nothing about whether it is true. False stories spread fast too. A claim you see on WhatsApp is a tip to check, not news to repeat.',
        lessonSlug: 'how-news-reaches-people',
      },
      {
        id: 'q3',
        type: 'single',
        prompt:
          'The Digital News Report 2026 found that 68% of the Nigerians it surveyed trust most news most of the time. Why should you be careful when you quote this number?',
        options: [
          { id: 'a', text: 'The survey only asked English-speaking internet users aged 18 to 50, not all Nigerians.' },
          { id: 'b', text: 'The survey only asked journalists.' },
          { id: 'c', text: 'The survey is more than ten years old.' },
          { id: 'd', text: 'Trust cannot be measured in a survey.' },
        ],
        answer: 'a',
        explanation:
          'The report says its sample is younger, richer, better educated and more urban than most Nigerians. So you should say who was surveyed, and not claim the number is true for all Nigerians.',
        lessonSlug: 'how-news-reaches-people',
      },
      {
        id: 'q4',
        type: 'single',
        prompt: 'Which body licenses and regulates radio and TV broadcasting in Nigeria?',
        options: [
          { id: 'a', text: 'The National Broadcasting Commission (NBC)' },
          { id: 'b', text: 'The Nigerian Press Council' },
          { id: 'c', text: 'The Nigeria Union of Journalists (NUJ)' },
          { id: 'd', text: 'The News Agency of Nigeria (NAN)' },
        ],
        answer: 'a',
        explanation:
          'The NBC regulates broadcasting. The Press Council deals with standards and complaints about the press, the NUJ is the journalists’ union, and NAN is a news agency.',
        lessonSlug: 'nigerias-media',
      },
      {
        id: 'q5',
        type: 'single',
        prompt: 'Which organisation publishes the Code of Ethics for Nigerian Journalists and handles complaints against the press?',
        options: [
          { id: 'a', text: 'The Nigerian Press Council' },
          { id: 'b', text: 'The National Broadcasting Commission' },
          { id: 'c', text: 'Voice of Nigeria' },
          { id: 'd', text: 'Dubawa' },
        ],
        answer: 'a',
        explanation:
          'The Nigerian Press Council promotes standards in the press, handles complaints against the press, and publishes the Code of Ethics on its website.',
        lessonSlug: 'nigerias-media',
      },
      {
        id: 'q6',
        type: 'multi',
        prompt: 'Which of these are fact-checking organisations working in Nigeria? Choose all that apply.',
        options: [
          { id: 'a', text: 'Dubawa' },
          { id: 'b', text: 'FactCheckHub' },
          { id: 'c', text: 'Africa Check' },
          { id: 'd', text: 'News Agency of Nigeria' },
        ],
        answer: ['a', 'b', 'c'],
        explanation:
          'Dubawa (from CJID), FactCheckHub (from The ICIR) and Africa Check all fact-check claims in Nigeria. The News Agency of Nigeria is a government news agency that supplies stories to other outlets.',
        lessonSlug: 'nigerias-media',
      },
      {
        id: 'q7',
        type: 'single',
        prompt: 'In a newsroom, who checks a reporter’s story for errors of fact, grammar and style before it is published?',
        options: [
          { id: 'a', text: 'The sub-editor' },
          { id: 'b', text: 'The correspondent' },
          { id: 'c', text: 'The producer' },
          { id: 'd', text: 'The beat reporter' },
        ],
        answer: 'a',
        explanation:
          'Sub-editors, also called copy editors, check and improve stories before they go out. They fix errors, trim stories to length and often write headlines.',
        lessonSlug: 'who-does-what',
      },
      {
        id: 'q8',
        type: 'order',
        prompt: 'Put these steps in the order a news story usually moves through a newsroom.',
        items: [
          { id: 'report', text: 'The reporter gathers facts and does interviews' },
          { id: 'write', text: 'The reporter writes the story' },
          { id: 'sub', text: 'A sub-editor checks and edits it' },
          { id: 'approve', text: 'An editor approves it for publication' },
        ],
        explanation:
          'Reporting comes first, then writing. A sub-editor checks the story, and an editor gives final approval before it is published.',
        lessonSlug: 'who-does-what',
      },
    ],
  },
  journalPrompt:
    'Why do you want to be a journalist? Think of one story that made a difference to people. What did the journalist do that mattered?',
  resources: [R.dnrNigeria, R.nigerianCode, R.gniFundamentals],
}

export default week
