import { lesson } from '@/content/helpers'
import { R, S } from '@/content/sources'
import type { WeekContent } from '@/content/types'

const week: WeekContent = {
  number: 6,
  overview:
    'This week you learn the laws that shape journalism in Nigeria: what the Constitution protects, how to avoid defamation, how to use the Freedom of Information Act, and what the cybercrime, copyright and data laws mean for your work. It ends Phase 1, so you will also take the Phase 1 review quiz.',
  objectives: [
    'Explain what Sections 22 and 39 of the Constitution say about the press.',
    'Explain civil and criminal defamation in Nigeria and the main defences.',
    'Describe how to make an FOI request and what to do if it is refused.',
    'Say how the Cybercrimes Act, Copyright Act and Data Protection Act affect journalists.',
    'Use a pre-publication legal checklist on your own work.',
  ],
  lessons: [
    lesson(
      {
        slug: 'press-freedom-and-the-constitution',
        title: 'Press freedom and the Constitution',
        summary: 'What the Constitution protects, the limits it allows, and the state of press freedom in Nigeria today.',
        minutes: 12,
        sources: [S.constitution, S.chapterTwoEnforceability, S.rsfNigeria, S.cpjTinubuTenure],
      },
      () => import('./lessons/01-press-freedom-and-the-constitution.mdx'),
    ),
    lesson(
      {
        slug: 'defamation',
        title: 'Defamation',
        summary: 'The legal risk journalists meet most often, and the habits that protect you from it.',
        minutes: 15,
        sources: [S.carterRuckNigeria, S.criminalCode, S.penalCode, S.aviomoh, S.lagosCriminalLaw, S.nbaLibel],
      },
      () => import('./lessons/02-defamation.mdx'),
    ),
    lesson(
      {
        slug: 'freedom-of-information',
        title: 'The Freedom of Information Act',
        summary: 'Your legal right to ask public institutions for information, and how to use it well.',
        minutes: 12,
        sources: [S.foiAct, S.foiSupremeCourt],
      },
      () => import('./lessons/03-freedom-of-information.mdx'),
    ),
    lesson(
      {
        slug: 'cybercrime-copyright-and-more',
        title: 'Cybercrime, copyright and other laws',
        summary: 'The online, copyright, data and secrecy laws every journalist should know about.',
        minutes: 15,
        sources: [
          S.cybercrimesAct2015,
          S.ecowasCybercrimes,
          S.cybercrimesAmendment,
          S.cpjCybercrimes2025,
          S.cpjSixthJournalist,
          S.copyrightAct,
          S.ndpaExplained,
          S.ndpaText,
          S.officialSecretsAct,
          S.criminalCode,
          S.nbcFinesAppeal,
        ],
      },
      () => import('./lessons/04-cybercrime-copyright-and-more.mdx'),
    ),
  ],
  assignments: [
    {
      id: 'w6-legal-check',
      title: 'Legal check on your own work',
      minutes: 50,
      brief:
        'The best time to find a legal problem is before you publish. In this task you use the pre-publication legal checklist from the Toolkit on a piece you have already written, and fix what you find.',
      steps: [
        'Open the "Pre-publication legal check" in the Toolkit.',
        'Choose a piece you wrote in Weeks 3 to 5, such as your interview write-up or your news story.',
        'Go through the checklist one item at a time. For each item, note whether your piece passes, fails or does not apply.',
        'Fix every problem you found. If a claim cannot be proved, cut it or attribute it properly and seek a response.',
        'Write three to five sentences on what you changed and why.',
      ],
      deliverable: 'A Google Doc with the checklist results, the corrected piece, and a short note on what you changed.',
      checklist: [
        'I went through every item on the legal checklist.',
        'Every serious claim in my piece is backed by evidence I can show.',
        'I gave anyone accused of wrongdoing a chance to respond.',
        'I checked that I have the right to use any photos or quotes from other sources.',
        'I wrote a short note on what I changed.',
      ],
    },
    {
      id: 'w6-foi-draft',
      title: 'Draft an FOI request',
      minutes: 40,
      brief:
        'An FOI request is a practical tool you will use again in Week 19 when you follow the money. This week you draft one properly. You do not have to send it yet.',
      steps: [
        'Choose a public institution and a specific document you want, such as a contract, a budget line or a report.',
        'Write a request letter of no more than one page.',
        'Say that you are writing under the Freedom of Information Act 2011.',
        'Describe exactly which document you want, with names, places and dates.',
        'Note that the institution must respond within 7 days.',
        'Add your name and contact details, and the date.',
        'Under the letter, write what you would do if you got no reply after 7 days.',
      ],
      deliverable: 'A one-page FOI request letter in Google Docs, plus a short note on what you would do if it was refused.',
      checklist: [
        'My request names a specific document, not general information.',
        'I mention the Freedom of Information Act 2011.',
        'I did not give a reason for my request, because the Act does not require one.',
        'I noted the 7-day time limit.',
        'I wrote what I would do after a refusal or no reply, including the 30 days to go to court.',
      ],
    },
  ],
  quiz: {
    id: 'w6-checkpoint',
    title: 'Media law in Nigeria',
    questions: [
      {
        id: 'q1',
        type: 'single',
        prompt: 'Which section of the Constitution protects freedom of expression, including the right to share information?',
        options: [
          { id: 'a', text: 'Section 39' },
          { id: 'b', text: 'Section 22' },
          { id: 'c', text: 'Section 6' },
          { id: 'd', text: 'Section 45' },
        ],
        answer: 'a',
        explanation:
          'Section 39 is the fundamental right to freedom of expression and the press. Section 22 gives the media a duty to hold government accountable, but it is in Chapter II, which courts generally cannot enforce.',
        lessonSlug: 'press-freedom-and-the-constitution',
      },
      {
        id: 'q2',
        type: 'truefalse',
        prompt: 'Defamation is no longer a crime anywhere in Nigeria.',
        answer: false,
        explanation:
          'Criminal defamation is still in the Criminal Code and the Penal Code, and the Supreme Court upheld the Penal Code offences in 2021. The Criminal Law of Lagos State 2011 does not include it, but Lagos has other offences, such as publishing false news.',
        lessonSlug: 'defamation',
      },
      {
        id: 'q3',
        type: 'multi',
        prompt: 'Which of these are defences to a civil defamation claim? Choose all that apply.',
        options: [
          { id: 'a', text: 'What you published is true and you can prove it' },
          { id: 'b', text: 'It was an honest opinion on a matter of public interest, based on true facts' },
          { id: 'c', text: 'It was a fair and accurate report of what was said in open court' },
          { id: 'd', text: 'You wrote the word "allegedly"' },
        ],
        answer: ['a', 'b', 'c'],
        explanation:
          'Truth, fair comment and privilege are defences. Writing "allegedly" does not protect you if you repeat a damaging claim you cannot back up.',
        lessonSlug: 'defamation',
      },
      {
        id: 'q4',
        type: 'single',
        prompt: 'Under the FOI Act, how long does a public institution normally have to respond to a request?',
        options: [
          { id: 'a', text: '7 days' },
          { id: 'b', text: '14 days' },
          { id: 'c', text: '30 days' },
          { id: 'd', text: 'There is no time limit' },
        ],
        answer: 'a',
        explanation:
          'The institution must respond within 7 days. It can extend this once, by up to 7 more days, if it tells you in writing.',
        lessonSlug: 'freedom-of-information',
      },
      {
        id: 'q5',
        type: 'single',
        prompt: 'You sent an FOI request 10 days ago. There was no extension notice and no reply. What does the Act say?',
        options: [
          { id: 'a', text: 'The silence counts as a refusal, and you can ask a court to review it within 30 days.' },
          { id: 'b', text: 'The request has been approved, so you can publish what you think the documents say.' },
          { id: 'c', text: 'You must wait at least three months before doing anything.' },
          { id: 'd', text: 'You must send the request again with a reason.' },
        ],
        answer: 'a',
        explanation:
          'If the time limit passes with no answer, the Act treats it as a refusal. You then have 30 days to apply to court. You never need to give a reason for a request.',
        lessonSlug: 'freedom-of-information',
      },
      {
        id: 'q6',
        type: 'truefalse',
        prompt: 'In April 2025, the Supreme Court ruled that the FOI Act applies only to federal institutions.',
        answer: false,
        explanation: 'The Supreme Court ruled the opposite: the FOI Act applies to all 36 states, not only federal institutions.',
        lessonSlug: 'freedom-of-information',
      },
      {
        id: 'q7',
        type: 'truefalse',
        prompt: 'Under the Copyright Act 2022, you can always use up to 30 seconds of a song without permission.',
        answer: false,
        explanation:
          'The Act has no fixed safe length. Fair dealing depends on the purpose, the nature of the work, how much you use, and the effect on the work’s market. Credit the work and its author where practicable.',
        lessonSlug: 'cybercrime-copyright-and-more',
      },
      {
        id: 'q8',
        type: 'single',
        prompt: 'A trial is still going on. Which of these is the safest thing to publish?',
        options: [
          { id: 'a', text: 'A fair and accurate report of what was said in open court today' },
          { id: 'b', text: 'Your view that the accused is clearly guilty' },
          { id: 'c', text: 'Evidence from a part of the hearing held in private' },
          { id: 'd', text: 'A post telling the judge what the verdict should be' },
        ],
        answer: 'a',
        explanation:
          'Fair and accurate reports of open court proceedings are protected. Suggesting guilt, publishing evidence from a private hearing, or trying to influence the case can be contempt of court.',
        lessonSlug: 'cybercrime-copyright-and-more',
      },
    ],
  },
  journalPrompt:
    'Which of this week’s laws surprised you most? Think about a story you would like to report one day. What legal risks would it carry, and how would you protect yourself?',
  resources: [R.foiActText, R.mraPublications],
}

export default week
