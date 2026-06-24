# InterviewPilot AI - Master Tasks

## How To Use This File

This file is the main task tracker for InterviewPilot AI.

Rules:

1. Work only on the current active phase.
2. Do not start the next phase until the current phase is fully completed.
3. When a task is completed, change `[ ]` to `[x]` and move it to the `****Stage N Done Tasks****` section.
4. Replace `TODO:` with `DONE:`.
5. If new tasks are discovered, add them under the correct section.
6. Keep explanations short but clear.
7. Do not delete completed tasks.
8. Update the progress section after every completed task.
   At the end of any task-tracker edit, update `Tasks Done: X/Y (Z%)` if the
   number of checked or total tasks changed.
9. Each phase has two sections:
   - `****Stage N Tasks****` - for incomplete, unchecked tasks (at the top for easy access)
   - `****Stage N Done Tasks****` - for completed, checked tasks (at the bottom for reference)
10. Add a short `Why not implemented:` note below each unfinished TODO or task group.

---

# Current Progress

TODO Progress: Tasks Done: 287/324 (89%)

## Active Phase

Phase 1 - MVP

## Phase Status

1. [ ] Phase 1 - MVP

- Why not implemented: The local MVP flow appears implemented, but Phase 1 is
  not fully complete until the project is audited from scratch, documentation
  matches the code, checks pass on the current worktree, the app is deployed,
  production secrets are configured, the online MVP flow is verified, and the
  repository is pushed to GitHub.

## Current Sprint

From-scratch project audit, MVP verification, and production deployment

2. [ ] \***\*Stage 12 Tasks\*\***

- Why not implemented: The local audit and non-secret verification work is
  complete. Remaining Stage 12 work is gated by Daniel's provider keys,
  GitHub publish approval, Render/Vercel account access, and live production
  URLs.

## Latest Known State

3. [x] DONE: Re-run current local automated checks on the current worktree.
4. [x] DONE: Review current uncommitted files before commit or deployment.
5. [x] DONE: Verify local server health and safe AI-unavailable create response.
6. [x] DONE: Verify the local client loads in the browser without console errors.
7. [x] DONE: Add `Intern` and `Generative AI Engineer` across client, server,
       AI prompts, tests, and Markdown documentation.
8. [x] DONE: Verify the frontend MVP flow in a real browser with controlled
       create/evaluate API responses.
9. [x] DONE: Run GitHub-readiness diff hygiene and secret-pattern checks.
10. [x] DONE: Add frontend automated coverage for the new role and level values.

Explanation:

Do not push, deploy, rename folders, or remove generated files until Daniel
explicitly asks for that work.

## Action Needed From Daniel

1. Keep AI provider secrets only in server environments.
   - Local verification is now configured in `server/.env`.
   - Production provider secrets are configured in Render only.
   - Do not put Gemini or Groq provider keys in the client or Vercel.
2. Explicitly ask Codex before any commit, push, branch change, GitHub action, or
   production deployment.
   - Needed next for: staging, committing, pushing to GitHub, or opening a PR.
   - Also decide whether untracked `AGENTS.md` should be committed, ignored, or
     left local-only.
   - GitHub CLI is installed locally, but `gh auth status` currently reports no
     logged-in GitHub host, so GitHub publish work also requires `gh auth login`.
3. Deploy the backend before the frontend because Vercel needs the live backend
   URL for `VITE_API_URL`.
   - Needed next for: Vercel production setup and online MVP verification.
   - Do not put Gemini or Groq API keys in Vercel; Vercel only needs
     `VITE_API_URL`.
4. Provide the live Render backend URL after backend deployment.
   - Needed next for: setting Vercel `VITE_API_URL`, production frontend
     verification, and final public documentation updates if desired.

## What Is Needed To Finish Phase 1

11. [x] Complete the from-scratch repository and architecture audit.
12. [x] Decide and document the final folder structure.
13. [x] Fix documentation drift found during the audit.
14. [ ] Verify the local MVP flow from start to finish.

- Why not implemented: The frontend browser walkthrough passed with
  controlled create/evaluate API responses. A real AI browser walkthrough
  still requires configured provider credentials in `server/.env`.

15. [x] Re-run all existing local checks.
16. [x] DONE: Review and resolve uncommitted files before publishing.

- Evidence: The publish scope was reviewed, only local `AGENTS.md` remained
  intentionally untracked, and the MVP batch was committed cleanly.

17. [x] DONE: Push the reviewed repository changes to GitHub.

- Evidence: The `final-report-mvp-flow` branch was pushed to GitHub after the
  commit `1cc2d40`.

18. [x] DONE: Create the backend service on Render from `render.yaml`.

- Evidence: Render deployed the backend at
  `https://interviewpilot-ai-server.onrender.com` and started
  `node dist/server.js` successfully.

19. [x] DONE: Set Render environment variables: `CLIENT_ORIGIN`, `GEMINI_API_KEY`, and
        optionally `GROQ_API_KEY`.

- Evidence: Render shows `CLIENT_ORIGIN`, `GEMINI_API_KEY`, `GEMINI_MODEL`,
  `GROQ_API_KEY`, `GROQ_MODEL`, and `NODE_ENV` configured. Secret values were
  masked in the dashboard. Follow-up production CORS checks showed the live
  `CLIENT_ORIGIN` did not match the Vercel domains, so `render.yaml` now also
  carries the non-secret Vercel origin allowlist for the next deploy.

