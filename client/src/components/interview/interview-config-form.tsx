import {
  Bot,
  Code2,
  Crown,
  GraduationCap,
  Layers3,
  LoaderCircle,
  Info,
  MessageSquareText,
  Play,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { OptionGroup } from '@/components/interview/option-group'
import { Button } from '@/components/ui/button'
import {
  INTERVIEW_TYPES,
  LEVELS,
  QUESTION_COUNTS,
  ROLES,
  getLevelLabel,
  getRoleLabel,
  type InterviewConfig,
  type InterviewType,
  type Level,
  type QuestionCount,
  type Role,
} from '@/types/interview'

type InterviewConfigFormProps = {
  isLoading: boolean
  onSubmit: (config: InterviewConfig) => void | Promise<void>
}

const roleIcons = {
  'frontend-developer': Code2,
  'backend-developer': Layers3,
  'full-stack-developer': Layers3,
  'ai-engineer': Bot,
  'generative-ai-engineer': Sparkles,
} satisfies Record<Role, typeof Code2>

const levelIcons = {
  intern: GraduationCap,
  junior: UserRound,
  'mid-level': UserRound,
  senior: Crown,
} satisfies Record<Level, typeof UserRound>

const interviewTypeIcons = {
  Technical: Code2,
  Behavioral: MessageSquareText,
  Mixed: Layers3,
} satisfies Record<InterviewType, typeof Code2>

const setupHelpText =
  'Pick the role, level, interview type, and question count so the practice session matches your goal.'
const startHelpText =
  'Starts the interview right away using the selections you made above.'

export function InterviewConfigForm({
  isLoading,
  onSubmit,
}: InterviewConfigFormProps) {
  const [role, setRole] = useState<Role>('frontend-developer')
  const [level, setLevel] = useState<Level>('mid-level')
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical')
  const [questionCount, setQuestionCount] = useState<QuestionCount>(3)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ role, level, interviewType, questionCount })
  }

  return (
    <form
      className="glass-panel neon-panel reveal-in relative flex flex-col gap-5 overflow-hidden rounded-lg p-5 pb-24 sm:gap-6 sm:p-8 sm:pb-8"
      onSubmit={handleSubmit}
    >
      <div className="relative z-10 flex items-start gap-4">
        <Sparkles
          aria-hidden="true"
          className="mt-1 size-5 shrink-0 text-primary drop-shadow-[0_0_18px_rgb(47_107_255_/_0.8)] sm:size-6"
        />
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <h2 className="font-display text-2xl font-extrabold text-white sm:text-[2.15rem]">
              Set up your interview
            </h2>
            <button
              aria-describedby="setup-help"
              aria-label="Setup help"
              className="group relative mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-slate-300 transition hover:border-primary/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              title={setupHelpText}
              type="button"
            >
              <Info aria-hidden="true" className="size-3.5" />
              <span
                className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-64 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-left text-xs font-medium leading-5 text-slate-200 opacity-0 shadow-[0_18px_30px_rgba(0,0,0,0.35)] transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                id="setup-help"
                role="tooltip"
              >
                {setupHelpText}
              </span>
            </button>
          </div>
          <p className="mt-1.5 text-sm leading-6 text-muted-foreground sm:mt-2 sm:text-base sm:leading-7">
            Choose a focus for this practice session.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid gap-6">
        <OptionGroup
          description="Choose the role you want to practice for."
          disabled={isLoading}
          helpText="This sets the interview focus so the questions match the job you want."
          name="role"
          onChange={setRole}
          options={ROLES}
          renderLabel={(option) => {
            const Icon = roleIcons[option]

            return (
              <>
                <Icon aria-hidden="true" className="hidden size-5 text-primary min-[520px]:block" />
                <span>{getRoleLabel(option)}</span>
              </>
            )
          }}
          title="Role"
          value={role}
        />

        <OptionGroup
          description="Select your current experience level."
          disabled={isLoading}
          helpText="Pick the difficulty that best matches your current experience."
          name="level"
          onChange={setLevel}
          options={LEVELS}
          renderLabel={(option) => {
            const Icon = levelIcons[option]

            return (
              <>
                <Icon aria-hidden="true" className="hidden size-5 text-primary min-[520px]:block" />
                <span>{getLevelLabel(option)}</span>
              </>
            )
          }}
          title="Level"
          value={level}
        />

        <OptionGroup
          description="Choose the style of questions for this interview."
          disabled={isLoading}
          helpText="Technical, behavioral, or mixed changes the kind of questions you will get."
          name="interviewType"
          onChange={setInterviewType}
          options={INTERVIEW_TYPES}
          renderLabel={(option) => {
            const Icon = interviewTypeIcons[option]

            return (
              <>
                <Icon aria-hidden="true" className="hidden size-5 text-primary min-[520px]:block" />
                <span>{option}</span>
              </>
            )
          }}
          title="Interview type"
          value={interviewType}
        />

        <OptionGroup
          description="Use the stable MVP-length interview."
          disabled={isLoading}
          helpText="The MVP keeps this short at 3 questions so the flow stays focused."
          name="questionCount"
          onChange={setQuestionCount}
          options={QUESTION_COUNTS}
          renderLabel={(count) => `${count}`}
          title="Question count"
          value={questionCount}
        />
      </div>

      <Button
        className="relative z-10 mt-1 h-14 w-full text-lg font-extrabold"
        disabled={isLoading}
        size="lg"
        type="submit"
      >
        {isLoading ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <Play aria-hidden="true" />
        )}
        {isLoading ? 'Generating questions...' : 'Start interview'}
      </Button>
      <div className="relative z-10 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-xs font-medium leading-5 text-muted-foreground">
        <button
          aria-describedby="start-help"
          aria-label="Start interview help"
          className="group relative mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-slate-300 transition hover:border-primary/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
          title={startHelpText}
          type="button"
        >
          <Info aria-hidden="true" className="size-3.5" />
          <span
            className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-64 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-left text-xs font-medium leading-5 text-slate-200 opacity-0 shadow-[0_18px_30px_rgba(0,0,0,0.35)] transition duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
            id="start-help"
            role="tooltip"
          >
            {startHelpText}
          </span>
        </button>
        <div className="space-y-1">
          <p className="text-slate-200">Quick start tip</p>
          <p>Use this when you&apos;re ready to generate question 1 from the settings above.</p>
        </div>
      </div>
      <p className="relative z-10 flex items-center justify-center gap-2 text-center text-xs font-medium text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="size-4 text-slate-400" />
        Your answers are private and used only for feedback.
      </p>
    </form>
  )
}
