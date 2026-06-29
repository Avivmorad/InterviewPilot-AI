import {
  AlertCircle,
  Code2,
  Crosshair,
  LoaderCircle,
  MessageSquareText,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import type { ReactNode, RefObject } from "react";

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
  supabaseAuth: ReactNode;
  sessionRef: RefObject<HTMLElement | null>;
  setupRef: RefObject<HTMLDivElement | null>;
};

const benefits = [
  {
    icon: Code2,
    title: "Role-specific practice",
    description: "Questions focused on your target engineering role.",
  },
  {
    icon: Crosshair,
    title: "Right level of difficulty",
    description: "Practice calibrated to your current experience.",
  },
  {
    icon: MessageSquareText,
    title: "Structured question sets",
    description:
      "Review focused questions and the concepts strong answers should cover.",
  },
];

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
  supabaseAuth,
  sessionRef,
  setupRef,
}: HomePageProps) {
  return (
    <>
      <section
        className="relative mx-auto grid max-w-[1488px] gap-8 px-5 py-6 sm:px-8 sm:py-8 lg:grid-cols-[minmax(380px,0.9fr)_minmax(520px,1.1fr)] lg:items-start lg:gap-10 lg:px-8 lg:py-7 xl:gap-16 xl:px-12 2xl:px-0"
        id="home"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[2%] top-12 hidden size-8 text-primary/45 lg:block"
        >
          <Sparkles className="size-8 float-slow" />
        </div>

        <div className="order-2 flex flex-col justify-center pt-4 lg:order-1 lg:pt-3">
          <div className="hero-hologram mb-1 hidden max-w-3xl lg:block">
            <span className="code-glyph">&lt;/&gt;</span>
          </div>
          <h1 className="font-display max-w-3xl text-4xl font-extrabold leading-[1.08] text-white sm:text-5xl lg:text-[3.35rem] xl:text-[4.15rem]">
            Practice smarter.
            <br />
            Interview with
            <br />
            <span className="aurora-text">confidence.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            AI-powered mock interviews tailored to your role and experience
            level. Get focused practice, clear feedback, and a roadmap to keep
            improving.
          </p>

          <div className="mt-7 grid gap-3 sm:max-w-2xl sm:grid-cols-3" id="how-it-works">
            {benefits.map(({ description, icon: Icon, title }) => (
              <div className="soft-panel group flex min-h-20 items-center gap-3 rounded-lg p-4" key={title}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary shadow-[0_0_20px_rgb(47_107_255_/_0.18)] transition-transform duration-200 group-hover:-translate-y-1">
                  <Icon aria-hidden="true" className="size-6" />
                </span>
                <div>
                  <h2 className="text-sm font-extrabold text-white">{title}</h2>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="order-1 flex flex-col gap-5 lg:order-2"
          ref={setupRef}
          tabIndex={-1}
        >
          <InterviewConfigForm
            isLoading={isLoading}
            key={setupResetKey}
            onSubmit={onStartInterview}
          />
          {savedConfig ? <SavedConfigSummary config={savedConfig} /> : null}
          {supabaseAuth}

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
      </section>

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