20. [x] DONE: Verify Render health endpoint: `/api/health`.

- Evidence: `https://interviewpilot-ai-server.onrender.com/api/health`
  returned `status: ok`.

21. [x] DONE: Create the frontend project on Vercel from `vercel.json`.

- Evidence: The frontend is deployed at
  `https://interviewpilot-ai-bice.vercel.app`.

22. [x] DONE: Set Vercel environment variable: `VITE_API_URL`.

- Evidence: The deployed Vercel JavaScript bundle contains
  `https://interviewpilot-ai-server.onrender.com` and no longer points to
  `http://localhost:3001`.

23. [ ] Verify the full MVP flow on the deployed Vercel URL.

- Why not implemented: There is no live Vercel frontend URL yet.

24. [ ] Confirm frontend browser requests do not expose API keys.

- Why not implemented: Requires production browser verification after deploy.

## Next Task

25. [x] DONE: Verify the local AI-backed interview flow with real provider credentials.

- Evidence: With `GEMINI_API_KEY` and `GROQ_API_KEY` configured in
  `server/.env`, the local backend health check passed, a real
  `POST /api/interview/create` request returned 3 valid questions, a real
  `POST /api/interview/evaluate` request returned a valid structured
  evaluation, and the parser was patched to handle the Gemini array-wrapped
  response shape observed during live testing.

26. [ ] TODO: If Daniel wants GitHub updated next, decide the `AGENTS.md` publish
        scope and explicitly ask Codex to commit and push.

- Why not implemented: Codex must not commit, push, or change Git history
  without explicit approval, and GitHub CLI auth still needs `gh auth login`.

---

## \***\*Stage 12 Tasks\*\***

27. [ ] \***\*Stage 12 - From-Scratch Audit, Stabilization, and Deployment\*\***

#### 12.12 Role And Experience-Level Expansion Remaining Verification

28. [x] DONE: Add frontend automated tests for both new options after a client
        test runner is added.

- Evidence: Added a client `test` script and `client/src/types/interview.test.ts`
  coverage for the `Generative AI Engineer` role, `Intern` level, derived
  role/level arrays, and display-label helpers.

29. [ ] TODO: Add evaluation-dataset cases for Generative AI Engineer and Intern
        against real providers.

- Why not implemented: The offline mocked evaluation dataset now exists and
  passes through `npm run eval`. Real Gemini/Groq evaluation requires Daniel
  to configure `GEMINI_API_KEY` or `GROQ_API_KEY` in the server environment.

30. [ ] TODO: Manually test all new real-AI interview combinations in the browser.

- Why not implemented: This requires running the full local UI with configured
  AI provider credentials and completing each representative interview flow.

31. [ ] TODO: Re-check Supabase constraints when database schema files are added.

- Why not implemented: The repository currently has no Supabase migrations,
  SQL schema, generated database types, seed data, enum constraints, or check
  constraints to migrate.

Explanation:

The code and documentation now support the new role and level. These remaining
items are verification or future-pipeline tasks that cannot be honestly marked
done from the current repository contents alone.

#### 12.3 Frontend MVP Flow Audit

32. [x] DONE: Verify the user can select role.
33. [x] DONE: Verify the user can select level.
34. [x] DONE: Verify the user can select interview type.
35. [x] DONE: Verify the user can select question count.
36. [x] DONE: Verify invalid or missing selections are handled safely.
37. [x] DONE: Verify question generation shows loading, success, and safe error
        states.
38. [x] DONE: Verify generated questions render one at a time.
39. [x] DONE: Verify question navigation works without losing answers or feedback.
40. [x] DONE: Verify empty answers are blocked before API submission.
41. [x] DONE: Verify submitted answers show evaluation loading, success, and safe
        error states.
42. [x] DONE: Verify feedback displays score, strengths, weaknesses, missing
        concepts, improved answer, and confidence level.
43. [x] DONE: Verify the interview cannot be completed until all questions have
        feedback.
44. [x] DONE: Verify completing the interview shows final-report loading and then
        the final report.
45. [x] DONE: Verify the final report shows overall score, summaries, knowledge
        gaps, recommended topics, roadmap, and per-question detail.
46. [x] DONE: Verify starting a new interview clears the previous session state.
47. [x] DONE: Verify desktop and mobile layouts do not overlap, clip content, or
        hide required controls.
48. [x] DONE: Verify basic accessibility: labels, focus movement, alert regions,
        button disabled states, and keyboard navigation.

Explanation:

The frontend MVP flow was verified in a real browser using controlled
create/evaluate API responses. The test selected `Generative AI Engineer`,
`Intern`, `Technical`, and `3`, confirmed the submitted API payload, checked
loading/success/error states, completed all answers, rendered the final report,
reset the session, checked desktop/mobile overflow, and confirmed no
secret-looking API key text appeared in the page.

---

#### 12.7 Local Manual MVP Smoke Test

49. [x] DONE: Start the backend locally.
50. [x] DONE: Start the frontend locally.
51. [x] DONE: Verify `/api/health` in the browser or PowerShell.
52. [ ] TODO: Generate a 3-question interview with real AI credentials.

