import {
  Bot,
  Code2,
  Crown,
  GraduationCap,
  Layers3,
  LoaderCircle,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { useEffect, useState, type FormEvent, type ReactNode } from 'react'

import { OptionGroup } from '@/components/interview/option-group'
import { Button } from '@/components/ui/button'
import {
  INTERVIEW_TYPES,
  QUESTION_COUNTS,
  LEVELS,
  ROLES,
  getLevelLabel,
  getRoleLabel,
  type InterviewConfig,
  type InterviewType,
  type Level,
  type Role,
  type QuestionCount,
} from '@/types/interview'

type InterviewConfigFormProps = {
  isLoading: boolean
  onConfigChange?: (config: InterviewConfig) => void
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

const roleDescriptions = {
  'frontend-developer': 'React, JavaScript, TypeScript, HTML, CSS, Performance',
  'backend-developer': 'Node.js, Python, databases, APIs, system design',
  'full-stack-developer': 'Frontend + Backend, databases, APIs, DevOps basics',
  'ai-engineer': 'Machine Learning, LLMs, Python, Data Science',
  'generative-ai-engineer': 'Prompting, agents, evaluation, model integration',
} satisfies Record<Role, string>

const levelDescriptions = {
  intern: 'Learning the basics and getting started',
  junior: '1-2 years of hands-on experience',
  'mid-level': '2-5 years of professional experience',
  senior: '5+ years of expert-level experience',
} satisfies Record<Level, string>

const interviewTypeDescriptions = {
  Technical: 'Focus on coding, algorithms, system design and problem solving',
  Behavioral: 'Focus on soft skills, leadership, teamwork and culture fit',
  Mixed: 'Combination of technical and behavioral questions',
} satisfies Record<InterviewType, string>

function SetupCardIcon({
  children,
  tone = 'blue',
}: {
  children: ReactNode
  tone?: 'blue' | 'green' | 'orange' | 'violet'
}) {
  return (
    <span
      className={`grid size-12 place-items-center rounded-xl shadow-[0_16px_36px_rgba(0,0,0,0.16)] ${
        tone === 'green'
          ? 'bg-[linear-gradient(145deg,rgba(30,110,66,0.94),rgba(11,43,32,0.98))] text-emerald-200'
          : tone === 'orange'
            ? 'bg-[linear-gradient(145deg,rgba(170,87,18,0.96),rgba(72,33,10,0.98))] text-orange-100'
            : tone === 'violet'
              ? 'bg-[linear-gradient(145deg,rgba(87,56,175,0.96),rgba(43,28,85,0.98))] text-violet-100'
              : 'bg-[linear-gradient(145deg,rgba(40,88,200,0.96),rgba(20,36,88,0.98))] text-blue-100'
      }`}
    >
      {children}
    </span>
  )
}

export function InterviewConfigForm({
  isLoading,
  onConfigChange,
  onSubmit,
}: InterviewConfigFormProps) {
  const [role, setRole] = useState<Role>('frontend-developer')
  const [level, setLevel] = useState<Level>('mid-level')
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical')
  const [questionCount, setQuestionCount] = useState<QuestionCount>(3)

  useEffect(() => {
    onConfigChange?.({ role, level, interviewType, questionCount })
  }, [interviewType, level, onConfigChange, questionCount, role])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ role, level, interviewType, questionCount })
  }

  return (
    <form className="relative flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex items-start gap-4 px-2">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[linear-gradient(145deg,rgba(40,53,112,0.96),rgba(16,25,47,0.98))] text-primary shadow-[0_0_34px_rgba(47,107,255,0.16)]">
          <Sparkles aria-hidden="true" className="size-7" />
        </span>
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-[3.1rem]">
            Create Your Interview
          </h2>
          <p className="mt-1 text-lg text-muted-foreground">
            Configure your interview session.
          </p>
        </div>
      </div>

      <OptionGroup
        columnsClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-5"
        description="Choose the role you want to practice for."
        disabled={isLoading}
        name="role"
        onChange={setRole}
        options={ROLES}
        renderDescription={(option) => roleDescriptions[option]}
        renderLabel={(option) => getRoleLabel(option)}
        renderLeading={(option) => {
          const Icon = roleIcons[option]
          const tone =
            option === 'backend-developer'
              ? 'green'
              : option === 'full-stack-developer'
                ? 'orange'
                : option === 'ai-engineer' || option === 'generative-ai-engineer'
                  ? 'violet'
                  : 'blue'

          return (
            <SetupCardIcon tone={tone}>
              <Icon aria-hidden="true" className="size-7" />
            </SetupCardIcon>
          )
        }}
        showSelectedIndicator
        size="feature"
        title="1. Select Role"
        value={role}
      />

      <OptionGroup
        columnsClassName="grid-cols-1 md:grid-cols-2 xl:grid-cols-4"
        description="Choose your current experience level."
        disabled={isLoading}
        name="level"
        onChange={setLevel}
        options={LEVELS}
        renderDescription={(option) => levelDescriptions[option]}
        renderLabel={(option) => getLevelLabel(option)}
        renderLeading={(option) => {
          const Icon = levelIcons[option]
          const tone =
            option === 'intern'
              ? 'blue'
              : option === 'junior'
                ? 'green'
                : option === 'senior'
                  ? 'violet'
                  : 'blue'

          return (
            <SetupCardIcon tone={tone}>
              <Icon aria-hidden="true" className="size-7" />
            </SetupCardIcon>
          )
        }}
        showSelectedIndicator
        size="feature"
        title="2. Select Experience Level"
        value={level}
      />

      <OptionGroup
        columnsClassName="grid-cols-1 lg:grid-cols-3"
        description="Choose the style of questions for this interview."
        disabled={isLoading}
        name="interviewType"
        onChange={setInterviewType}
        options={INTERVIEW_TYPES}
        renderDescription={(option) => interviewTypeDescriptions[option]}
        renderLabel={(option) => option}
        renderLeading={(option) => {
          const Icon = interviewTypeIcons[option]
          const tone =
            option === 'Behavioral'
              ? 'violet'
              : option === 'Mixed'
                ? 'orange'
                : 'blue'

          return (
            <SetupCardIcon tone={tone}>
              <Icon aria-hidden="true" className="size-7" />
            </SetupCardIcon>
          )
        }}
        showSelectedIndicator
        size="feature"
        title="3. Select Interview Type"
        value={interviewType}
      />

      <OptionGroup
        columnsClassName="grid-cols-5"
        description="Choose a focused session from 1 to 5 questions."
        disabled={isLoading}
        name="questionCount"
        onChange={setQuestionCount}
        options={QUESTION_COUNTS}
        renderDescription={(option) => (option === 1 ? 'question' : 'questions')}
        renderLabel={(option) => String(option)}
        size="compact"
        title="4. Select Number of Questions"
        value={questionCount}
      />

      <Button
        className="mt-0.5 h-14 rounded-[1.3rem] text-xl font-extrabold tracking-[-0.03em] shadow-[0_0_44px_rgba(47,107,255,0.28)]"
        disabled={isLoading}
        size="lg"
        type="submit"
      >
        {isLoading ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <Sparkles aria-hidden="true" className="size-7" />
        )}
        {isLoading ? 'Generating questions...' : 'Generate Interview'}
      </Button>

      <p className="flex items-center justify-center gap-2 text-center text-sm font-medium text-muted-foreground">
        <ShieldCheck aria-hidden="true" className="size-4 text-slate-400" />
        All selections are required to generate your interview.
      </p>
    </form>
  )
}
