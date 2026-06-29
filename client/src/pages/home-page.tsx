import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  LockKeyhole,
  LoaderCircle,
  Shield,
  Sparkles,
  RotateCcw,
  Star,
  UsersRound,
} from "lucide-react";
import type { RefObject } from "react";

import { FinalReport } from "@/components/interview/final-report";
import { InterviewConfigForm } from "@/components/interview/interview-config-form";
import { InterviewQuestions } from "@/components/interview/interview-questions";
import { SavedConfigSummary } from "@/components/interview/saved-config-summary";
import { Button } from "@/components/ui/button";
import type {
  CreateInterviewResponse,
  InterviewConfig,
  InterviewQuestionResult,
} from "@/types/interview";

type HomePageProps = {
  error: string;
  interview: CreateInterviewResponse | null;
  interviewResults: Record<string, InterviewQuestionResult>;
  isReportLoading: boolean;
  isReportVisible: boolean;
  isLoading: boolean;
  onCompleteInterview: () => void;
  onRetryReport: () => void;
  onResultChange: (result: InterviewQuestionResult) => void;
  onResultRemove: (questionId: string) => void;
  onStartNewInterview: () => void;
  onStartInterview: (config: InterviewConfig) => void | Promise<void>;
  savedConfig: InterviewConfig | null;
  reportError: string;
  setupResetKey: number;
  sessionRef: RefObject<HTMLElement | null>;
  setupRef: RefObject<HTMLDivElement | null>;
};

const benefits = [
  {
    accent: "blue",
    icon: UsersRound,
    title: "Role-Based Interviews",
    description: "Choose from Frontend, Backend, Full Stack, or AI Engineer roles.",
    tags: ["Frontend", "Backend", "Full Stack", "AI Engineer"],
  },
  {
    accent: "violet",
    icon: FileText,
    title: "Realistic Questions",
    description: "Practice Technical, Behavioral, or Mixed interviews tailored to you.",
    tags: ["Technical", "Behavioral", "Mixed"],
  },
  {
    accent: "green",
    icon: Star,
    title: "AI Evaluation",
    description: "Get feedback on strengths, weaknesses, and missing concepts.",
    tags: ["Strengths", "Weaknesses", "Missing Concepts"],
  },
  {
    accent: "amber",
    icon: BookOpen,
    title: "Learning Plan",
    description: "Receive personalized recommendations to improve.",
    tags: ["Recommendations", "Roadmap", "Growth"],
  },
]

const proofPoints = [
  {
    icon: Shield,
    title: "AI-Powered",
    description: "Gemini + Groq",
  },
  {
    icon: CheckCircle2,
    title: "Structured Feedback",
    description: "Detailed & Actionable",
  },
  {
    icon: LockKeyhole,
    title: "Private & Secure",
    description: "Your data is safe",
  },
]

const scoreRows = [
  ["Technical Knowledge", "8.5", "82%"],
  ["Problem Solving", "8.0", "74%"],
  ["Communication", "7.8", "69%"],
  ["Code Quality", "8.4", "81%"],
] as const

const topicPills = [
  { label: "React", level: "High", className: "bg-emerald-500/12 text-emerald-300" },
  { label: "JavaScript", level: "High", className: "bg-emerald-500/12 text-emerald-300" },
  { label: "CSS", level: "Medium", className: "bg-primary/12 text-blue-300" },
  { label: "System Design", level: "Low", className: "bg-amber-500/12 text-amber-300" },
] as const

function scrollToSetup(setupRef: RefObject<HTMLDivElement | null>) {
  setupRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  window.requestAnimationFrame(() => {
    const setupHelpButton =
      setupRef.current?.querySelector<HTMLButtonElement>(
        'button[aria-label="Setup help"]',
      )

    setupHelpButton?.focus({ preventScroll: true })
  })
}