- Why not implemented: Requires Daniel to configure `GEMINI_API_KEY` or
  `GROQ_API_KEY` in `server/.env`; do not put provider keys in the client or
  Vercel.

53. [ ] TODO: Submit answers for all questions.

- Why not implemented: Depends on first generating a real-provider interview
  with `GEMINI_API_KEY` or `GROQ_API_KEY` configured in `server/.env`.

54. [ ] TODO: Confirm feedback appears for each answer.

- Why not implemented: Requires real AI answer evaluation through the local
  backend after provider credentials are configured.

55. [ ] TODO: Complete the interview.

- Why not implemented: Requires a real-provider browser walkthrough with all
  generated questions answered and evaluated.

56. [ ] TODO: Confirm the final report renders correctly.

- Why not implemented: Requires completing the real-provider browser
  walkthrough first; the report was already verified with controlled API
  responses.

57. [x] DONE: Test backend-down behavior from the frontend.

- Evidence: With only the Vite client running and no backend on port `3001`,
  the header showed `API unavailable`, starting an interview displayed
  `Unable to reach the InterviewPilot API. Make sure the backend is running.`,
  and the page did not expose key-like text.

58. [x] DONE: Test missing-provider-key behavior from the backend.

- Evidence: An in-process Express HTTP request with `GEMINI_API_KEY` and
  `GROQ_API_KEY` forced empty returned `503` with code `AI_NOT_CONFIGURED`
  and no secret-looking values, stack traces, or local source paths.

59. [x] DONE: Check browser developer tools for exposed API keys.

- Evidence: Browser-delivered HTML and dev-served scripts were inspected for
  Gemini/Groq key patterns and `GEMINI_API_KEY` / `GROQ_API_KEY` assignments;
  none were found.

60. [x] DONE: Capture or update screenshots only if the UI changed.

- Evidence: Refreshed the setup, answer-feedback, and final-report screenshots
  with controlled API responses after the role/level UI changed. Real AI
  smoke testing still requires `GEMINI_API_KEY` or `GROQ_API_KEY` in
  `server/.env`.

Explanation:

This confirms the app works as a user-facing MVP, not just as isolated code.

---

#### 12.8 GitHub Readiness

61. [x] DONE: Review the current changed-file set before staging.
62. [x] DONE: Confirm the intended publish package is the role/level expansion,
        prompt/evaluation updates, tests, documentation, tracker updates, and
        `.gitignore`.
63. [x] DONE: Inspect untracked `AGENTS.md`.
64. [ ] TODO: Decide whether untracked `AGENTS.md` should be committed, ignored,
        or left local-only.

- Why not implemented: This file contains project-level Codex instructions,
  but Codex should not assume whether Daniel wants it published.

65. [ ] TODO: Stage only files that belong to the completed task.

- Why not implemented: Staging is intentionally deferred until Daniel asks
  for commit or GitHub work.

66. [ ] TODO: Commit only after Daniel explicitly asks for a commit.
67. [ ] TODO: Push only after Daniel explicitly asks for a push.
68. [ ] TODO: Open or update a pull request only if Daniel asks for GitHub PR work.

- Why not implemented: Codex must not commit, push, or change Git history
  without an explicit request.

Explanation:

GitHub should receive only reviewed, intentional changes. The reviewed publish
package is ready for Daniel's approval, except for the explicit `AGENTS.md`
decision.

---

#### 12.9 Deploy Backend

69. [x] DONE: Create the backend service on Render from `render.yaml`.
70. [ ] TODO: Set `CLIENT_ORIGIN` in Render to the live Vercel frontend URL.
71. [x] DONE: Set `GEMINI_API_KEY` in Render.
72. [x] DONE: Optionally set `GROQ_API_KEY` in Render for fallback AI generation.
73. [x] DONE: Verify Render health endpoint returns `status: ok`.

- Evidence: The backend is live at
  `https://interviewpilot-ai-server.onrender.com`, Render shows provider
  variables configured with masked values, and `/api/health` returned
  `status: ok`. Current live CORS checks still need the next Render deploy to
  pick up the Vercel origin allowlist committed in `render.yaml`.

Explanation:

The backend must be live before configuring the frontend production API URL.

---

#### 12.10 Deploy Frontend

74. [x] DONE: Create the frontend project on Vercel from `vercel.json`.
75. [x] DONE: Set `VITE_API_URL` in Vercel to the live Render backend URL.
76. [x] DONE: Deploy the frontend.
77. [ ] TODO: Verify the deployed frontend loads without console errors.

- Evidence: `https://interviewpilot-ai-bice.vercel.app` returns the deployed
  frontend HTML, and the current bundle points at the Render backend URL.
  Browser-console verification is still pending.

Explanation:

Vercel hosts the user-facing app.

---

#### 12.11 Production Verification

78. [ ] TODO: Verify the deployed Vercel URL can reach the Render backend.
79. [ ] TODO: Test the full MVP flow online.
80. [x] DONE: Verify AI question generation works in production.
81. [x] DONE: Verify AI answer evaluation works in production.
82. [ ] TODO: Verify final report generation works in production.
83. [ ] TODO: Verify production user-facing errors stay simple and safe.
84. [ ] TODO: Verify browser network requests do not expose Gemini or Groq keys.
85. [ ] TODO: Update docs with final production URLs only if they are intended to
        be public project documentation.

