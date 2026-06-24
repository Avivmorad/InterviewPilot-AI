import {
  Bot,
  Code2,
  Crown,
  GraduationCap,
  Layers3,
  LoaderCircle,
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

export function InterviewConfigForm({
  isLoading,
  onSubmit,
}: InterviewConfigFormProps) {
  const [role, setRole] = useState<Role>('frontend-developer')
  const [level, setLevel] = useState<Level>('mid-level')
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical')
  const [questionCount, setQuestionCount] = useState<QuestionCount>(5)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ role, level, interviewType, questionCount })
  }

  return (
    <form
      className="glass-panel neon-panel reveal-in relative flex flex-col gap-6 overflow-hidden rounded-lg p-6 sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="relative z-10 flex items-start gap-4">
        <Sparkles
          aria-hidden="true"
          className="mt-1 size-6 shrink-0 text-primary drop-shadow-[0_0_18px_rgb(47_107_255_/_0.8)]"
        />
        <div>
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-[2.15rem]">
            Set up your interview
          </h2>
          <p className="mt-2 text-base leading-7 text-muted-foreground">
            Choose a focus for this practice session.
          </p>
        </div>
      </div>

      <div className="relative z-10 grid gap-6">
        <OptionGroup
          description="Choose the role you want to practice for."
          disabled={isLoading}
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
          description="Choose how many questions to include."
          disabled={isLoading}
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
        {isLoading ? 'Generating questions...' : 'Start Interview'}
      </Button>
      <p className="relative z-10 flex items-center justify-center gap-2 text-center text-xs font-medium text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="size-4 text-slate-400" />
        Your answers are private and used only for feedback.
      </p>
    </form>
  )
}
