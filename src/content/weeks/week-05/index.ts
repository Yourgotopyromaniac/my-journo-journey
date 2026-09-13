import { lesson } from '@/content/helpers'
import { R, S } from '@/content/sources'
import type { WeekContent } from '@/content/types'

const week: WeekContent = {
  number: 5,
  overview:
    'This week is about the choices journalists make when no rule tells them exactly what to do. You study the Code of Ethics for Nigerian Journalists, brown envelopes and conflicts of interest, how to avoid needless harm, and how to handle mistakes. By Sunday you will have your own policy on gifts and a set of ethics cases worked through.',
  objectives: [
    'Explain the key articles of the Code of Ethics for Nigerian Journalists.',
    'Recognise brown envelopes and conflicts of interest, and know how to respond.',
    'Report on grief, children, survivors, suicide, ethnicity and religion with care.',
    'Write a clear correction.',
    'Apply ethics to real and made-up cases.',
  ],
  lessons: [
    lesson(
      {
        slug: 'the-nigerian-code',
        title: 'The Nigerian code of ethics',
        summary: 'The standards Nigerian journalists set for themselves, and the articles you will use most.',
        minutes: 13,
        sources: [S.nigerianCode, S.irbBrownEnvelope, S.gusauJudgment],
      },
      () => import('./lessons/01-the-nigerian-code.mdx'),
    ),
    lesson(
      {
        slug: 'brown-envelopes-and-conflicts',
        title: 'Brown envelopes and conflicts of interest',
        summary: 'What brown envelopes are, why they happen, and how to handle gifts and conflicts.',
        minutes: 15,
        sources: [
          S.irbBrownEnvelope,
          S.okoroBrownEnvelope,
          S.skjerdalBrownEnvelopes,
          S.theCableLeaving,
          S.premiumTimesSalaries,
          S.ejnNigeria,
          S.peoplesGazettePolicy,
          S.nigerianCode,
          S.bbcConflicts,
          S.spjCode,
          S.mhmConflicts,
        ],
      },
      () => import('./lessons/02-brown-envelopes-and-conflicts.mdx'),
    ),
    lesson(
      {
        slug: 'minimising-harm',
        title: 'Minimising harm',
        summary: 'Reporting on grief, children, survivors, suicide, ethnicity and religion with care.',
        minutes: 15,
        sources: [
          S.ejnPrinciples,
          S.nigerianCode,
          S.childsRightAct,
          S.cjidGbvHandbook,
          S.whoSuicide2023,
          S.attemptedSuicideNigeria,
          S.gijnEthnoReligious,
          S.ejnHateSpeechTest,
        ],
      },
      () => import('./lessons/03-minimising-harm.mdx'),
    ),
    lesson(
      {
        slug: 'when-journalists-get-it-wrong',
        title: 'When journalists get it wrong',
        summary: 'How to correct mistakes, and what two well-known failures teach us.',
        minutes: 12,
        sources: [
          S.nigerianCode,
          S.theCableCorrections,
          S.peoplesGazettePolicy,
          S.apiCorrections,
          S.cjrRollingStone,
          S.nprRollingStoneVerdict,
          S.sundayTimesApology,
        ],
      },
      () => import('./lessons/04-when-journalists-get-it-wrong.mdx'),
    ),
  ],
  assignments: [
    {
      id: 'w5-ethics-cases',
      title: 'Ethics case studies',
      minutes: 80,
      brief:
        'Ethics is about judgement. In this task you work through two real cases and three made-up situations a young Nigerian journalist could face.',
      steps: [
        'Create a new Google Doc called "Week 5: Ethics cases".',
        'Read the sources for the Rolling Stone and Sunday Times cases, listed under the last lesson.',
        'For each real case, write about 200 words: what went wrong, which principles were broken, and what should have been done.',
        'For each made-up situation below, write about 150 words: what you would do, which article of the Nigerian code applies, and why.',
      ],
      materials: [
        {
          title: 'Made-up situations',
          note: 'These are invented for practice.',
          ordered: true,
          items: [
            'After a press conference by a state agency, an official hands each journalist an envelope "for transport". Your colleagues take theirs. What do you do, and what do you write?',
            'A well-known musician is arrested. Their 12-year-old son is filmed crying outside the police station, and the video is going viral. Your editor asks if you can use it.',
            'Clashes between two communities leave several people dead. A local leader tells you that one ethnic group started it. You have no other source yet. How do you report the story?',
          ],
        },
      ],
      deliverable: 'A Google Doc with two case analyses of about 200 words and three responses of about 150 words.',
      checklist: [
        'I named the principles or articles involved in each case.',
        'For each real case, I said what should have been done differently.',
        'For each made-up situation, I gave a clear decision and a reason.',
        'I considered the harm to the people in each story, not only the rules.',
      ],
    },
    {
      id: 'w5-correction-and-policy',
      title: 'A correction and your gifts policy',
      minutes: 35,
      brief:
        'Two practical tools every journalist needs: the ability to correct a mistake clearly, and a clear personal rule on gifts and money.',
      steps: [
        'Create a new Google Doc called "Week 5: Correction and policy".',
        'Read the made-up error below. Write a clear correction of no more than 50 words.',
        'Write your personal policy on gifts, "transport money" and free products in 100 to 150 words. Say what you will accept, what you will refuse, and who you will tell.',
      ],
      materials: [
        {
          title: 'The error',
          note: 'Made up for practice.',
          items: [
            'Your published story said a new hospital in Ilorin "cost N4 billion and will open in January". In fact it cost N2.4 billion, and the opening date has not been announced.',
          ],
        },
      ],
      deliverable: 'A Google Doc with your correction and your personal gifts policy.',
      checklist: [
        'My correction is labelled as a correction.',
        'It says clearly what was wrong and what is right.',
        'My policy says what I will refuse, including cash.',
        'My policy says who I will tell about any offer.',
      ],
    },
  ],
  quiz: {
    id: 'w5-checkpoint',
    title: 'Ethics',
    questions: [
      {
        id: 'q1',
        type: 'single',
        prompt: 'Which article of the Code of Ethics for Nigerian Journalists deals with brown envelopes?',
        options: [
          { id: 'a', text: 'Article 7: Reward and gratification' },
          { id: 'b', text: 'Article 3: Privacy' },
          { id: 'c', text: 'Article 13: Plagiarism' },
          { id: 'd', text: 'Article 1: Editorial independence' },
        ],
        answer: 'a',
        explanation:
          'Article 7 says a journalist should not solicit or accept a bribe, gratification or patronage to suppress or publish information. Editorial independence is related, but Article 7 addresses payments directly.',
        lessonSlug: 'brown-envelopes-and-conflicts',
      },
      {
        id: 'q2',
        type: 'multi',
        prompt: 'Under Article 3, publishing private information can be justified when it is aimed at which of these? Choose all that apply.',
        options: [
          { id: 'a', text: 'Exposing crime or serious misconduct' },
          { id: 'b', text: 'Protecting public health and safety' },
          { id: 'c', text: 'Stopping the public from being misled by what someone has said or done' },
          { id: 'd', text: 'Getting more readers for a popular celebrity story' },
        ],
        answer: ['a', 'b', 'c'],
        explanation:
          'Article 3 allows private information when it serves the public interest, including exposing crime, protecting health and safety, and preventing the public from being misled. Popularity alone is not a reason.',
        lessonSlug: 'the-nigerian-code',
      },
      {
        id: 'q3',
        type: 'truefalse',
        prompt: 'A study found that 61% of all Nigerian journalists take brown envelopes.',
        answer: false,
        explanation:
          'The 61% figure comes from one 2009 study of 184 journalists in Lagos. It does not describe all Nigerian journalists. Always check where a number comes from before you repeat it.',
        lessonSlug: 'brown-envelopes-and-conflicts',
      },
      {
        id: 'q4',
        type: 'single',
        prompt: 'A clothing brand offers you free outfits if you wear them in your entertainment news videos. What is the most ethical choice?',
        options: [
          { id: 'a', text: 'Decline, or tell your editor and disclose the deal clearly, and do not report on that brand.' },
          { id: 'b', text: 'Accept, because entertainment news is less serious than politics.' },
          { id: 'c', text: 'Accept, but do not tell anyone.' },
          { id: 'd', text: 'Accept, and write a positive story about the brand to say thank you.' },
        ],
        answer: 'a',
        explanation:
          'Free products in return for promotion create a conflict of interest. Avoid it, or at least disclose it, and do not cover that brand. Readers deserve to know when someone has paid for attention.',
        lessonSlug: 'brown-envelopes-and-conflicts',
      },
      {
        id: 'q5',
        type: 'multi',
        prompt: 'According to the WHO guide, which should journalists avoid when reporting a suicide? Choose all that apply.',
        options: [
          { id: 'a', text: 'Describing the method' },
          { id: 'b', text: 'Naming the location' },
          { id: 'c', text: 'Using a sensational headline' },
          { id: 'd', text: 'Giving information about where to get help' },
        ],
        answer: ['a', 'b', 'c'],
        explanation:
          'WHO advises not describing the method or location and not using sensational headlines. It advises including information about where people can get help.',
        lessonSlug: 'minimising-harm',
      },
      {
        id: 'q6',
        type: 'single',
        prompt: 'You are reporting a violent clash between two communities. What is the most responsible approach to ethnic labels?',
        options: [
          { id: 'a', text: 'Mention ethnicity only if it is truly needed to understand the story, and check any claims about who started it.' },
          { id: 'b', text: 'Always name the ethnic groups in the headline so readers know who is involved.' },
          { id: 'c', text: 'Repeat what the first community leader tells you about who is to blame.' },
          { id: 'd', text: 'Use the labels that are most common on social media.' },
        ],
        answer: 'a',
        explanation:
          'Labels can harden stereotypes and inflame tension. Article 6 warns against negative references to ethnicity or religion. Only mention them when relevant, and verify claims of blame with more than one source.',
        lessonSlug: 'minimising-harm',
      },
      {
        id: 'q7',
        type: 'single',
        prompt: 'Which correction is best?',
        options: [
          { id: 'a', text: 'Correction: An earlier version of this story said the bridge cost N3 billion. It cost N1.3 billion.' },
          { id: 'b', text: 'This story has been updated.' },
          { id: 'c', text: 'Note: some figures in this story have changed.' },
          { id: 'd', text: 'Delete the wrong figure and say nothing.' },
        ],
        answer: 'a',
        explanation:
          'A good correction is labelled as a correction and says exactly what was wrong and what is right. Vague notes confuse readers, and quietly changing a story damages trust.',
        lessonSlug: 'when-journalists-get-it-wrong',
      },
      {
        id: 'q8',
        type: 'single',
        prompt: 'What was the main lesson from the Rolling Stone case?',
        options: [
          { id: 'a', text: 'A serious claim resting on one unchecked source can collapse, however important the subject.' },
          { id: 'b', text: 'Magazines should never report on sexual assault.' },
          { id: 'c', text: 'Only lawyers can decide what is true.' },
          { id: 'd', text: 'Corrections are never needed if the story has a good cause.' },
        ],
        answer: 'a',
        explanation:
          'The Columbia Journalism School review called it an avoidable failure of reporting, editing and fact-checking. Important subjects need more checking, not less.',
        lessonSlug: 'when-journalists-get-it-wrong',
      },
    ],
  },
  journalPrompt:
    'Imagine you are offered money after a press event, and everyone else takes it. How would you feel, and what would you say? What would help you stick to your decision?',
  resources: [R.ejnHateSpeechVideo, R.cjidGbvHandbook, R.whoSuicide],
}

export default week
