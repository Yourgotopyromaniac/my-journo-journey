import type { Resource, Source } from './types'

/**
 * Shared, checked sources. Each has the date the link and the facts used were last checked.
 * Re-check before reusing a source in a new lesson.
 */
const checked = '2026-09-13'

export const S = {
  // Principles and ethics
  elementsOfJournalism: {
    title: 'The elements of journalism',
    publisher: 'Tom Rosenstiel',
    url: 'https://www.tomrosenstiel.com/essential/the-elements-of-journalism/',
    checked,
  },
  ejnPrinciples: {
    title: 'Who we are: five core principles of journalism',
    publisher: 'Ethical Journalism Network',
    url: 'https://ethicaljournalismnetwork.org/who-we-are',
    checked,
  },
  nigerianCode: {
    title: 'Code of Ethics for Nigerian Journalists',
    publisher: 'Nigerian Press Council',
    url: 'https://presscouncil.gov.ng/code-of-ethics/',
    checked,
  },
  codeAdoption: {
    title: 'An evaluation of conformance to the Code of Ethics (Odionyenma et al., IMSU Journal of Communication Studies, 2024)',
    publisher: 'SSOAR',
    url: 'https://www.ssoar.info/ssoar/bitstream/handle/document/99329/ssoar-imsujcomms-2024-2-odionyenma_et_al-An_evaluation_of_conformance_to.pdf',
    checked,
  },

  // Audiences
  dnrNigeria2026: {
    title: 'Digital News Report 2026: Nigeria',
    publisher: 'Reuters Institute for the Study of Journalism',
    url: 'https://reutersinstitute.politics.ox.ac.uk/digital-news-report/2026/nigeria',
    checked,
  },

  // Nigerian media bodies and outlets
  pressCouncilAbout: {
    title: 'About the Nigerian Press Council',
    publisher: 'Nigerian Press Council',
    url: 'https://presscouncil.gov.ng/who_we_are/',
    checked,
  },
  nbc: {
    title: 'National Broadcasting Commission',
    publisher: 'Wikipedia (the official site nbc.gov.ng was down for maintenance when checked)',
    url: 'https://en.wikipedia.org/wiki/National_Broadcasting_Commission',
    checked,
  },
  nuj: { title: 'Nigeria Union of Journalists', publisher: 'NUJ', url: 'https://nuj.ng/', checked },
  nge: { title: 'About us', publisher: 'Nigerian Guild of Editors', url: 'https://ngeditors.org.ng/about-us/', checked },
  nan: { title: 'About us', publisher: 'News Agency of Nigeria', url: 'https://nannews.ng/about-us/', checked },
  nta: { title: 'NTA', publisher: 'Nigerian Television Authority', url: 'https://www.nta.ng/', checked },
  frcn: { title: 'About us', publisher: 'Radio Nigeria (FRCN)', url: 'https://radionigeria.gov.ng/about-us/', checked },
  von: { title: 'Voice of Nigeria', publisher: 'Voice of Nigeria', url: 'https://von.gov.ng/', checked },
  premiumTimes: { title: 'About us', publisher: 'Premium Times', url: 'https://www.premiumtimesng.com/about', checked },
  dubawa: { title: 'Dubawa', publisher: 'Centre for Journalism Innovation and Development', url: 'https://dubawa.org/', checked },
  factCheckHub: { title: 'About us', publisher: 'FactCheckHub (The ICIR)', url: 'https://factcheckhub.com/about-us/', checked },

  // Newsroom roles
  mhmRoles: {
    title: "Journalism's roles and responsibilities",
    publisher: 'Media Helping Media',
    url: 'https://mediahelpingmedia.org/basics/what-is-a-journalist/',
    checked,
  },
  gouwsRoles: {
    title: 'Journalistic roles in newsrooms (How to be a Journalist in the 21st Century)',
    publisher: 'Gouws et al., North-West University, via LibreTexts',
    url: 'https://socialsci.libretexts.org/Bookshelves/Communication/Journalism_and_Mass_Communication/How_to_be_a_Journalist_in_the_21st_century_(Gouws_et_al.)/04:_The_Work_of_the_Journalist/4.01:_Journalistic_Roles_in_Newsrooms',
    checked,
  },
  pressGazetteJargon: {
    title: 'Journalism jargon guide',
    publisher: 'Press Gazette',
    url: 'https://pressgazette.co.uk/publishers/journalism-jargon-guide/',
    checked,
  },

  // News writing
  harcupONeill2017: {
    title: 'What is news? News values revisited (again). Harcup and O’Neill, Journalism Studies, 2017',
    publisher: 'White Rose Research Online (open access)',
    url: 'https://eprints.whiterose.ac.uk/id/eprint/95423/11/WRRO_95423.pdf',
    checked,
  },
  mhmNewsValue: {
    title: 'How journalists assess news value',
    publisher: 'Media Helping Media',
    url: 'https://mediahelpingmedia.org/basics/what-is-news/',
    checked,
  },
  mhmNewsWriting: {
    title: 'Quick guide: news writing',
    publisher: 'Media Helping Media',
    url: 'https://mediahelpingmedia.org/quick-guides/quick-guide-news-writing/',
    checked,
  },
  newsManualCh4: {
    title: 'The News Manual, chapter 4: The intro',
    publisher: 'David Ingram and Peter Henshall',
    url: 'https://thenewsmanual.net/Manuals%20Volume%201/volume1_04.htm',
    checked,
  },
  owlLeads: {
    title: 'Writing leads',
    publisher: 'Purdue Online Writing Lab',
    url: 'https://owl.purdue.edu/owl/subject_specific_writing/journalism_and_journalistic_writing/writing_leads.html',
    checked,
  },
  owlPyramid: {
    title: 'The inverted pyramid',
    publisher: 'Purdue Online Writing Lab',
    url: 'https://owl.purdue.edu/owl/subject_specific_writing/journalism_and_journalistic_writing/the_inverted_pyramid.html',
    checked,
  },
  mhmStoryElements: {
    title: 'Essential elements of a news story',
    publisher: 'Media Helping Media',
    url: 'https://mediahelpingmedia.org/basics/essential-elements-of-a-news-story/',
    checked,
  },
  poynterPyramidHistory: {
    title: 'Birth of the inverted pyramid: a child of technology, commerce and history',
    publisher: 'Poynter (Chip Scanlan, 2003)',
    url: 'https://www.poynter.org/reporting-editing/2003/birth-of-the-inverted-pyramid-a-child-of-technology-commerce-and-history/',
    checked,
  },
} satisfies Record<string, Source>

