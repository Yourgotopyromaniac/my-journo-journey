import { getWeekContent, phaseReviewForWeek, writtenWeeks } from '@/content'
import { initialData, useProgress } from '@/store/progress'
import { addDays, today } from './dates'

/**
 * Development-only helpers, available in the browser console as `__dev`.
 * Loaded from main.tsx only when running `npm run dev`.
 */
export const devtools = {
  /** Mark every lesson, assignment and quiz in a week as done. Triggers the treat coupon. */
  completeWeek(week: number) {
    const content = getWeekContent(week)
    if (!content) return `Week ${week} is not written yet.`
    const s = useProgress.getState()
    for (const l of content.lessons) s.setLessonComplete(week, l.slug, true)
    for (const a of content.assignments) s.updateAssignment(a.id, { status: 'done' })
    const passQuiz = (id: string, total: number) =>
      s.recordQuizAttempt(id, { correct: total, total, passed: true, wrongQuestionIds: [] })
    passQuiz(content.quiz.id, content.quiz.questions.length)
    const review = phaseReviewForWeek(week)
    if (review) passQuiz(review.quiz.id, review.quiz.questions.length)
    return `Week ${week} marked complete.`
  },

  /** Complete every written week from 1 up to and including `week`. */
  completeUpTo(week: number) {
    for (const w of writtenWeeks()) if (w.number <= week) devtools.completeWeek(w.number)
    return `Weeks 1 to ${week} marked complete.`
  },

  /** Add news diary entries dated over the last few days. */
  addDiary(count = 5) {
    const s = useProgress.getState()
    for (let i = 0; i < count; i++) {
      s.saveDiaryEntry({
        date: addDays(today(), -i),
        headline: `Test story ${i + 1}`,
        outlet: 'Test outlet',
        link: '',
        why: 'Added from the console for testing.',
        values: ['timeliness'],
      })
    }
    return `${count} diary entries added.`
  },

  /** Record a failed attempt at a week's quiz, so its first questions appear in review (due now). */
  failQuiz(week: number, wrong = 3) {
    const content = getWeekContent(week)
    if (!content) return `Week ${week} is not written yet.`
    const ids = content.quiz.questions.slice(0, wrong).map((q) => q.id)
    const total = content.quiz.questions.length
    useProgress.getState().recordQuizAttempt(content.quiz.id, {
      correct: total - ids.length,
      total,
      passed: false,
      wrongQuestionIds: ids,
    })
    // Make the missed questions due today instead of in two days.
    useProgress.setState((st) => ({
      review: Object.fromEntries(
        Object.entries(st.review).map(([k, r]) => [k, r.quizId === content.quiz.id ? { ...r, due: today() } : r]),
      ),
    }))
    return `Failed Week ${week} quiz with ${ids.length} wrong. Open /review to practise them.`
  },

  /** Show the "week complete" message again for a week that already earned a coupon. */
  replayReward(week: number) {
    const reward = useProgress.getState().rewards[week]
    if (!reward) return `No coupon for Week ${week} yet. Try __dev.completeWeek(${week}) first.`
    useProgress.setState((st) => ({ rewards: { ...st.rewards, [week]: { ...reward, seenAt: undefined } } }))
    return `The Week ${week} message will show again.`
  },

  /** Remove a week's coupon so it can be earned again. */
  resetReward(week: number) {
    useProgress.setState((st) => {
      const rewards = { ...st.rewards }
      delete rewards[week]
      return { rewards }
    })
    return `Week ${week} coupon removed.`
  },

  /** Clear everything, including onboarding, back to a first visit. */
  reset() {
    useProgress.setState({ ...initialData() })
    return 'Progress cleared. Reload to see the welcome screen.'
  },

  /** Print a short summary of saved progress. */
  status() {
    const s = useProgress.getState()
    return {
      onboarded: s.onboarded,
      lessonsDone: Object.values(s.lessons).filter((l) => l.completedAt).length,
      quizAttempts: Object.values(s.quizAttempts).flat().length,
      diaryEntries: s.diary.length,
      journalEntries: s.journal.length,
      reviewQueue: Object.keys(s.review).length,
      coupons: Object.keys(s.rewards).map(Number),
      flexWeekTakenOn: s.flexWeekTakenOn,
    }
  },

  help() {
    return [
      '__dev.completeWeek(2)    finish every item in Week 2 (shows the coupon)',
      '__dev.completeUpTo(6)    finish Weeks 1 to 6',
      '__dev.addDiary(5)        add 5 news diary entries',
      '__dev.failQuiz(1)        fail the Week 1 quiz so questions appear in /review',
      '__dev.replayReward(2)    show the Week 2 coupon message again',
      '__dev.resetReward(2)     remove the Week 2 coupon so it can be earned again',
      '__dev.status()           summary of saved progress',
      '__dev.reset()            clear everything (then reload)',
      '',
      'URL options: ?onboarded skips the welcome screen, ?date=2026-10-01 pretends it is that date.',
    ].join('\n')
  },
}