- Why not implemented: Backend production AI verification passed, and Vercel
  now points at Render, but live CORS checks still fail until Render deploys
  the updated origin allowlist.

Explanation:

This confirms Phase 1 is ready to share.

---

## \***\*Stage 12 Done Tasks\*\***

86. [x] \***\*Stage 12 - Structure And Documentation Audit\*\***

#### 12.1 Project Structure And Architecture Audit

87. [x] DONE: Rename source folders to `client/` and `server/`.
88. [x] DONE: Update workspace names, package lock entries, scripts, deployment
        configs, docs, screenshot references, and local command examples.
89. [x] DONE: Verify frontend code stays inside the `client/` folder.
90. [x] DONE: Verify backend code stays inside the `server/` folder.
91. [x] DONE: Verify provider SDKs and AI API calls exist only in the server.
92. [x] DONE: Verify client code has no Gemini or Groq API keys, provider SDK
        imports, or direct provider requests.
93. [x] DONE: Verify root `package.json`, workspace config, `vercel.json`, and
        `render.yaml` match the final folder structure.

Explanation:

The repository now matches the expected `client/` and `server/` structure.
Provider SDKs remain in `server/src/ai/providers`, while the client only calls
the JSON API through `VITE_API_URL`.

---

#### 12.2 Documentation Audit

94. [x] DONE: Update `README.md` setup, scripts, structure, and deployment notes.
95. [x] DONE: Update `docs/MVP_SCOPE.md` for current included and excluded work.
96. [x] DONE: Update `docs/ARCHITECTURE.md` so it includes answer evaluation and
        frontend-generated final reports.
97. [x] DONE: Review `docs/API_DESIGN.md`; no contract changes were needed.
98. [x] DONE: Review `docs/AI_PROMPT_DESIGN.md`; it already matched the prompt
        reliability and final-report behavior.
99. [x] DONE: Update `docs/manual-testing.md` command paths.
100.  [x] DONE: Update `docs/DEPLOYMENT.md` command paths and workspace names.
101.  [x] DONE: Update `docs/DevQ&A.md` to remove outdated phase guidance.
102.  [x] DONE: Update audit-note source paths for the renamed client folder.

Explanation:

Docs now describe the current MVP flow and the `client/`/`server/` layout.
Screenshots were not replaced because this task changed paths and docs, not the
visible UI screenshots.

---

103. [x] \***\*Stage 12 - Backend/API And AI Reliability Audit\*\***

#### 12.4 Backend And API Contract Audit

104. [x] DONE: Verify `GET /api/health` response shape and status.
105. [x] DONE: Verify `POST /api/interview/create` validates request body before
         calling AI.
106. [x] DONE: Verify `POST /api/interview/create` returns `interviewId` and the
         exact requested number of validated questions.
107. [x] DONE: Verify `POST /api/interview/evaluate` validates the question and
         answer before calling AI.
108. [x] DONE: Verify `POST /api/interview/evaluate` returns the documented
         feedback shape.
109. [x] DONE: Verify client response parsers match backend response contracts.
110. [x] DONE: Verify invalid JSON requests return safe JSON errors.
111. [x] DONE: Verify unknown routes return safe JSON errors.
112. [x] DONE: Verify unexpected backend errors do not expose stack traces or raw AI
         provider errors.
113. [x] DONE: Verify CORS uses `CLIENT_ORIGIN` and supports the needed local
         origin.

Explanation:

The automated API contract tests passed, `/api/health` passed locally, and a
real 3-question create/evaluate API smoke test returned valid structured
feedback for all answers.

---

#### 12.5 AI JSON Reliability And Security Audit

114. [x] DONE: Verify question-generation prompt requests strict JSON only.
115. [x] DONE: Verify answer-evaluation prompt requests strict JSON only.
116. [x] DONE: Verify prompts avoid markdown-wrapped JSON.
117. [x] DONE: Verify generated interview parsing rejects malformed JSON.
118. [x] DONE: Verify generated interview parsing rejects wrong question counts.
119. [x] DONE: Verify generated interview parsing rejects missing or invalid
         `topic`, `difficulty`, `question`, and `expectedConcepts`.
120. [x] DONE: Verify answer evaluation parsing rejects invalid score, lists,
         improved answer, and confidence level.
121. [x] DONE: Verify invalid answer-evaluation JSON gets one strict retry before
         failing safely.
122. [x] DONE: Verify malformed AI output cannot crash the backend or frontend.
123. [x] DONE: Verify Gemini is primary and Groq is fallback only when configured.
124. [x] DONE: Verify missing provider keys produce a safe user-facing error.
125. [x] DONE: Verify full API keys are never logged or returned.
126. [x] DONE: Verify candidate answers are treated as untrusted prompt input.
127. [x] DONE: Request provider-level JSON output from Gemini and Groq where
         supported.

Explanation:

The backend validates AI output before returning it. Answer-evaluation parsing
now tolerates common harmless provider drift such as wrapped feedback objects,
numeric score strings, and confidence-level casing while still rejecting missing
or unsafe fields.

---

128. [x] \***\*Stage 12 - Local Smoke Progress\*\***

