import { LoaderCircle, Play } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { OptionGroup } from '@/components/interview/option-group'
import { Button } from '@/components/ui/button'
import {
  LEVELS,
  QUESTION_COUNTS,
  ROLES,
  type InterviewConfig,
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
  const [questionCount, setQuestionCount] = useState<QuestionCount>(5)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit({ role, level, questionCount })
  }

  return (
    <form
      className="flex flex-col gap-7 rounded-2xl border bg-card p-5 shadow-sm sm:p-7"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Set up your interview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
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
        description="Choose how many questions to include."
        disabled={isLoading}
        name="questionCount"
        onChange={setQuestionCount}
        options={QUESTION_COUNTS}
        renderLabel={(count) => `${count}`}
        title="Question count"
        value={questionCount}
      />

      <Button className="w-full" disabled={isLoading} size="lg" type="submit">
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