export const R = {
  gniFundamentals: {
    title: 'Fundamentals',
    publisher: 'Google News Initiative',
    url: 'https://newsinitiative.withgoogle.com/resources/trainings/fundamentals/',
    checked,
    kind: 'course',
    minutes: 75,
    note: 'Eleven short lessons on search and digital tools for journalists. Free, and works in a tablet browser.',
  },
  dnrNigeria: {
    ...S.dnrNigeria2026,
    kind: 'article',
    minutes: 15,
    note: 'The full Nigeria page from this year’s report. Read it after the lesson on how news reaches people.',
  },
  nigerianCode: {
    ...S.nigerianCode,
    kind: 'guide',
    minutes: 20,
    note: 'The full code. Skim the 15 article headings now. You will study it closely in Week 5.',
  },
  mhmModule: {
    title: 'Module: news reporting and production',
    publisher: 'Media Helping Media',
    url: 'https://mediahelpingmedia.org/modules/module-news-reporting-and-production/',
    checked,
    kind: 'course',
    note: 'Free, short, plain-English lessons on news writing. Good extra practice for this week.',
  },
  newsManualCh4: {
    ...S.newsManualCh4,
    kind: 'guide',
    minutes: 25,
    note: 'A free chapter on writing intros, written for journalists in developing countries.',
  },
} satisfies Record<string, Resource>