#### 12.7 Partial Local Manual MVP Smoke Test

129. [x] DONE: Start the backend locally.
130. [x] DONE: Start the frontend locally.
131. [x] DONE: Verify `/api/health` in PowerShell.
132. [x] DONE: Generate a 3-question interview with real AI credentials.
133. [x] DONE: Submit answers for all questions through the API.
134. [x] DONE: Confirm feedback appears for each API answer response.
135. [x] DONE: Verify the local client loads in the browser without console errors.

Explanation:

The full API flow works locally with real AI credentials. The remaining manual
smoke-test gap is a browser-driven walkthrough that fills the form, completes
the interview, and visually confirms the final report.

---

136. [x] \***\*Stage 12 - Current Audit Progress\*\***

#### 12.0 Review Current Worktree

137. [x] DONE: Inspect `git status --short` before making any audit fixes.
138. [x] DONE: Identify every modified tracked file and why it changed.
139. [x] DONE: Identify every untracked file or folder and whether it should be
         kept, ignored, documented, or removed.
140. [x] DONE: Preserve user changes and avoid reverting unrelated work.

Explanation:

Current tracked changes are focused in backend AI JSON reliability tests/service
code and frontend interview flow/report UX. Untracked
`output/playwright/design-audit/` files are audit screenshots and notes; keep
them for now unless Daniel asks to remove or ignore generated output.

---

141. [x] \***\*Stage 12 - Local Automated Checks\*\***

#### 12.6 Local Automated Checks

142. [x] DONE: Confirm available scripts in root, client, and server
         `package.json` files before running them.
143. [x] DONE: Run client `npm run typecheck`.
144. [x] DONE: Run client `npm run lint`.
145. [x] DONE: Run client `npm run build`.
146. [x] DONE: Note that client has no `npm run check` unless one is added.
147. [x] DONE: Run server `npm run check`.
148. [x] DONE: Run server `npm run typecheck`.
149. [x] DONE: Run server `npm run test`.
150. [x] DONE: Run server `npm run build`.
151. [x] DONE: Note that server has no `npm run lint` unless one is added.
152. [x] DONE: Run root `npm run check`.
153. [x] DONE: Run root `npm run build`.
154. [x] DONE: Record any failures with the command, error summary, and file path.

Explanation:

All existing local automated checks passed on the current worktree. No client
`check` script or server `lint` script exists.

---

155. [x] \***\*Stage 12 - Deployment Preparation\*\***

#### 12.0 Prepare Production Deployment

156. [x] DONE: Add Vercel config for frontend deployment
157. [x] DONE: Add Render Blueprint config for backend deployment
158. [x] DONE: Document required production environment variables
159. [x] DONE: Document production verification checklist
160. [x] DONE: Verify frontend lint and build pass locally
161. [x] DONE: Verify backend check and build pass locally

Explanation:

The repository is ready to import into Vercel and Render. The remaining work is
account-bound deployment, secret setup, and online verification.

---

162. [x] \***\*Stage 12 - Role And Experience-Level Expansion\*\***

#### 12.12 Role And Experience-Level Expansion

163. [x] DONE: Add `Intern` to the centralized experience-level configuration.
164. [x] DONE: Add `Generative AI Engineer` to the centralized role
         configuration.
165. [x] DONE: Derive client and server TypeScript types from central values.
166. [x] DONE: Update frontend role and level selectors.
167. [x] DONE: Update frontend summaries and final-report labels.
168. [x] DONE: Update backend request validation for stable role and level values.
169. [x] DONE: Preserve compatibility for known legacy display-label request
         values by normalizing them at the backend boundary.
170. [x] DONE: Update API contracts and examples.
171. [x] DONE: Add Intern difficulty guidance to interview-generation prompts.
172. [x] DONE: Add Generative AI Engineer role guidance to interview-generation
         prompts.
173. [x] DONE: Keep AI Engineer broader than Generative AI Engineer in prompt
         guidance.
174. [x] DONE: Update answer-evaluation rubric guidance for Intern candidates.
175. [x] DONE: Add Generative AI Engineer missing-concept guidance for relevant
         answer-evaluation prompts.
176. [x] DONE: Inspect database and Supabase files.
177. [x] DONE: Confirm no Supabase migration is required in the current repo
         because no migrations, SQL schema, generated database types, seed data, enum
         constraints, or check constraints exist.
178. [x] DONE: Update backend validation, prompt, and API route tests.
179. [x] DONE: Update README and Markdown project documentation.
180. [x] DONE: Run client lint, typecheck, and build.
181. [x] DONE: Run server typecheck, tests, and build.
182. [x] DONE: Run root `npm run check`.
183. [x] DONE: Add an offline evaluation dataset with representative Intern and
         Generative AI Engineer cases.
184. [x] DONE: Add root and server `npm run eval` scripts.
185. [x] DONE: Document the offline evaluation runner and provider-key boundary.
186. [x] DONE: Run `npm run eval`.

Explanation:

The app now stores role and level selections as stable API values while showing
human-readable labels in the UI. The backend validates only supported values,
normalizes known old labels, and uses the stable values for prompt generation
and AI output validation. The first evaluation pipeline is intentionally
offline and mocked; real provider evals remain blocked until Daniel configures
server-side provider credentials.

