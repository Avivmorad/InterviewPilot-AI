import { CheckCircle2 } from 'lucide-react'

import type { CreateInterviewResponse } from '@/types/interview'

type InterviewQuestionsProps = {
  interview: CreateInterviewResponse
}

export function InterviewQuestions({ interview }: InterviewQuestionsProps) {
  return (
    <section
      aria-labelledby="questions-title"
      className="mx-auto max-w-7xl px-5 pb-12 sm:px-8 lg:pb-20"
    >
      <div className="border-t pt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight" id="questions-title">
              Generated interview questions
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Review the questions and expected concepts before starting your
              practice session.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            {interview.questions.length} questions
          </p>
        </div>

        <ol className="mt-7 grid gap-5">
          {interview.questions.map((question, index) => (
            <li className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6" key={question.id}>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className="rounded-md bg-primary px-2.5 py-1 text-primary-foreground">
                  Question {index + 1}
                </span>
                <span className="rounded-md bg-secondary px-2.5 py-1 text-secondary-foreground">
                  {question.topic}
                </span>
                <span className="capitalize text-muted-foreground">
                  {question.difficulty}
                </span>
              </div>

              <p className="mt-4 text-base font-medium leading-7">{question.question}</p>

              <div className="mt-5 border-t pt-4">
                <h3 className="text-sm font-semibold">Expected concepts</h3>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {question.expectedConcepts.map((concept) => (
                    <li className="flex items-start gap-2 text-sm text-muted-foreground" key={concept}>
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-primary"
                      />
                      <span>{concept}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
