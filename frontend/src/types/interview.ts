export const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'AI Engineer',
] as const

export const LEVELS = ['Junior', 'Mid-Level', 'Senior'] as const

export const INTERVIEW_TYPES = ['Technical', 'Behavioral', 'Mixed'] as const

export const QUESTION_COUNTS = [3, 5, 10] as const

export type Role = (typeof ROLES)[number]
export type Level = (typeof LEVELS)[number]
export type InterviewType = (typeof INTERVIEW_TYPES)[number]
export type QuestionCount = (typeof QUESTION_COUNTS)[number]
export type ApiConnectionStatus = 'checking' | 'connected' | 'unavailable'

export type InterviewConfig = {
  role: Role
  level: Level
  interviewType: InterviewType
  questionCount: QuestionCount
}

export type Difficulty = Lowercase<Level>

export type InterviewQuestion = {
  id: string
  topic: string
  difficulty: Difficulty
  question: string
  expectedConcepts: string[]
}

export type CreateInterviewResponse = {
  interviewId: string
  questions: InterviewQuestion[]
}