---

187. [x] \***\*Stage 12 - GitHub Readiness Progress\*\***

#### 12.8 GitHub Readiness Progress

188. [x] DONE: Review the current `git diff --stat`.
189. [x] DONE: Review the current `git diff --name-status`.
190. [x] DONE: Review the current `git diff --numstat`.
191. [x] DONE: Inspect untracked `AGENTS.md`; it contains project-level Codex
         instructions.
192. [x] DONE: Run `git diff --check`.
193. [x] DONE: Run a secret-pattern scan for Gemini and Groq key-looking values.
194. [x] DONE: Confirm the only secret-scan hits are placeholder docs examples.
195. [x] DONE: Add `.playwright-mcp/` to `.gitignore` so browser QA scratch files
         stay out of Git status.

Explanation:

The working tree is clean enough for a scoped commit once Daniel approves the
publish step. Remaining GitHub readiness work is a decision about untracked
`AGENTS.md`, then staging, committing, and pushing only the intended files.

---

196. [x] \***\*Stage 12 - Evaluation Pipeline Foundation\*\***

#### 12.13 Offline Evaluation Pipeline

197. [x] DONE: Add a fixed evaluation dataset under `server/src/evals`.
198. [x] DONE: Include representative cases for Generative AI Engineer, AI
         Engineer, Frontend Developer, and Intern expectations.
199. [x] DONE: Include expected score ranges and missing-concept expectations.
200. [x] DONE: Reuse the real answer-evaluation prompt builder.
201. [x] DONE: Reuse the real answer-evaluation parser and schema validation.
202. [x] DONE: Report schema pass rate, score agreement, missing-concept accuracy,
         passed cases, and failed cases.
203. [x] DONE: Add `npm run eval` at the root and server workspace.
204. [x] DONE: Document that the current eval is offline and mocked.
205. [x] DONE: Document that real provider evals require `GEMINI_API_KEY` or
         `GROQ_API_KEY` in the server environment.

Explanation:

The project now has a repeatable local evaluation command that does not require
provider secrets. It validates prompt guidance and structured-output parsing
against a fixed dataset. Real Gemini/Groq evals are a later verification step
because they require Daniel's provider credentials.

---

206. [x] \***\*Stage 12 - Screenshot Refresh\*\***

#### 12.14 Documentation Screenshots

207. [x] DONE: Refresh `docs/screenshots/01-interview-setup.png`.
208. [x] DONE: Refresh `docs/screenshots/02-answer-feedback.png`.
209. [x] DONE: Refresh `docs/screenshots/03-final-report.png`.
210. [x] DONE: Capture the screenshots with the new `Generative AI Engineer` and
         `Intern` options visible in the representative flow.
211. [x] DONE: Use controlled API responses so no provider key is required for the
         screenshot refresh.

Explanation:

The documentation screenshots now match the updated role/level UI and show the
setup, answer-feedback, and final-report states. This was a screenshot refresh
only; the real-provider manual smoke test remains open until Daniel provides
`GEMINI_API_KEY` or `GROQ_API_KEY` in the server environment.

---

212. [x] \***\*Stage 12 - Local Safety Smoke Checks\*\***

#### 12.15 Backend-Down, Missing-Key, And Secret-Exposure Checks

213. [x] DONE: Verify frontend behavior when the backend is down.
214. [x] DONE: Verify backend behavior when no AI provider key is configured.
215. [x] DONE: Verify browser-delivered client code does not expose Gemini or Groq
         API keys.

Explanation:

The client was tested with no backend running and showed a safe unavailable API
state plus a safe interview-generation error. The backend was tested through an
in-process Express HTTP request with `GEMINI_API_KEY` and `GROQ_API_KEY` forced
empty; it returned `503` and `AI_NOT_CONFIGURED` without exposing secrets,
stacks, or local source paths. Browser-delivered HTML and dev-served scripts did
not contain Gemini/Groq key patterns or provider-key environment assignments.

---

216. [x] \***\*Stage 12 - Frontend Test Runner Foundation\*\***

#### 12.16 Client Role/Level Configuration Tests

217. [x] DONE: Add a client test script.
218. [x] DONE: Add automated coverage for `Generative AI Engineer`.
219. [x] DONE: Add automated coverage for `Intern`.
220. [x] DONE: Verify derived client role/level arrays match the central
         configuration values.
221. [x] DONE: Include the client tests in the root `npm run check` gate.

Explanation:

The client now has a lightweight Node test runner powered by the existing `tsx`
runtime. The new test locks the role/level source of truth, derived arrays, and
label helpers so future UI changes are less likely to drop the new options.

---

## \***\*Stage 1 Done Tasks\*\***

222. [x] \***\*Stage 1 - Project Setup\*\***

##### 1.1 Create Main Project Folder

223. [x] DONE: Create main folder named `InterviewPilot-AI`

Explanation:

This folder will contain the entire project.

Expected result:

```txt
InterviewPilot-AI/
```

---

#### 1.2 Create Main Subfolders

224. [x] DONE: Create `frontend` folder
225. [x] DONE: Create `backend` folder
226. [x] DONE: Create `docs` folder

Explanation:

`frontend` is the website users see.
`backend` is the server that talks to the AI.
`docs` contains project documentation and planning.

