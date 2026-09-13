import { lesson } from '@/content/helpers'
import { R, S } from '@/content/sources'
import type { WeekContent } from '@/content/types'

const week: WeekContent = {
  number: 2,
  overview:
    'This week you learn how editors decide what is news, the six questions every story answers, and how to write the first sentence that tells the news. By Sunday you will write your own ledes and build a story in the shape most newsrooms use.',
  objectives: [
    'Name seven common news values and spot them in real stories.',
    'Find the 5 Ws and H in any news story.',
    'Write a hard news lede in one sentence of 30 words or fewer.',
    'Explain the inverted pyramid and use it to put a story in order.',
  ],
  lessons: [
    lesson(
      {
        slug: 'what-makes-news',
        title: 'What makes something news',
        summary: 'Editors choose a few stories from thousands of events each day. These are the qualities that help them decide.',
        minutes: 12,
        sources: [S.mhmNewsValue, S.harcupONeill2017],
      },
      () => import('./lessons/01-what-makes-news.mdx'),
    ),
    lesson(
      {
        slug: 'five-ws-and-h',
        title: 'The 5 Ws and H',
        summary: 'Six simple questions that guide your reporting and tell you what goes first.',
        minutes: 10,
        sources: [S.mhmNewsWriting, S.newsManualCh4, S.owlLeads],
      },
      () => import('./lessons/02-five-ws-and-h.mdx'),
    ),
    lesson(
      {
        slug: 'writing-a-strong-lede',
        title: 'Writing a strong lede',
        summary: 'The first sentence of a news story does the most work. Here is how to write one that tells the news fast.',
        minutes: 12,
        sources: [S.owlLeads, S.mhmNewsWriting, S.newsManualCh4, S.pressGazetteJargon],
      },
      () => import('./lessons/03-writing-a-strong-lede.mdx'),
    ),
    lesson(
      {
        slug: 'inverted-pyramid',
        title: 'The inverted pyramid',
        summary: 'The shape most news stories follow, and why it works so well for readers and editors.',
        minutes: 12,
        sources: [S.owlPyramid, S.mhmStoryElements, S.poynterPyramidHistory],
      },
      () => import('./lessons/04-the-inverted-pyramid.mdx'),
    ),
  ],
  assignments: [
    {
      id: 'w2-lede-drill',
      title: 'Lede-writing drill',
      minutes: 45,
      brief:
        'Good ledes come from practice. In this drill you turn raw facts into ledes, then judge ledes written by working journalists.',
      steps: [
        'Create a new Google Doc called "Week 2: Lede drill".',
        'For each of the five fact sets below, write one lede. Aim for about 25 words and no more than 30. Write the word count after each one.',
        'Read your five ledes again. For each, check that it starts with what happened or what changed.',
        'Find three hard news stories from different Nigerian outlets. Copy each lede into your document with a link to the story.',
        'For each real lede, write two or three sentences: what it does well, and one thing you would change.',
      ],
      materials: [
        {
          title: 'Fact sets',
          note: 'These are made up for practice.',
          ordered: true,
          items: [
            'A secondary school in Abeokuta. Its computer lab was burgled on Saturday night. 25 laptops were stolen. Police arrested two men on Sunday. The school principal says exams start in two weeks.',
            'A new pedestrian bridge in Ikeja opened on Wednesday. The state government built it. A man was killed crossing the road at the same spot in March. Local residents had asked for a bridge for five years.',
            'The Lagos State Waste Management Authority says refuse will now be collected twice a week, not once, in five local government areas. It starts on 1 November. The change follows complaints about blocked drains during the rainy season.',
            'A 19-year-old student from Enugu won first prize in an Africa-wide poetry competition on Friday. The prize is $5,000. She wrote the poem about her grandmother. 1,200 people entered.',
            'Nurses at a state hospital in Ibadan began a three-day strike on Monday. They say they have not been paid for two months. The hospital says it is waiting for funds from the state. Some patients have been moved to other hospitals.',
          ],
        },
      ],
      deliverable: 'A Google Doc with five ledes you wrote, each with a word count, and three real ledes with your short critiques.',
      checklist: [
        'Each of my ledes is one sentence.',
        'Each of my ledes is 30 words or fewer.',
        'None of my ledes starts with the date, the time or the venue.',
        'I put the most important fact first in each lede.',
        'I included three real ledes with links and short critiques.',
      ],
    },
    {
      id: 'w2-pyramid-rewrite',
      title: 'Inverted pyramid rewrite',
      minutes: 60,
      brief:
        'Stories often arrive in the wrong order, especially from press releases or long interviews. In this task you put a jumbled story into the inverted pyramid, then cut a real story down to size.\n\nThis is a skill editors test in newsroom writing tests, so it is worth doing carefully.',
      steps: [
        'Create a new Google Doc called "Week 2: Pyramid rewrite".',
        'Read the jumbled paragraphs below. They are from one made-up story.',
        'Write a new lede of 30 words or fewer for the story.',
        'Put the remaining paragraphs in inverted pyramid order under your lede. You may shorten or combine them.',
        'Under the story, write a short note explaining why you chose that order.',
        'Next, find a real hard news story of 400 to 600 words from a Nigerian outlet. Paste the link.',
        'Cut it to about half its length by removing paragraphs from the bottom and trimming words. Write one sentence on what was lost.',
      ],
      materials: [
        {
          title: 'Jumbled story',
          note: 'Made up for practice. The paragraphs are in the wrong order.',
          items: [
            'The market was built in 1987 and has about 1,500 shops.',
            '"We heard a loud bang, then we saw smoke everywhere," said Mrs Adebayo, who sells fabric.',
            'Fire officials said no one was hurt, but 60 shops were destroyed.',
            'The fire started at about 2am on Tuesday in the food section of the market in Ibadan.',
            'Traders said they had lost goods worth millions of naira, just weeks before Christmas.',
            'A fire service spokesman said the cause is not yet known and an investigation has started.',
            "The state government said it will meet traders' leaders on Thursday to discuss support.",
          ],
        },
      ],
      deliverable: 'A Google Doc with your rewritten story, a short note on your order, and a real story cut to half its length.',
      checklist: [
        'My lede says what happened, where and how bad it was.',
        'The most important facts are in the first two paragraphs.',
        'The background about when the market was built is near the bottom.',
        'I checked the order by covering the last paragraph and reading again.',
        'I cut a real story from the bottom and said what was lost.',
      ],
    },
  ],
  quiz: {
    id: 'w2-checkpoint',
    title: 'News values and ledes',
    questions: [
      {
        id: 'q1',
        type: 'single',
        prompt:
          'A building collapses in a city far from Nigeria. On the same day, a smaller building collapses in Surulere. Your Lagos editor puts the Surulere story first. Which news value is your editor mainly using?',
        options: [
          { id: 'a', text: 'Proximity' },
          { id: 'b', text: 'Prominence' },
          { id: 'c', text: 'Novelty' },
          { id: 'd', text: 'Conflict' },
        ],
        answer: 'a',
        explanation:
          'Proximity means the event is close to your readers. For a Lagos audience, a collapse in Surulere matters more than a bigger one far away.',
        lessonSlug: 'what-makes-news',
      },
      {
        id: 'q2',
        type: 'multi',
        prompt:
          'A famous Afrobeats singer announces a free concert in Lagos this Saturday. Which news values does this story show? Choose all that apply.',
        options: [
          { id: 'a', text: 'Prominence' },
          { id: 'b', text: 'Timeliness' },
          { id: 'c', text: 'Proximity' },
          { id: 'd', text: 'Conflict' },
        ],
        answer: ['a', 'b', 'c'],
        explanation:
          'The singer is famous (prominence), the concert is this week (timeliness) and it is in Lagos (proximity). Nothing in the story involves a disagreement, so there is no conflict.',
        lessonSlug: 'what-makes-news',
      },
      {
        id: 'q3',
        type: 'truefalse',
        prompt: 'A good hard news lede must answer all of the 5 Ws and H.',
        answer: false,
        explanation:
          'A lede should answer the most important questions, usually what and who. Trying to fit all six into one sentence makes it long and hard to read. The rest go in the next paragraphs.',
        lessonSlug: 'writing-a-strong-lede',
      },
      {
        id: 'q4',
        type: 'single',
        prompt: 'What is the main problem with this lede?',
        context: 'On Monday morning at 10am, a meeting was held at the Ministry of Education in Alausa, Ikeja.',
        options: [
          { id: 'a', text: 'It starts with the time and place, and does not say what happened.' },
          { id: 'b', text: 'It is too short.' },
          { id: 'c', text: 'It should include a quote.' },
          { id: 'd', text: 'It names a government ministry.' },
        ],
        answer: 'a',
        explanation:
          'The lede tells us when and where a meeting was, but not what was decided or why it matters. Start with what happened or what changed. The time and place can come later.',
        lessonSlug: 'writing-a-strong-lede',
      },
      {
        id: 'q5',
        type: 'single',
        prompt:
          'A fire destroyed 40 shops at a market in Lagos Island last night. No one was hurt. Which lede is strongest?',
        options: [
          { id: 'a', text: 'Last night was a sad night for traders in Lagos Island.' },
          { id: 'b', text: 'A fire destroyed 40 shops at a Lagos Island market last night, but no one was hurt.' },
          { id: 'c', text: 'The fire service has said that it responded to a fire.' },
          { id: 'd', text: 'Fires are a common problem in markets across Nigeria.' },
        ],
        answer: 'b',
        explanation:
          'Option B says what happened, where, when and how serious it was, in one short sentence. Option A gives a feeling, not facts. Option C hides the news. Option D is background, not news.',
        lessonSlug: 'writing-a-strong-lede',
      },
      {
        id: 'q6',
        type: 'order',
        prompt: 'Put these parts of an inverted pyramid story in order, from the top of the story to the bottom.',
        items: [
          { id: 'lede', text: 'The lede with the most important facts' },
          { id: 'details', text: 'Key details the reader needs next' },
          { id: 'quotes', text: 'Quotes and reactions' },
          { id: 'background', text: 'Background and extra information' },
        ],
        explanation:
          'The inverted pyramid starts with the most important facts and ends with the least important. Quotes usually come after the key facts, and background goes near the end.',
        lessonSlug: 'inverted-pyramid',
      },
      {
        id: 'q7',
        type: 'single',
        prompt:
          'Your story is 400 words. Your editor needs 250. You wrote it as an inverted pyramid. Where should you cut?',
        options: [
          { id: 'a', text: 'From the top' },
          { id: 'b', text: 'From the middle' },
          { id: 'c', text: 'From the bottom' },
          { id: 'd', text: 'A little from every paragraph' },
        ],
        answer: 'c',
        explanation:
          'In an inverted pyramid, the most important facts come first and the least important come last. So you can cut from the bottom, and the story still makes sense.',
        lessonSlug: 'inverted-pyramid',
      },
      {
        id: 'q8',
        type: 'single',
        prompt: 'You are writing about a road crash. Police have not said what caused it. What should you do?',
        options: [
          { id: 'a', text: 'Write the most likely cause, based on what witnesses think.' },
          { id: 'b', text: 'Leave out the cause and do not mention it.' },
          { id: 'c', text: 'Say clearly that the cause is not yet known.' },
          { id: 'd', text: 'Wait until the cause is known before publishing anything.' },
        ],
        answer: 'c',
        explanation:
          'Readers will want to know why it happened. Do not guess. Tell them plainly that police have not said what caused the crash. You can update the story when you know more.',
        lessonSlug: 'five-ws-and-h',
      },
    ],
  },
  journalPrompt:
    'Pick one story from your news diary this week. Which news values made it stand out? Did its first sentence tell you the news straight away? How would you rewrite it?',
  resources: [R.newsManualCh4, R.mhmModule],
}

export default week
