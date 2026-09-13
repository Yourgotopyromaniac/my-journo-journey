# My Journo Journey

A 24-week digital journalism course for Princess, built as an installable web app. Tablet first, works offline, no accounts. Progress is saved on the device.

- Requirements: [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)
- Design mockups: kept locally in `design/` (not committed)

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # content check, type check, production build
npm run preview    # serve the production build
```

Development-only URL helpers:

- `?onboarded` skips the welcome screen.
- `?date=2026-09-30` pretends today is that date, to preview later weeks, flex weeks and pacing.

## Deploy

The app is a static site on Vercel. `vercel.json` handles page routing and caching for the service worker. Connect the repo in Vercel (framework: Vite) and every push to `main` deploys.

When a new version is deployed, the app shows "A new version is ready" so Princess picks up new lessons.

## Project layout

```
src/
  app/          layout, navigation, router, update prompt
  components/   shared UI (buttons, dialogs, progress bars)
  content/      the course: outline, glossary, and one folder per written week
  features/     one folder per screen (dashboard, lesson, quiz, ...)
  lib/          schedule, progress rules, quiz scoring, backups
  store/        saved progress (Zustand, stored in IndexedDB)
  styles/       design tokens and lesson typography
scripts/
  lint-content.mjs   plain English check, runs on build
```

## Adding a week of content

Plans for every unwritten week are in [docs/CONTENT-OUTLINES.md](docs/CONTENT-OUTLINES.md), with release dates and what to verify first.

1. Copy `src/content/weeks/week-02/` to `week-NN/`.
2. Edit `index.ts`: number, overview, objectives, lessons, assignments, quiz, journal prompt, resources.
3. Write each lesson as an `.mdx` file in `lessons/`. **Number the files in lesson order** (`01-...`, `02-...`), because search matches files to lessons by that number. Use `##` headings for sections (they build the "On this page" outline).
4. Add checked sources to `src/content/sources.ts` and reference them from the lesson's `sources`.
5. Run `npm run build`. The week appears in the app automatically.

Weeks that have no folder yet show "being written" in the app. Release each week at least two weeks before its start date.

### Phase review quizzes

Add `src/content/phases/phase-N.ts` exporting `{ phase, quiz }`. It appears automatically as the last item in the final week of that phase, at `/phase/N/review`. Give each question `lessonSlug` and `lessonWeek` so the explanation can link back to the right lesson.

### Toolkit checklists

Add `src/content/checklists/<id>.ts` exporting a `ToolkitChecklist`. Set `week` to the week that teaches it.

### Assignments that complete themselves

Set `doneWhenDiaryEntries: 5` on an assignment to tick it off once the news diary has that many entries.

### Lesson components

Use these inside `.mdx` lessons:

```mdx
<Term id="lede">lede</Term>                    tap-to-see glossary word (ids in src/content/glossary.ts)

<Callout type="practice">...</Callout>          types: practice, nigeria, watch, note

<Compare
  items={[
    { label: 'Weak', text: '...' },
    { label: 'Stronger', good: true, text: '...' },
  ]}
  note="Made-up example for practice."
/>

<Try>...</Try>                                  short exercise

<Resource href="https://..." title="..." publisher="..." minutes={20}>Why it helps.</Resource>

<Pyramid layers={[{ label: 'Lede', detail: '...' }]} />
```

### Writing rules

All learner-facing text follows the plain English rules in [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) (section 4.1): short sentences, everyday words, no em dashes, no filler words. `npm run lint:content` checks the obvious ones. Every fact needs a source listed in the lesson's `sources`, and made-up examples must say they are made up.

## Backups

Progress lives in the browser's storage on Princess's tablet. Settings has **Save backup** (downloads a JSON file) and **Restore from a backup**. Remind her to save a backup to Google Drive every week or two.