Expected result:

```txt
InterviewPilot-AI/
â”œâ”€â”€ client/
â”œâ”€â”€ server/
â””â”€â”€ docs/
```

---

#### 1.3 Create Documentation Files

227. [x] DONE: Create `README.md`
228. [x] DONE: Create `docs/MASTER_TASKS.md`
229. [x] DONE: Create `docs/PROJECT_PLAN.md`
230. [x] DONE: Create `docs/MVP_SCOPE.md`
231. [x] DONE: Create `docs/ARCHITECTURE.md`
232. [x] DONE: Create `docs/API_DESIGN.md`
233. [x] DONE: Create `docs/AI_PROMPT_DESIGN.md`

Explanation:

These files make the project easier to understand for the developer, Codex, and recruiters.

---

234. [x] \***\*Stage 2 - Frontend Setup\*\***

#### 2.1 Create React App

235. [x] DONE: Create React + Vite + TypeScript app inside `frontend`

Explanation:

React builds the user interface.
Vite creates the React project quickly.
TypeScript helps prevent code mistakes.

Expected result:

The app runs locally in the browser.

---

#### 2.2 Install Tailwind CSS

236. [x] DONE: Install and configure Tailwind CSS

Explanation:

Tailwind is used to style the website quickly with clean modern design.

Expected result:

The frontend can use Tailwind classes for layout, colors, spacing, and buttons.

---

#### 2.3 Install shadcn/ui

237. [x] DONE: Install and configure shadcn/ui

Explanation:

shadcn/ui gives ready-made professional components such as buttons, cards, inputs, and textareas.

Expected result:

The project can use reusable UI components instead of building everything from zero.

---

238. [x] \***\*Stage 3 - Backend Setup\*\***

#### 3.1 Create Express Server

239. [x] DONE: Create Express + TypeScript backend inside `backend`

Explanation:

Express is the backend server.
It receives requests from the frontend and sends requests to Gemini.

Expected result:

The backend runs locally.

---

#### 3.2 Create Health Check Endpoint

240. [x] DONE: Create `GET /api/health`

Explanation:

This is a simple endpoint used to verify that the backend is working.

Expected response:

```json
{
  "status": "ok"
}
```

---

241. [x] \***\*Stage 4 - Frontend Backend Connection\*\***

#### 4.1 Create API Client

242. [x] DONE: Create frontend API service file

Explanation:

This file will contain functions that call the backend.

Expected result:

The frontend can send requests to the backend in an organized way.

---

#### 4.2 Test Connection

243. [x] DONE: Call `/api/health` from the frontend

Explanation:

The frontend calls the backend health endpoint when the app loads and shows whether the API is connected.

Expected result:

The frontend receives `status: ok` and displays `API connected`.

---

244. [x] \***\*Stage 5 - Interview Configuration UI\*\***

#### 5.1 Create Homepage

245. [x] DONE: Create homepage
246. [x] DONE: Add project title
247. [x] DONE: Add short product description
248. [x] DONE: Add Start Interview button

Explanation:

This is the first page the user sees.

---

#### 5.2 Create Role Selection

249. [x] DONE: Add Frontend Developer option
250. [x] DONE: Add Backend Developer option
251. [x] DONE: Add Full Stack Developer option
252. [x] DONE: Add AI Engineer option
253. [x] DONE: Add Generative AI Engineer option

Explanation:

The role tells the AI what type of interview questions to generate.

---

#### 5.3 Create Experience Level Selection

254. [x] DONE: Add Intern option
255. [x] DONE: Add Junior option
256. [x] DONE: Add Mid-Level option
257. [x] DONE: Add Senior option

Explanation:

The experience level controls the difficulty of the questions.

---

#### 5.4 Create Interview Type Selection

258. [x] DONE: Add Technical option
259. [x] DONE: Add Behavioral option
260. [x] DONE: Add Mixed option

Explanation:

The selected interview type is stored in the frontend configuration and displayed in the current setup summary.

---

#### 6.1 Create Gemini Service

261. [x] DONE: Create Gemini AI service in backend

Explanation:

This service is responsible for sending prompts to Gemini and receiving AI responses.

---

#### 6.2 Create Question Prompt Builder

262. [x] DONE: Create prompt builder for interview questions
263. [x] DONE: Add interview type to the request model and question prompt

Explanation:

The backend validates `interviewType` and includes it in the Gemini prompt so
Technical, Behavioral, and Mixed interviews generate different question styles.

---

#### 6.3 Create Interview Endpoint

264. [x] DONE: Create `POST /api/interview/create`

Explanation:

This endpoint receives the user's interview settings and returns AI-generated questions.

Expected input:

```json
{
  "role": "generative-ai-engineer",
  "level": "intern",
  "interviewType": "Mixed",
  "questionCount": 5
}
```

Expected output:

```json
{
  "interviewId": "interview-...",
  "questions": []
}
```

---

265. [x] \***\*Stage 7 - Interview Session UI\*\***

#### 7.1 Display Questions (Completed Items)

266. [x] DONE: Show question number
267. [x] DONE: Show topic
268. [x] DONE: Show difficulty
269. [x] DONE: Show one question at a time

Explanation:

This creates the actual interview experience.

---

#### 7.2 Add Answer Box

