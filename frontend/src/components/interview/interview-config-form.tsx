import { LoaderCircle, Play } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { OptionGroup } from '@/components/interview/option-group'
import { Button } from '@/components/ui/button'
import {
  INTERVIEW_TYPES,
  LEVELS,
  QUESTION_COUNTS,
  ROLES,
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

export function InterviewConfigForm({
  isLoading,
  onSubmit,
}: InterviewConfigFormProps) {
  const [role, setRole] = useState<Role>('Frontend Developer')
  const [level, setLevel] = useState<Level>('Mid-Level')
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical')
  const [questionCount, setQuestionCount] = useState<QuestionCount>(5)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ role, level, interviewType, questionCount })
  }

  return (
    <form
      className="flex flex-col gap-5 rounded-[1.45rem] border border-slate-200 bg-white p-6 shadow-[0_28px_70px_rgba(37,76,180,0.18)] sm:p-8"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-2xl font-bold tracking-[-0.02em]">Set up your interview</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Choose a focus for this practice session.
        </p>
      </div>

      <OptionGroup
        description="Choose the role you want to practice for."
        disabled={isLoading}
        name="role"
        onChange={setRole}
        options={ROLES}
        title="Role"
        value={role}
      />

      <OptionGroup
        description="Select your current experience level."
        disabled={isLoading}
        name="level"
        onChange={setLevel}
        options={LEVELS}
        title="Level"
        value={level}
      />

      <OptionGroup
        description="Choose the style of questions for this interview."
        disabled={isLoading}
        name="interviewType"
        onChange={setInterviewType}
        options={INTERVIEW_TYPES}
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

      <Button
        className="mt-1 h-14 w-full rounded-xl text-base font-bold shadow-[0_14px_30px_rgba(36,71,232,0.3)]"
        disabled={isLoading}
        size="lg"
        type="submit"
      >
        {isLoading ? (
          <LoaderCircle aria-hidden="true" className="animate-spin" />
        ) : (
          <Play aria-hidden="true" />
        )}
        {isLoading ? 'Generating Questions...' : 'Start Interview'}
      </Button>
    </form>
  )
}
