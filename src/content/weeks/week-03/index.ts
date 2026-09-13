import { lesson } from '@/content/helpers'
import { R, S } from '@/content/sources'
import type { WeekContent } from '@/content/types'

const week: WeekContent = {
  number: 3,
  overview:
    'This week you build a full news story around your lede. You learn what goes in each paragraph, how to use quotes without changing them, how to say where information came from, and how style guides and headlines work. By Sunday you will write a complete hard news story.',
  objectives: [
    'Name the main parts of a hard news story and put them in a sensible order.',
    'Use direct quotes, reported speech and partial quotes correctly.',
    'Attribute information with neutral words, and know what needs attribution.',
    'Explain what a style guide is and follow one consistently.',
    'Write a clear, accurate news headline.',
  ],
  lessons: [
    lesson(
      {
        slug: 'how-a-news-story-is-built',
        title: 'How a news story is built',
        summary: 'The parts of a hard news story after the lede, and the order they usually go in.',
        minutes: 10,
        sources: [S.newsManualCh3, S.newsManualCh6, S.newsManualCh8, S.zamithQuotes, S.mhmStoryElements],
      },
      () => import('./lessons/01-how-a-news-story-is-built.mdx'),
    ),
    lesson(
      {
        slug: 'using-quotes',
        title: 'Using quotes well',
        summary: 'Direct quotes, reported speech and partial quotes, and the rule you must never break.',
        minutes: 12,
        sources: [S.reutersStandards, S.apTellingTheStory, S.newsManualCh8, S.zamithQuotes, S.mhmQuotes, S.mhmPressReleases],
      },
      () => import('./lessons/02-using-quotes.mdx'),
    ),
    lesson(
      {
        slug: 'attribution',
        title: 'Attribution',
        summary: 'How to say where information came from, which words to use, and how to handle unnamed sources.',
        minutes: 14,
        sources: [
          S.bbcStyleAll,
          S.newsManualCh9,
          S.mhmAttribution,
          S.reutersStandards,
          S.apTellingTheStory,
          S.nigerianCode,
        ],
      },
      () => import('./lessons/03-attribution.mdx'),
    ),
    lesson(
      {
        slug: 'style-and-headlines',
        title: 'Style guides and headlines',
        summary: 'Why newsrooms have house styles, how Nigerian outlets differ, and how to write a good headline.',
        minutes: 13,
        sources: [
          S.mhmSubEditor,
          S.bbcStyleNumbers,
          S.bbcStyleNames,
          S.guardianStyleH,
          S.premiumTimesExample,
          S.punchExample,
          S.cambridgeHeadlines,
          S.poynterHeadlines,
        ],
      },
      () => import('./lessons/04-style-and-headlines.mdx'),
    ),
  ],
  assignments: [
    {
      id: 'w3-news-story',
      title: 'Write a hard news story',
      minutes: 80,
      brief:
        'In this task you write a full hard news story of 300 to 400 words from a set of made-up facts and quotes, as if you had attended a press conference.\n\nUse everything from Weeks 2 and 3: a strong lede, inverted pyramid order, early quotes and neutral attribution.',
      steps: [
        'Create a new Google Doc called "Week 3: News story".',
        'Read all the notes below. Decide what the news is.',
        'Write a lede of no more than 30 words.',
        'Write a second paragraph that supports the lede.',
        'Bring in your first direct quote by the third or fourth paragraph.',
        'Add the remaining facts and quotes in order of importance, with background near the end.',
        'Write a headline in the present tense.',
        'Use the News story checklist in the Toolkit before you mark this done.',
      ],
      materials: [
        {
          title: 'Your notes from a press conference',
          note: 'Made up for practice. All names, places and figures are invented.',
          items: [
            'Event: press conference at the Ogun State Ministry of Health, Abeokuta, on Monday morning.',
            'The state commissioner for health spoke. For this exercise, refer to her as "the commissioner".',
            'From next Monday, pregnant women and children under five will get free treatment at 12 general hospitals in the state.',
            'The programme will cost N1.8 billion in its first year.',
            'It will be paid for from the state budget and a grant from an international health charity.',
            'Quote from the commissioner: "Too many mothers delay going to hospital because they cannot pay. This removes that barrier."',
            'Quote from the commissioner: "We will publish a list of the hospitals on our website today."',
            'Asked how long the programme will last, the commissioner said it is planned for three years, "subject to funding".',
            'A nurse at one of the hospitals, Mrs Kemi Olatunji, spoke to you after the event.',
            'Quote from the nurse: "Some women come to us only when it is already an emergency. If this works, it will save lives."',
            'Background: the state had a similar programme in 2019 that ended after one year when funding ran out.',
            'The commissioner did not say how many patients the hospitals can take.',
          ],
        },
      ],
      deliverable: 'A Google Doc with your headline and a 300 to 400 word hard news story.',
      checklist: [
        'My lede says what changes and for whom, in 30 words or fewer.',
        'I did not start the story with a quote.',
        'My first direct quote comes by the third or fourth paragraph.',
        'I used "said" for attribution, and did not change any quote.',
        'Background about the 2019 programme is near the end.',
        'I noted what the commissioner did not say.',
      ],
    },
    {
      id: 'w3-style-sheet',
      title: 'Your style sheet and headline rewrite',
      minutes: 40,
      brief:
        'Every newsroom has its own style. In this task you compare how three Nigerian outlets write, then choose your own style to use until you join a newsroom.',
      steps: [
        'Create a new Google Doc called "Week 3: Style sheet".',
        'Choose three Nigerian news outlets. Find one recent story from each.',
        'For each story, note how it writes: naira amounts, numbers under 10, dates, and names and titles after first mention.',
        'Write your own style sheet: one rule for each of those four things.',
        'Find five headlines you think are weak. Rewrite each one to be clear, accurate and in the present tense.',
      ],
      deliverable: 'A Google Doc with notes on three outlets, your own four-rule style sheet, and five rewritten headlines.',
      checklist: [
        'I noted how three outlets handle naira, numbers, dates and titles.',
        'My style sheet has one clear rule for each.',
        'Each rewritten headline has a subject and a verb.',
        'None of my headlines is misleading or clickbait.',
      ],
    },
  ],
  quiz: {
    id: 'w3-checkpoint',
    title: 'Structure, quotes and style',
    questions: [
      {
        id: 'q1',
        type: 'truefalse',
        prompt: 'A strong quote is a good way to start a hard news story.',
        answer: false,
        explanation:
          'Start with the news, not a quote. Readers need to know what happened first. Bring in a strong quote soon after, usually by the third or fourth paragraph.',
        lessonSlug: 'how-a-news-story-is-built',
      },
      {
        id: 'q2',
        type: 'order',
        prompt: 'Put these parts of a hard news story in the usual order, from top to bottom.',
        items: [
          { id: 'headline', text: 'Headline' },
          { id: 'lede', text: 'Lede' },
          { id: 'support', text: 'Paragraph that supports the lede' },
          { id: 'quote', text: 'First direct quote' },
          { id: 'background', text: 'Background' },
        ],
        explanation:
          'The headline sits on top, then the lede. The next paragraph supports it, the first quote comes early, and background usually goes near the end.',
        lessonSlug: 'how-a-news-story-is-built',
      },
      {
        id: 'q3',
        type: 'single',
        prompt: 'A local councillor gives you a quote with a small grammar mistake. What is the safest thing to do?',
        options: [
          { id: 'a', text: 'Use reported speech to give the meaning in your own words.' },
          { id: 'b', text: 'Fix the grammar and keep it in quotation marks.' },
          { id: 'c', text: 'Rewrite the quote so it sounds better.' },
          { id: 'd', text: 'Add "[sic]" and a note that the councillor made an error.' },
        ],
        answer: 'a',
        explanation:
          'Words in quotation marks must be the speaker’s own. Guides differ on small grammar fixes, so the safe choice is reported speech, which keeps the meaning without changing a quote.',
        lessonSlug: 'using-quotes',
      },
      {
        id: 'q4',
        type: 'single',
        prompt: 'Which attribution is the most neutral?',
        context: 'The police spokesman ______ that three suspects had been arrested.',
        options: [
          { id: 'a', text: 'said' },
          { id: 'b', text: 'claimed' },
          { id: 'c', text: 'admitted' },
          { id: 'd', text: 'insisted' },
        ],
        answer: 'a',
        explanation:
          '"Said" is neutral. "Claimed" suggests you doubt it, "admitted" suggests a confession, and "insisted" suggests someone is arguing. Use "said" unless there is a clear reason not to.',
        lessonSlug: 'attribution',
      },
      {
        id: 'q5',
        type: 'single',
        prompt: 'A press release quotes a company’s managing director. How should you use the quote?',
        options: [
          { id: 'a', text: 'Say it came from a statement, for example "the managing director said in a statement".' },
          { id: 'b', text: 'Write it as if the managing director said it to you in an interview.' },
          { id: 'c', text: 'Use it without any attribution, because press releases are public.' },
          { id: 'd', text: 'Change some words so it does not look copied.' },
        ],
        answer: 'a',
        explanation:
          'Press release quotes are usually written by PR staff. Be honest with readers about where the words came from, and never change the words inside the quotation marks.',
        lessonSlug: 'using-quotes',
      },
      {
        id: 'q6',
        type: 'multi',
        prompt: 'Which of these always need attribution? Choose all that apply.',
        options: [
          { id: 'a', text: 'An opinion about a government policy' },
          { id: 'b', text: 'A new figure for the number of people affected by a flood' },
          { id: 'c', text: 'An accusation that someone broke the law' },
          { id: 'd', text: 'The date of Independence Day' },
        ],
        answer: ['a', 'b', 'c'],
        explanation:
          'Opinions, specific figures and accusations must have a clear source. Common knowledge, like the date of a public holiday, does not always need one.',
        lessonSlug: 'attribution',
      },
      {
        id: 'q7',
        type: 'truefalse',
        prompt: 'If you write "according to a source", you are legally protected if the claim turns out to be false.',
        answer: false,
        explanation:
          'Attribution tells readers where information came from, but it is no defence against defamation. You still have to check that damaging claims are true.',
        lessonSlug: 'attribution',
      },
      {
        id: 'q8',
        type: 'single',
        prompt: 'Which is the best news headline?',
        options: [
          { id: 'a', text: 'Ogun to offer free hospital care for pregnant women and young children' },
          { id: 'b', text: 'You won’t believe what Ogun is doing for mothers!' },
          { id: 'c', text: 'Health: an important development in Ogun State' },
          { id: 'd', text: 'Ogun State Ministry of Health held a press conference on Monday' },
        ],
        answer: 'a',
        explanation:
          'Option A says who is doing what, clearly and accurately. B is clickbait, C says nothing, and D describes an event instead of the news.',
        lessonSlug: 'style-and-headlines',
      },
    ],
  },
  journalPrompt:
    'Look at a story from your news diary. How many times did the writer use "said", and what other verbs did they use? Did any of those verbs change how you felt about the person speaking?',
  resources: [R.newsManualQuotes, R.bbcStyleGuide, R.poynterHeadlines],
}

export default week