270. [x] DONE: Add textarea for user answer
271. [x] DONE: Add Submit Answer button

Explanation:

The user can write and locally submit an answer for each generated question.

---

272. [x] \***\*Stage 8 - Answer Evaluation\*\***

#### 8.1 Create Evaluation Prompt Builder

273. [x] DONE: Create prompt builder for answer evaluation

Explanation:

The backend now builds a strict JSON prompt for grading one submitted answer.

It asks the AI to return:

- score
- strengths
- weaknesses
- missing concepts
- improved answer
- confidence level

---

#### 8.2 Create Evaluation Endpoint

274. [x] DONE: Create `POST /api/interview/evaluate`

Explanation:

The endpoint receives a question and user answer, sends a strict prompt to the
AI provider layer, validates the returned JSON, and returns safe feedback.

---

#### 8.3 Display Feedback

275. [x] DONE: Display score
276. [x] DONE: Display strengths
277. [x] DONE: Display weaknesses
278. [x] DONE: Display missing concepts
279. [x] DONE: Display improved answer

Explanation:

The frontend now evaluates submitted answers and shows structured feedback below
the current question.

---

#### 9.1 Store Interview Results

280. [x] DONE: Store all questions
281. [x] DONE: Make submitted answers available to the final report flow
282. [x] DONE: Store all user answers
283. [x] DONE: Store all AI evaluations

Explanation:

This data is needed to generate the final report.

---

284. [x] \***\*Stage 9 - Final Report\*\***

#### 9.2 Create Final Report Screen

285. [x] DONE: Show overall score
286. [x] DONE: Show strengths summary
287. [x] DONE: Show weaknesses summary
288. [x] DONE: Show knowledge gaps
289. [x] DONE: Show learning roadmap
290. [x] DONE: Show recommended topics

Explanation:

The frontend now stores evaluated answers in parent state and shows a final
report after every question has feedback.

---

#### 10.1 Loading States (Completed Items)

291. [x] DONE: Add loading state while generating questions
292. [x] DONE: Add loading state while evaluating answers
293. [x] DONE: Add loading state while generating final report

Explanation:

Loading states prevent the app from feeling broken while AI is working.

---

#### 10.2 Error Handling (Completed Items)

294. [x] DONE: Handle Gemini API errors
295. [x] DONE: Handle backend errors
296. [x] DONE: Handle invalid selections
297. [x] DONE: Handle empty answers

Explanation:

This makes the project feel more production-ready.

---

#### 11.1 Update README (Completed Items)

298. [x] DONE: Explain what the project does
299. [x] DONE: List technologies used
300. [x] DONE: Explain how to run locally
301. [x] DONE: Explain AI features
302. [x] DONE: Update complete MVP feature description
303. [x] DONE: Add screenshots

---

#### 11.2 Update Architecture Document

304. [x] DONE: Explain frontend
305. [x] DONE: Explain backend
306. [x] DONE: Explain AI flow
307. [x] DONE: Explain API structure

---

#### 11.3 Update Prompts Document (Completed Items)

308. [x] DONE: Document question generation prompt
309. [x] DONE: Document answer evaluation prompt
310. [x] DONE: Document final report prompt

---

# Phase 1 Completion Checklist

311. [x] DONE: User can open homepage
312. [x] DONE: User can select role
313. [x] DONE: User can select experience level
314. [x] DONE: User can select interview type
315. [x] DONE: AI generates questions
316. [x] DONE: User can answer questions
317. [x] DONE: AI evaluates answers
318. [x] DONE: User can move between questions
319. [x] DONE: Final report is generated
320. [ ] TODO: App works online

- Why not implemented: Deployment configuration is ready, but there is no
  verified live Vercel/Render production URL yet.

321. [x] DONE: README is complete
322. [ ] TODO: GitHub repository is updated

- Why not implemented: Codex was not explicitly asked to commit or push, and
  current local changes have not been committed and pushed yet.

---

# Phase 2 - Locked Until Phase 1 Is Complete

Phase 2 will include:

- User accounts
- Supabase Auth
- Interview history
- Saved reports
- Basic dashboard

Do not start Phase 2 before Phase 1 is fully completed.

---

323. [ ] Phase 2 - User Accounts + History

- Why not implemented: Phase 2 is locked until the Phase 1 MVP is complete.

324. [ ] Phase 3 - Resume Upload + Personalization

- Why not implemented: Phase 3 is locked until the earlier phases are complete.

325. [ ] Phase 4 - Voice Interviews

- Why not implemented: Phase 4 is locked until the earlier phases are complete.

326. [ ] Phase 5 - AI Career Coach

- Why not implemented: Phase 5 is locked until the earlier phases are complete.

327. [ ] \***\*Stage 2 Tasks\*\***

- Why not implemented: Phase 2 is locked until the Phase 1 MVP is complete.

# Codex Rule

Before making code changes, Codex must:

1. Read this file.
2. Find the next unchecked TODO in the `****Stage N Tasks****` section of the active phase.
3. Complete only that task or a small related group of tasks.
4. Update this file after completion.
5. Move completed tasks from `****Stage N Tasks****` to `****Stage N Done Tasks****` and change `[ ]` to `[x]`.
6. Keep all completed tasks visible (do not delete them).
7. Do not start locked phases.