function LandingScorePreview() {
  return (
    <div className="glass-panel relative overflow-hidden rounded-[1.35rem] border-primary/55 p-4 shadow-[0_0_60px_rgb(47_107_255_/_0.18)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative z-10 grid gap-4">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.8fr]">
          <div className="rounded-2xl border border-white/8 bg-[#071225]/80 p-4">
            <h2 className="text-base font-extrabold text-white">Overall Score</h2>
            <div className="mx-auto mt-3 grid size-32 place-items-center rounded-full bg-[conic-gradient(from_8deg,#7b35ff_0_34%,#2f6bff_34%_82%,#15223c_82%_100%)] p-3 shadow-[0_0_38px_rgb(47_107_255_/_0.2)]">
              <div className="grid size-full place-items-center rounded-full bg-[#071225]">
                <div className="text-center">
                  <p className="text-4xl font-extrabold tracking-[-0.06em] text-white">8.2</p>
                  <p className="-mt-1 text-xl font-semibold text-muted-foreground">/10</p>
                </div>
              </div>
            </div>
            <p className="mt-3 flex items-center justify-center gap-2 text-base font-extrabold text-emerald-300">
              <Sparkles aria-hidden="true" className="size-5" />
              Top Performer
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#071225]/80 p-4">
            <h2 className="text-base font-extrabold text-white">Score Breakdown</h2>
            <div className="mt-4 space-y-2.5">
              {scoreRows.map(([label, score, width]) => (
                <div className="space-y-2" key={label}>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-slate-200">{label}</span>
                    <span className="font-semibold text-slate-300">{score}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <div
                      aria-hidden="true"
                      className="h-full rounded-full bg-[linear-gradient(90deg,#2f6bff,#6548ff)]"
                      style={{ width }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#071225]/80 p-4">
          <h2 className="text-base font-extrabold text-white">Topic Breakdown</h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {topicPills.map(({ className, label, level }) => (
              <span
                className={`inline-flex items-center gap-3 rounded-full px-3 py-2 text-xs font-extrabold ${className}`}
                key={label}
              >
                <span>{label}</span>
                <span>{level}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-[#071225]/80 p-4">
          <div className="flex items-center justify-between gap-4 text-sm">
            <h2 className="text-base font-extrabold text-white">Interview Progress</h2>
            <span className="text-slate-300">4 / 5 Completed</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
            <div
              aria-hidden="true"
              className="h-full w-[67%] rounded-full bg-[linear-gradient(90deg,#2f6bff,#6548ff)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LandingPageIntro({
  setupRef,
}: {
  setupRef: RefObject<HTMLDivElement | null>
}) {
  return (
    <section
      className="relative mx-auto flex min-h-[calc(100svh-4.75rem)] max-w-[1348px] flex-col justify-between gap-7 px-5 py-9 sm:px-8 lg:px-0 lg:py-10"
      id="home"
    >
      <div className="grid items-start gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
        <div className="relative z-10 max-w-[650px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]">
            <Sparkles aria-hidden="true" className="size-5 text-primary" />
            AI-Powered Interview Preparation
          </div>

          <h1 className="font-display mt-5 text-5xl font-extrabold leading-[1.08] tracking-[-0.055em] text-white sm:text-6xl lg:text-[3.95rem] xl:text-[4.05rem]">
            Ace Your Next
            <br />
            <span className="whitespace-nowrap bg-[linear-gradient(110deg,#2f6bff_0%,#4b7cff_52%,#8a5cff_100%)] bg-clip-text text-transparent">
              Technical Interview
            </span>
            <br />
            with AI
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Practice realistic technical interviews, receive detailed AI feedback,
            identify weak areas, and improve with personalized recommendations.
          </p>

          <button
            className="mt-8 inline-flex w-full max-w-[620px] items-center justify-center gap-6 rounded-2xl border border-white/18 bg-[linear-gradient(105deg,#2f6bff_0%,#4b68ff_48%,#7b35ff_100%)] px-8 py-6 text-3xl font-extrabold tracking-[-0.03em] text-white shadow-[0_0_40px_rgb(47_107_255_/_0.48)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgb(47_107_255_/_0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80"
            onClick={() => scrollToSetup(setupRef)}
            type="button"
          >
            <Sparkles aria-hidden="true" className="size-9 text-blue-100" />
            Start Interview
            <ArrowRight aria-hidden="true" className="size-10" />
          </button>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {proofPoints.map(({ description, icon: Icon, title }) => (
              <div className="flex items-center gap-3" key={title}>
                <span className="grid size-10 place-items-center rounded-full text-primary">
                  <Icon aria-hidden="true" className="size-7 stroke-[2.2]" />
                </span>
                <div>
                  <p className="whitespace-nowrap text-sm font-extrabold text-white">{title}</p>
                  <p className="whitespace-nowrap text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <LandingScorePreview />
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        {benefits.map(({ accent, description, icon: Icon, tags, title }) => (
          <article
            className="rounded-2xl border border-white/10 bg-[#071225]/78 p-4 shadow-[0_22px_70px_rgb(0_0_0_/_0.25)] backdrop-blur-xl"
            key={title}
          >
            <div className="flex items-start gap-4">
              <span
                className={`grid size-12 shrink-0 place-items-center rounded-xl text-white shadow-[0_0_28px_rgb(47_107_255_/_0.18)] ${
                  accent === "green"
                    ? "bg-emerald-500/25 text-emerald-200"
                    : accent === "amber"
                      ? "bg-amber-500/25 text-amber-200"
                      : accent === "violet"
                        ? "bg-violet-500/30 text-violet-100"
                        : "bg-primary/35 text-blue-100"
                }`}
              >
                <Icon aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h2 className="text-base font-extrabold text-white">{title}</h2>
                <p className="mt-1 text-sm leading-5 text-slate-300">{description}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  className={`rounded-lg px-2.5 py-1 text-[0.68rem] font-extrabold ${
                    accent === "green"
                      ? "bg-emerald-500/12 text-emerald-300"
                      : accent === "amber"
                        ? "bg-amber-500/12 text-amber-300"
                        : accent === "violet"
                          ? "bg-violet-500/14 text-violet-200"
                          : "bg-primary/12 text-blue-300"
                  }`}
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="flex items-center justify-center gap-2 text-center text-sm font-medium text-muted-foreground">
        <Shield aria-hidden="true" className="size-4 text-slate-400" />
        Your answers are private and used only for feedback.
      </p>
    </section>
  )
}

export function HomePage({
  error,
  interview,
  interviewResults,
  isReportLoading,
  isReportVisible,
  isLoading,
  onCompleteInterview,
  onRetryReport,
  onResultChange,
  onResultRemove,
  onStartNewInterview,
  onStartInterview,
  savedConfig,
  reportError,
  setupResetKey,
  sessionRef,
  setupRef,
}: HomePageProps) {
  return (
    <>
      {!interview ? <LandingPageIntro setupRef={setupRef} /> : null}

      {!interview ? (
        <section
          className="relative mx-auto grid max-w-[1488px] gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:gap-10 lg:px-8 lg:py-12 xl:px-12 2xl:px-0"
          id="setup"
        >
          <div
            className="flex flex-col gap-5"
            ref={setupRef}
            tabIndex={-1}
          >
          <InterviewConfigForm
            isLoading={isLoading}
            key={setupResetKey}
            onSubmit={onStartInterview}
          />
          {savedConfig ? <SavedConfigSummary config={savedConfig} /> : null}
          {isLoading ? (
            <section
              aria-live="polite"
              className="soft-panel flex items-center gap-3 rounded-lg p-5"
            >
              <LoaderCircle
                aria-hidden="true"
                className="size-5 animate-spin text-primary"
              />
              <div>
                <h2 className="font-semibold">
                  Generating interview questions
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  The AI is preparing a focused question set.
                </p>
              </div>
            </section>
          ) : null}

          {error ? (
            <section
              className="rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-100 shadow-[0_18px_40px_rgb(185_28_28_/_0.1)]"
              role="alert"
            >
              <h2 className="font-semibold">
                Could not generate the interview
              </h2>
              <p className="mt-1 text-sm leading-6">{error}</p>
            </section>
          ) : null}
          </div>
          <aside className="soft-panel hidden rounded-2xl p-6 lg:block">
            <h2 className="text-2xl font-extrabold text-white">Your Interview Summary</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Review your selections before generating the interview.
            </p>
            <div className="mt-6 space-y-4 border-t border-white/10 pt-6 text-sm">
              {[
                ["Role", "Frontend Developer"],
                ["Experience Level", "Mid-Level"],
                ["Interview Type", "Technical"],
                ["Question Count", "3 questions"],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between gap-4" key={label}>
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-extrabold text-blue-300">{value}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>
      ) : null}

      {interview && !isReportVisible && !reportError ? (
        <InterviewQuestions
          interview={interview}
          key={interview.interviewId}
          isReportLoading={isReportLoading}
          onCompleteInterview={onCompleteInterview}
          onResultChange={onResultChange}
          onResultRemove={onResultRemove}
          results={interviewResults}
          sessionRef={sessionRef}
        />
      ) : null}

      {interview && isReportLoading ? (
        <section
          aria-live="polite"
          className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:pb-20"
        >
          <div className="soft-panel flex items-start gap-3 rounded-lg p-5">
            <LoaderCircle
              aria-hidden="true"
              className="mt-0.5 size-5 animate-spin text-primary"
            />
            <div>
              <h2 className="font-semibold">Generating final report</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                The app is summarizing your scores, gaps, and recommended
                topics.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {interview && reportError ? (
        <section
          aria-live="assertive"
          className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:pb-20"
          role="alert"
        >
          <div className="flex items-start justify-between gap-4 rounded-lg border border-red-400/30 bg-red-500/10 p-5 text-red-100">
            <div className="flex items-start gap-3">
              <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
              <div>
                <h2 className="font-semibold">Final report unavailable</h2>
                <p className="mt-1 text-sm leading-6">{reportError}</p>
              </div>
            </div>
            <Button onClick={onRetryReport} type="button" variant="outline">
              <RotateCcw aria-hidden="true" className="size-4" />
              Retry final report
            </Button>
          </div>
        </section>
      ) : null}

      {interview && isReportVisible ? (
        <FinalReport
          config={savedConfig}
          interview={interview}
          onStartNewInterview={onStartNewInterview}
          results={interviewResults}
        />
      ) : null}
    </>
  );
}
