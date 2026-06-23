# InterviewPilot AI UX Audit

Date: 2026-06-23
Surface: local web app at http://localhost:5173/
Viewport checks: desktop 1440x1000 and mobile 390x844

## Evidence Captured

1. `01-setup-desktop.png` - desktop setup screen - healthy
2. `02-after-generation-top.png` - post-generation viewport remains at setup screen - needs attention
3. `03-question-desktop.png` - first question screen - mostly healthy
4. `04-evaluation-error.png` - real evaluation failure state - blocker
5. `05-feedback-success-mocked.png` - mocked successful feedback state - mostly healthy
6. `06-final-report-mocked.png` - mocked final report - mostly healthy
7. `07-setup-mobile.png` - mobile first viewport - needs attention
8. `08-form-mobile.png` - mobile upper form - healthy
9. `09-form-bottom-mobile.png` - mobile lower form and start button - healthy

Note: question generation succeeded against the real backend. Answer evaluation returned two real `502` responses from `/api/interview/evaluate`, so the real MVP flow could not be completed. Screens 5 and 6 used a temporary browser-only mocked evaluation response to inspect the downstream UI. No app code was changed for the mock.

## Step List

1. Setup screen: healthy. Strong visual hierarchy, trustworthy API status, clear selected states, and a prominent primary action.
2. After generating questions: needs attention. The generated interview appears below the existing setup screen, but the viewport stays at the top. Users can miss that the next step is lower on the page.
3. Question answering screen: mostly healthy. One-question-at-a-time layout is clear, the answer box is large, and progress is visible.
4. Real evaluation error: blocker. The UI fails safely with a simple message and retry button, but the flow cannot proceed because evaluation keeps returning `502`.
5. Successful feedback state, mocked: mostly healthy. Score, confidence, strengths, weaknesses, missing concepts, and improved answer are clear, but the next action is visually detached below the feedback.
6. Completion and final report, mocked: mostly healthy. The report summarizes score, gaps, topics, roadmap, and question breakdown, but the flow ends without a next action such as restart, copy, or export.
7. Mobile first viewport: needs attention. The hero and benefits push the setup form below the first screen, delaying the main task.
8. Mobile form: healthy. Controls stack cleanly, tap targets are large, and the primary button is full width.

## Highest-Impact Suggestions

1. Auto-scroll or move focus to the interview after generation.
   - Evidence: `02-after-generation-top.png`.
   - Source area: `client/src/App.tsx:67`, `client/src/pages/home-page.tsx:131`.
   - Recommendation: after `createInterview(config)` succeeds, scroll the interview section into view and place focus on the session heading. This makes the app feel guided instead of making the user search for the next step.

2. Treat evaluation reliability as the top MVP blocker.
   - Evidence: `04-evaluation-error.png`; browser network showed two `502` responses for `/api/interview/evaluate`.
   - Recommendation: tighten the answer-evaluation prompt/schema path or add a simple retry/repair pass for invalid AI JSON before returning failure. The UI handles the failure safely, but the product promise depends on feedback.

3. Decide whether "Expected concepts" is study mode or interview mode.
   - Evidence: `03-question-desktop.png`.
   - Source area: `client/src/components/interview/interview-questions.tsx:205`.
   - Recommendation: make concepts collapsed by default behind "Show hints", or add a visible mode switch like "Practice with hints" vs "Mock interview". Showing the grading rubric before answering helps learning but weakens interview realism.

4. Make feedback naturally lead to the next action.
   - Evidence: `05-feedback-success-mocked.png`.
   - Recommendation: after feedback appears, add a compact sticky or inline action row near the feedback header: "Next question" for unfinished sessions, "Complete interview" on the last answered question. Keep existing bottom navigation, but do not make it the only obvious path.

5. Bring the setup form earlier on mobile.
   - Evidence: `07-setup-mobile.png`, `08-form-mobile.png`.
   - Recommendation: on mobile, move the setup form above the benefit list or reduce the hero/benefit block before the form. The current form itself works well once reached.

6. Add final-report closing actions.
   - Evidence: `06-final-report-mocked.png`.
   - Source area: `client/src/components/interview/final-report.tsx:52`.
   - Recommendation: add "Start new interview", "Copy report", and optionally "Download report" actions. For a portfolio MVP, "Copy report" is a small feature with high perceived usefulness.

## Accessibility And Interaction Risks

- API status on mobile becomes icon-only. It has a title, but visible text would be clearer for accessibility and trust.
- The interview session appears dynamically after generation, but focus does not move to the new content. Screen reader and keyboard users may not know the session was added.
- Disabled buttons communicate state visually, but the app could explain requirements more directly near disabled actions, especially "Complete interview".
- The feedback and final report were checked visually, not with a full screen-reader pass. Do not treat this audit as full accessibility compliance.

## Polishing Ideas That Stay MVP-Safe

- Rename "Generating Questions..." to "Generating questions..." for casing consistency.
- Add "Question 1 of 3" to the progress bar as an accessible label.
- Show a short "Answered" marker in the question navigation state after feedback is saved.
- In the final report, group each question breakdown as collapsible on mobile to avoid a very long scroll.
- Add a small "Change setup" or "Start over" action near the saved config summary.

