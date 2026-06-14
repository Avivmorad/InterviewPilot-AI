export const INTERVIEW_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI Engineer',
] as const

export const INTERVIEW_LEVELS = ['Junior', 'Mid-Level', 'Senior'] as const
export const QUESTION_COUNTS = [3, 5, 10] as const

export type Role = (typeof INTERVIEW_ROLES)[number]
export type Level = (typeof INTERVIEW_LEVELS)[number]
export type QuestionCount = (typeof QUESTION_COUNTS)[number]
export type Difficulty = Lowercase<Level>

export type InterviewQuestion = {
  id: string
  topic: string
  difficulty: Difficulty
  question: string
  expectedConcepts: string[]
}

export type CreateInterviewRequest = {
  role: Role
  level: Level
  questionCount: QuestionCount
}

export type CreateInterviewResponse = {
  interviewId: string
  questions: InterviewQuestion[]
}
